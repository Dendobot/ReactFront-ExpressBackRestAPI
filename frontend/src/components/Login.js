import React from 'react';
import { useRef, useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

//for backEnd
const LOGIN_URL = "/users/auth";


const Login = () => {
  //set Auth global context for the authenticated user
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  //ref
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  //place for router later


  //setting focus
  useEffect(() => {
    userRef.current.focus();
  }, []);
  //remove err msg when pwd or username updates
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  //calls axios to reach backEnd
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(response?.data);
      const accessToken = response?.data?.accessToken;
      setAuth({ user, pwd, accessToken });
      setUser('');
      setPwd('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }


  };

  return (

    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>

      </form>
      <p>
        Need an Account?<br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section >

  );
};

export default Login;