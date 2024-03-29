import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function EventTable() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }
        return response.json();
      })
      .then((data) => {
        setEventData(data);
        document.title = `Meet : ${data.title}` || "Meet: For U";
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
        alert("존재하지 않는 링크입니다. 새로 생성해주세요.");
        navigate("/");
      });
  }, [id, navigate]);

  
  const groupTimeSlotsByEventDates = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    console.log(start, end);
    const dayGroups = {};
  
    while (start <= end) {
      const dayKey = start.toISOString().split("T")[0]; // YYYY-MM-DD 형식의 키
      if (!dayGroups[dayKey]) {
        dayGroups[dayKey] = [];
      }
  
      let currentTime = new Date(start);
  
      const endOfDay = new Date(currentTime);
      endOfDay.setHours(24, 0, 0, 0); // 현재 날짜의 자정
  
      while (currentTime < endOfDay && currentTime <= end) {
        dayGroups[dayKey].push(new Date(currentTime));
        currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000); // 15분 증가
      }
  
      start = new Date(start.setDate(start.getDate() + 1)); // 다음 날짜로 이동
      start.setHours(0, 0, 0, 0); // 자정으로 설정
    }
  
    return dayGroups;
  };
  

  // 드래그 시작과 끝을 관리하기 위한 상태
  const [dragStartIndex, setDragStartIndex] = useState(null);
  const [dragEndIndex, setDragEndIndex] = useState(null);
  // 드래그 시작 시 선택 상태를 확인하고 저장하기 위한 상태 추가
  const [isInitiallySelected, setIsInitiallySelected] = useState(false);

  const handleMouseDown = (index) => {
    setIsMouseDown(true);
    setDragStartIndex(index);
    setDragEndIndex(index); // 드래그 시작 시, 시작점과 끝점 동일하게 설정
    setIsInitiallySelected(selectedSlots.includes(index));
  };

  const handleMouseOver = (index) => {
    if (isMouseDown) {
      setDragEndIndex(index);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    // 드래그 종료 시 선택 범위 내의 슬롯들에 대한 선택 상태 토글
    const newSelectedSlots = new Set(selectedSlots);
    for (
      let i = Math.min(dragStartIndex, dragEndIndex);
      i <= Math.max(dragStartIndex, dragEndIndex);
      i++
    ) {
      if (isInitiallySelected) {
        newSelectedSlots.delete(i); // 이미 선택된 상태였다면 선택 해제
      } else {
        newSelectedSlots.add(i); // 선택되지 않은 상태였다면 선택
      }
    }
    setSelectedSlots(Array.from(newSelectedSlots));
    setDragStartIndex(null);
    setDragEndIndex(null);
    setIsInitiallySelected(false); // 초기 선택 상태 리셋
  };
  
  if (!eventData) {
    return <div>Loading...</div>;
  }

  const timeSlots = groupTimeSlotsByEventDates(
    eventData.startDate,
    eventData.endDate
  );

  // 시작 시간과 종료 시간을 기반으로 시간 배열 생성
  const startTime = new Date(eventData.startDate);
  const endTime = new Date(eventData.endDate);

  const hours = generateHoursArray(startTime, endTime);

  return (
    <AppContainer>
      <h2>{eventData.title}</h2>
      <Calendar>
        <TimeColumn>
          {hours.map((hour, index) => (
            <TimeCell key={index}>{formatTime(hour)}</TimeCell>
          ))}
        </TimeColumn>
        {Object.entries(timeSlots).map(([day, slots]) => (
          <DayColumn key={day}>
            <DayHeader>{formatDay(day)}</DayHeader>
            <SlotContainer>
              {slots.map((slot, index) => (
                <SlotCell
                  key={index}
                  onMouseDown={() => handleMouseDown(index)}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseUp={handleMouseUp}
                  isSelected={selectedSlots.includes(index)}
                ></SlotCell>
              ))}
            </SlotContainer>
          </DayColumn>
        ))}
      </Calendar>
      <SelectedSlots>
        <h3>Selected Slots</h3>
        <ul>
          {selectedSlots.map((item, index) => (
            <li key={index}>{formatSelectedSlot(item.day, item.slot)}</li>
          ))}
        </ul>
      </SelectedSlots>
    </AppContainer>
  );
}

// 시작 시간과 종료 시간을 기반으로 시간 배열 생성하는 함수
const generateHoursArray = (startTime, endTime) => {
  const hours = [];
  let currentHour = new Date(startTime);
  while (currentHour <= endTime) {
    hours.push(new Date(currentHour));
    currentHour = new Date(currentHour.getTime() + 60 * 60 * 1000); // 1시간 증가
    console.log(currentHour.getHours());
    if (currentHour.getHours() === 1) {
      return hours;
    }
  }
  return hours;
};

// 시간 형식 지정 함수
const formatTime = (time) => {
  if (time instanceof Date) {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    return ""; // 혹은 다른 기본 값으로 대체할 수 있습니다.
  }
};

// 선택된 슬롯의 날짜와 시간을 포맷하는 함수
const formatSelectedSlot = (day, slot) => {
  const date = new Date(day);
  const formattedDate = `${date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  })} ${getDayOfWeek(date)}`;
  const time = new Date(slot);
  const formattedTime = formatTime(time);
  return `${formattedDate} ${formattedTime}`;
};

// 날짜 형식 지정 함수 (월, 일, 요일)
const formatDay = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "2-digit" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const dayOfWeek = getDayOfWeek(date);
  return `${month}.${day} ${dayOfWeek}`;
};

// 요일 구하기 함수
const getDayOfWeek = (date) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// 스타일 컴포넌트
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Lato";
  color: #1a237e;
`;

const Calendar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 10px;
`;

const TimeCell = styled.div`
  margin: 0 5px 30px 0;
  text-align: end;
  &:first-child {
    margin-top: 35px;
  }
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const DayHeader = styled.div`
  width: 40px;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: center;
`;
const SlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;

const SlotCell = styled.div`
  height: 10px;
  width: 40px;
  background-color: ${(props) => (props.isSelected ? "#007bff" : "#f0f0f0")};
  cursor: pointer;

  &:nth-child(2n) {
    border-bottom: 1px dashed black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
  &:nth-child(4n) {
    border-bottom: 1px solid black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
`;

const SelectedSlots = styled.div`
  margin-top: 20px;
  h3 {
    margin-bottom: 10px;
  }
  ul {
    padding-left: 20px;
  }
`;
