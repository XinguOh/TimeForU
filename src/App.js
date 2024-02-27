import React from 'react';
import MyCalendarWithTime from './components/MyCalendarWithTime';
import styled from 'styled-components';

export default function App() {
  return (
    <AppContainer>
      <h1>Meet For U</h1>
      <MyCalendarWithTime/>
    </AppContainer>
  );
}

//전체 앱 컨테이너
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato';
  color: white;
`;

