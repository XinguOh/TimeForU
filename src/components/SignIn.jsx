import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionTypes } from '../store/actions';
import { useParams } from 'react-router-dom';
import './YourComponent.css'; // 스타일 파일을 import 해주세요.

const YourComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: ActionTypes.addUserName,
      payload: {
        username: name,
        eventID: id,
      }
    });
    setName('');
    setPassword('');
  };

  return (
    <div className="backdrop" style={{ display: show ? 'block' : 'none' }}>
      <div className="signin-form">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="row">
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YourComponent;
