import React from 'react';
import styled from 'styled-components';
import GenerateSchedule from '../components/GenerateSchedule';

export default function MainPage() {
  return (
    <AppContainer>
      <h1>Meet : For U</h1>
    
      <GenerateSchedule/>
    </AppContainer>
  );
}

//전체 앱 컨테이너
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato';
  color : #1a237e
`;
