import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme file
import "react-datepicker/dist/react-datepicker.css"; // DatePicker style
import "./Calendar.css";

export default function MyCalendarWithTime() {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Separate state variables for startTime and endTime
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    // Reset default time only for endTime when selecting date range
    setEndTime(ranges.selection.endDate); // Only update endTime
  };
  const handleButtonClick = async () => {
    const eventDetails = {
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
      startTime,
      endTime,
    };
  
    const response = await fetch('http://localhost:3001/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventDetails),
    });
  
    const responseData = await response.json();
    console.log(responseData.message);
  };

  return (
    <CalendarContainer>
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
        
      <SubmitButton onClick={handleButtonClick}>일정 생성하기</SubmitButton>
      </DateContainer>
    </CalendarContainer>
  );
}

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; // Add space between elements
  margin-top: 10px;
`;


// 날짜 컨테이너
const DateContainer = styled.div`
  display : flex;
  flex-direction : column;
  margin-left : 20px;
`;

const SubmitButton = styled.div`
display: flex;
margin-top : 30px;
height : 40px;
width : 183px;
border : 1px solid black;
border-radius : 10px;
align-items : center;
justify-content : center;
cursor : pointer;
background-color : white;
color : black;
transition : 0.2s ease-in-out;
&:hover {
  background-color : #3d91ff;
}
`