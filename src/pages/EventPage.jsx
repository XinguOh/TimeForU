import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

export default function EventPage() {
  const { id } = useParams(); // URL에서 id 값을 가져옴
  const [eventData, setEventData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/events/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Event not found");
        }
        return response.json();
      })
      .then((data) => setEventData(data))
      .catch((error) => {
        console.error("Error fetching event data:", error);
        alert("존재하지 않는 링크입니다. 새로 생성해주세요.");
        navigate("/"); // 에러 발생 시 홈페이지로 리디렉션
      });
  }, [id, navigate]); // 의존성 배열에 navigate 추가

  if (!eventData) {
    // 데이터 로딩 중이거나 로딩한 데이터가 없을 때 처리
    return <div>Loading...</div>;
  }
  // eventData가 null 또는 undefined가 아닐 때만 map 함수를 호출
  const timeSlots =
    eventData && eventData.availability
      ? eventData.availability.map((timeSlot, index) => (
          <TimeSlot key={index}>
            {timeSlot.time}:{" "}
            {timeSlot.isAvailable ? "Available" : "Not Available"}
          </TimeSlot>
        ))
      : null;

  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <AppContainer>
    <h1>Meet : For U</h1>
      <h2>{eventData.title}</h2>
      <AvailabilityContainer>
        <p>Start Date: {new Date(eventData.startDate).toLocaleString()}</p>
        <p>End Date: {new Date(eventData.endDate).toLocaleString()}</p>
        <p>Mouseover the Calendar to See Who Is Available</p>
        <Calendar>{timeSlots}</Calendar>
      </AvailabilityContainer>
    </AppContainer>
  );
}

//전체 앱 컨테이너
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Lato";
  color: #1a237e;
`;

const AvailabilityContainer = styled.div`
  text-align: center;
`;

const Calendar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const TimeSlot = styled.div`
  background-color: #ccc;
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  &:hover {
    background-color: #3d91ff;
    color: white;
  }
`;