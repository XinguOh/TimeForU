// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import EventPage from "./pages/EventPage";
import Header from "./components/Header";
// 다른 컴포넌트 임포트

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/events/:id" element={<EventPage />} />
      </Routes>
    </Router>
  );
}
