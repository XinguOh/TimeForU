import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionTypes } from '../store/actions';
import { useParams } from 'react-router-dom';
import './YourComponent.css'; // 스타일 파일을 import 해주세요.

export default function HourBox ({ day, idx }) {
  const dispatch = useDispatch();
  const route = useParams();
  const userID = useSelector(state => state.userID);
  const availability = useSelector(state => state.availability); // 사용자의 가용성 상태를 가져옵니다.

  const hoverHandler = (event) => {
    dispatch({ type: ActionTypes.updateHover, payload: event.target.id });
  };

  const mouseoutHandler = () => {
    dispatch({ type: ActionTypes.updateHover, payload: "MouseOut" });
  };

  let action = "ADD"; // 초기값 설정

  const clickHandler = (event) => {
    action = event.target.classList.contains("selected") ? "REMOVE" : "ADD";
    updateAvailability(action, event);
  };

  const dragHandler = (event) => {
    const mouseClickedDown = event.buttons === 1;
    if (mouseClickedDown) {
      updateAvailability(action, event);
    }
  };

  const updateAvailability = (action, event) => {
    const unixtime = event.target.id;
    const classList = event.target.classList;

    if (action === "ADD") {
      classList.add("selected");
    } else if (action === "REMOVE") {
      classList.remove("selected");
    }

    dispatch({
      type: action === "ADD" ? ActionTypes.addEvent : ActionTypes.removeEvent,
      payload: {
        unixtime,
        eventID: route.id,
      }
    });

    dispatch({ type: ActionTypes.updateDatabase });
  };

  const styleBinding = (arr) => {
    const degree = arr.length;
    return {
      backgroundColor: `hsl(157, 59%, ${100 - degree * 10}%)`,
      border: degree === 0 ? "" : `solid 0.1px hsl(157, 59%, ${90 - degree * 10}%)`,
      borderTop: "none",
      borderLeft: "none",
    };
  };

  const styleBindingUser = (arr) => {
    const users = arr.filter((id) => id === userID);
    const degree = users.length;
    return {
      backgroundColor: `hsl(157, 59%, ${100 - degree * 10}%)`,
      border: degree === 0 ? "" : `solid 0.1px hsl(157, 59%, ${90 - degree * 10}%)`,
      borderTop: "none",
      borderLeft: "none",
    };
  };

  return (
    <>
      {day.map((hour) => (
        <div
          className={`hour ${idx === 0 ? 'first' : ''} ${availability[hour].includes(userID) ? 'selected' : ''}`}
          style={styleBinding(availability[hour])}
          key={hour}
          id={hour}
          onMouseDown={clickHandler}
          onMouseMove={(e) => e.preventDefault()}
          onMouseOver={hoverHandler}
          onMouseOut={mouseoutHandler}
          draggable={true}
          onDragStart={(e) => e.preventDefault()}
        ></div>
      ))}
    </>
  );
};
