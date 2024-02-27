import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import DatePicker from "react-datepicker";
import styled from 'styled-components';
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

  return (
    <div className="calendar-container">
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
      
    <AppInputContainer placeholder='Title'></AppInputContainer>
      <RightContainer
      >
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
      </RightContainer>
    </div>
  );
}

//입력 컨테이너
const AppInputContainer = styled.input`
  width: 200px;
  height: 30px;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  
`;

// 우측 컨테이너
const RightContainer = styled.div`
  display : flex;
  margin
`