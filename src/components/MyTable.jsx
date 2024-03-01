import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function MyTable() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // 선택된 슬롯 상태 추가
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

  if (!eventData) {
    return <div>Loading...</div>;
  }

  const groupTimeSlotsByEventDates = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    const dayKey = start.toISOString().split("T")[0];

    const timeSlots = [];

    while (start < end && start.getHours() !== 0) {
      timeSlots.push(new Date(start));
      start.setMinutes(start.getMinutes() + 15);
    }

    return timeSlots;
  };

  const startTime = new Date(eventData.startDate);
  const endTime = new Date(eventData.endDate);
  const hours = generateHoursArray(startTime, endTime);

  const formattedDates = [];
  const currentDate = new Date(startTime);
  while (currentDate <= new Date(endTime)) {
    const formattedDate = formatDay(currentDate);
    formattedDates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const timeSlots = groupTimeSlotsByEventDates(
    eventData.startDate,
    eventData.endDate
  );

  // 슬롯 클릭 시 선택된 슬롯 변경 및 출력
  const handleSlotClick = (index) => {
    setSelectedSlot(index);
    console.log(timeSlots[index]);
  };

  return (
    <AppContainer>
      <h2>{eventData.title}</h2>
      <Calendar>
        <TimeColumn>
          {hours.map((hour, index) => (
            <TimeCell key={index}>{formatTime(hour)}</TimeCell>
          ))}
        </TimeColumn>
        {formattedDates.map((date) => (
          <DayColumn key={date}>
            <DayHeader>{date}</DayHeader>
            <SlotContainer>
              {timeSlots.map((time, index) => (
                <SlotCell
                key ={index}
                  $isSelected={selectedSlot === index} // 선택된 슬롯에 따라 배경색 변경
                  onClick={() => handleSlotClick(index)} // 클릭 이벤트 처리
                />
              ))}
            </SlotContainer>
          </DayColumn>
        ))}
      </Calendar>
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
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "#f0f0f0")};
  cursor: pointer;

  &:nth-child(2n) {
    border-bottom: 1px dashed black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
  &:nth-child(4n) {
    border-bottom: 1px solid black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
`;
