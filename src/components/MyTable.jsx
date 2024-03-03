import React, { useState } from "react";
import styled from "styled-components";

export default function MyTable({value, eventData}) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  // 드래그 시작과 끝을 관리하기 위한 상태
  const [dragStartIndex, setDragStartIndex] = useState(null);
  const [dragEndIndex, setDragEndIndex] = useState(null);
  // 드래그 시작 시 선택 상태를 확인하고 저장하기 위한 상태 추가
  const [isInitiallySelected, setIsInitiallySelected] = useState(false);

  /* -----------------------시간 관련---------------------- */
  const groupTimeSlotsByEventDates = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    const timeSlots = [];
    // 시작 시간 저장 (예: 9시)
    const startHour = start.getHours();

    while (start <= end) {
      timeSlots.push(new Date(start));
      start.setMinutes(start.getMinutes() + 15); // 15분 증가

      // start의 시간이 end의 시간과 같아지면 다음 날로 넘어감
      if (start.getHours() === end.getHours()) {
        start.setDate(start.getDate() + 1); // 다음 날로 설정
        start.setHours(startHour, 0, 0, 0); // 다음 날의 시작 시간을 오전 9시로 설정
      }
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

  /* -----------------------출력 관련---------------------- */
  return (
    <AppContainer>
    <h2>{value === 1 ?
     "가능한 일정" : value === 2 ? 
      "변경 가능한 일정": 
      "총 가능 일정"}</h2>
      <Calendar>
        <TimeColumn>
          {hours.map((hour, index) => (
            <TimeCell key={index}>{formatTime(hour)}</TimeCell>
          ))}
        </TimeColumn>
        <DayContainer>
          <DayColumn>
            {formattedDates.map((date) => (
              <DayHeader>{date}</DayHeader>
            ))}
          </DayColumn>

          <SlotContainer>
            {formattedDates.map((formattedDate) => (
              <div key={formattedDate}>
                {timeSlots.map((time,index) => {
                  const timeAsString = formatDay(time); // time을 formattedDate와 동일한 형식으로 변환
                  return (
                    timeAsString === formattedDate && (
                      <SlotCell
                        key={`${time.getTime()}`}
                        onMouseDown={() => handleMouseDown(index)}
                        onMouseOver={() => handleMouseOver(index)}
                        onMouseUp={handleMouseUp}
                        $isSelected={selectedSlots.includes(index)}
                      />
                    )
                  );
                })}
              </div>
            ))}
          </SlotContainer>
        </DayContainer>
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
    if (currentHour.getHours() === endTime.getHours() + 1) {
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
  margin-left : 100px;
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
  width : 50px;
`;

const TimeCell = styled.div`
  margin: 0 5px 22px 0;
  text-align: end;
  &:first-child {
    margin-top: 30px;
  }
`;
const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const DayColumn = styled.div`
  display: flex;
  flex-direction: row;
`;

const DayHeader = styled.div`
  width: 40px;
  margin-bottom: 5px;
  font-size: 12px;
  text-align: center;
`;
const SlotContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid black;
`;

const SlotCell = styled.div`
  height: 8px;
  width: 40px;
  background-color: ${(props) => (props.$isSelected ? "#007bff" : "#f0f0f0")};
  cursor: pointer;
  border-right: 1px solid black;

  &:nth-child(2n) {
    border-bottom: 1px dashed black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
  &:nth-child(4n) {
    border-bottom: 1px solid black; // 짝수 번째 SlotCell의 하단 테두리를 점선으로 설정
  }
`;
