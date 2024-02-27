import React from 'react';
import './App.css'; // CSS 파일 import
import MyCalendarWithTime from './components/MyCalendarWithTime';

export default function App() {
  return (
    <div className="app-container">
      <h1>Meet For U</h1>
      <input className='app-input-container' placeholder='Title'></input>
      <MyCalendarWithTime/>
    </div>
  );
}
