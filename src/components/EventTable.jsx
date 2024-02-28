import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function EventTable() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);
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

  // 날짜 및 시간 슬롯 그룹화 함수
  const groupTimeSlotsByEventDates = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
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
        if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0) {
          // 12:00AM(자정)일 때는 다음 날로 처리
          start = new Date(start.setDate(start.getDate() + 1));
          break; // 다음 날로 넘어갔으므로 현재 날짜에 대한 작업 종료
        }
  
        dayGroups[dayKey].push(new Date(currentTime));
        currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000); // 15분 증가
      }
  
      if (!(currentTime < endOfDay && currentTime <= end)) {
        // 현재 시간이 자정을 넘었는지 확인
        start = new Date(start.setDate(start.getDate() + 1)); // 다음 날짜로 이동
      }
      start.setHours(0, 0, 0, 0); // 자정으로 설정
    }
  
    return dayGroups;
  };
  

  // 시간대를 선택하는 함수
  const handleSlotClick = (day, slot) => {
    const newSelectedSlots = [...selectedSlots];
    const selectedSlot = { day, slot };
    const selectedIndex = newSelectedSlots.findIndex(
      (item) => item.day === day && item.slot === slot
    );

    if (selectedIndex === -1) {
      newSelectedSlots.push(selectedSlot);
    } else {
      newSelectedSlots.splice(selectedIndex, 1);
    }

    setSelectedSlots(newSelectedSlots);
  };

  // 마우스 다운 이벤트 핸들러
  const handleMouseDown = () => {
    setIsMouseDown(true);
    setSelectedSlots([]); // 새로운 드래그 시작 시 선택된 슬롯 초기화
  };

  // 마우스 업 이벤트 핸들러
  const handleMouseUp = () => {
    setIsMouseDown(false);
    setLastSelectedIndex(-1); // 드래그가 종료될 때 마지막 선택 인덱스 초기화
  };

  // 슬롯에 마우스 오버 이벤트 핸들러
  const handleMouseOver = (day, slot, index) => {
    if (isMouseDown) {
      if (lastSelectedIndex === -1) {
        setLastSelectedIndex(index);
      } else {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);

        const newSelectedSlots = [];
        for (let i = start; i <= end; i++) {
          const selectedSlot = {
            day,
            slot: eventData.startDate + i * 15 * 60 * 1000,
          };
          newSelectedSlots.push(selectedSlot);
        }

        setSelectedSlots(newSelectedSlots);
      }
    }
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
                onClick={() => handleSlotClick(day, slot)}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseOver={() => handleMouseOver(day, slot, index)}
                isSelected={selectedSlots.some(
                  (item) => item.day === day && item.slot === slot
                )}
              />
            ))}
            </SlotContainer>
          </DayColumn>
        ))}
      </Calendar>
      <SelectedSlots>
        <h3>Selected Slots</h3>
        <ul>
          {selectedSlots.map((item, index) => (
            <li key={index}>
              {formatSelectedSlot(item.day, item.slot)}
            </li>
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
  }

  return hours;
};

// 시간 형식 지정 함수
const formatTime = (time) => {
  if (time instanceof Date) {
    return time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } else {
    return ""; // 혹은 다른 기본 값으로 대체할 수 있습니다.
  }
};

// 선택된 슬롯의 날짜와 시간을 포맷하는 함수
const formatSelectedSlot = (day, slot) => {
  const date = new Date(day);
  const formattedDate = `${date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} ${getDayOfWeek(date)}`;
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
  margin-bottom: 30px;
  text-align: end;
  &:first-child {
    margin-top: 43px;
  }
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5px;
`;

const DayHeader = styled.div`
  width: 40px;
  margin-bottom: 10px;
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
