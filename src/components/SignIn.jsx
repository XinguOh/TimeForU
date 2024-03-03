import React, { useState } from "react";
import styled from "styled-components";
export default function SignIn({ setLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (name === "") {
      alert("이름을 입력해주세요");
    } else {
      setLogin(true);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <SiginContainer>
      <h2>Who are you?</h2>
      <StyledInput
        value={name}
        onChange={handleNameChange}
        placeholder="이름"
      ></StyledInput>
      <StyledInput
        value={password}
        onChange={handlePasswordChange}
        placeholder="비밀번호(필수X)"
      ></StyledInput>
      <SubmitButton type="button" onClick={handleLogin}>
        로그인
      </SubmitButton>
    </SiginContainer>
  );
}

const SiginContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 150px;
  align-items: center;
`;
const StyledInput = styled.input`
  text-align: center;
  border: none;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
  width: 150px;
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.div`
  display: flex;
  height: 20px;
  width: 150px;
  border: 1px solid black;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1a237e;
  transition: 0.2s ease-in-out;
  &:hover {
    background-color: #70a7ff;
  }
`;
