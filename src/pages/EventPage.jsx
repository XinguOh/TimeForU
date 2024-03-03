import React, { useEffect, useState } from "react";
import MyTable from "../components/MyTable";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SignIn from "../components/SignIn";
import ShowDate from "../components/ShowDate";

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [login, setLogin] = useState(false); //로그인 여부
  const [eventData, setEventData] = useState(null);

  /* -----------------------API 호출---------------------- */
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

  return (
    <EventPageContainer>
      <TitleContainer>{eventData.title}</TitleContainer>
      <ScheduleContainer>
        {login ? (
          <ScheduleContainer>
            <MyTable value={1} eventData={eventData} />
            <MyTable value={2} eventData={eventData} />
          </ScheduleContainer>
        ) : (
          <ScheduleContainer style={{gap : "270px"}}>
            <div>{""}</div>
            <SignIn setLogin={setLogin} />
          </ScheduleContainer>
        )}

        <MyTable value={3} eventData={eventData} />
        <ShowDate />
      </ScheduleContainer>
    </EventPageContainer>
  );
}
const EventPageContainer = styled.div`
  font-family: "Lato";
  color: #1a237e;
`;

// 스타일 컴포넌트
const TitleContainer = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScheduleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;
`;
