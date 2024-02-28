import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme file
import "react-datepicker/dist/react-datepicker.css"; // DatePicker style
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // 현재 날짜를 가져온 후, 시간을 오전 9시로 설정
  const initialStartTime = new Date();
  initialStartTime.setHours(9, 0, 0, 0); // 시간을 오전 9시 0분 0초로 설정

  // 현재 날짜를 가져온 후, 시간을 오후 11시로 설정
  const initialEndTime = new Date();
  initialEndTime.setHours(22, 0, 0, 0); // 시간을 오후 10시 0분 0초로 설정

  // useState를 사용하여 startTime과 endTime의 기본값 설정
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    // Reset default time only for endTime when selecting date range
    setEndTime(ranges.selection.endDate); // Only update endTime
  };
  const handleButtonClick = async () => {
    // 제목이 비어 있는지 확인
    if (!title.trim()) {
      // trim()을 사용하여 공백만 있는 경우도 처리
      alert("Please enter a title for the Meet."); // 경고 메시지 표시
      return; // 함수 실행 중단
    }
    // 날짜와 시간을 결합하는 함수
    const combineDateAndTime = (date, time) => {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
    };

    const startDateTime = combineDateAndTime(dateRange[0].startDate, startTime);
    const endDateTime = combineDateAndTime(dateRange[0].endDate, endTime);

    const eventDetails = {
      title: title,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    // 서버에 데이터 전송
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });
      const data = await response.json();
      console.log(data); // 생성된 랜덤 링크를 확인

      // 생성된 링크로 리디렉션
      const url = new URL(data.link);
      const path = url.pathname; // 도메인을 제외한 경로 추출
      navigate(path); // 리디렉션 실행
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  return (
    <CalendarContainer>
      <AppInputContainer
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      ></AppInputContainer>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <DateRangePicker
          ranges={dateRange}
          onChange={handleSelect}
          months={2} // 2개월 표시
          style={{
            width: "500px", // 예시: 너비 500px
            height: "250px", // 예시: 높이 400px
            lineHeight: "30px", // 예시: 날짜 선택 영역 높이 30px
          }}
        />
        <DateContainer>
          <div>
            <h2>Start Time :</h2>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="my-custom-datepicker" // Custom class for styling
            />
          </div>
          <div>
            <h2>End Time :</h2>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)} // Use setEndTime here
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="my-custom-datepicker" // Custom class for styling
            />
          </div>

          <SubmitButton onClick={handleButtonClick}>
            Create Meet
          </SubmitButton>
        </DateContainer>
      </div>
    </CalendarContainer>
  );
}

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; // Add space between elements
  margin-top: 10px;
  align-items: center;
`;

//입력 컨테이너
const AppInputContainer = styled.input`
  width: 200px;
  height: 30px;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  border-radius : 5px;
  border : 1px solid black;
`;

// 날짜 컨테이너
const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  
`;

const SubmitButton = styled.div`
  display: flex;
  margin-top: 30px;
  height: 40px;
  width: 181px;
  border: 1px solid black;
  border-radius : 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #70a7ff;
  color: white;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: #1a237e;
  }
`;
