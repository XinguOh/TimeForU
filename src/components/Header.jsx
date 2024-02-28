import React from 'react';
import styled from 'styled-components';

export default function Header() {
  return (
    <AppContainer>
      <h1><span style={{color:"#70a7ff"}}>Meet :</span> : For U</h1>
    </AppContainer>
  );
}

//전체 앱 컨테이너
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Lato';
  color : black;
`;
