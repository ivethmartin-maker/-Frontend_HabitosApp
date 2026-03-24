'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabitsThunk } from "../features/habit/habitsSlice";
import { addUser, fetchRegisterUserThunk, fetchLoginUserThunk } from '../features/user/userSlice';
import type { RootState, AppDispatch } from '../Redux/store';
import Habits from './habits';
import { getCookie } from 'cookies-next';


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const user = useSelector((state: RootState) => state.user.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = getCookie('habitToken');
    console.log("Token from cookie:", token);
     if (token) {
      dispatch(addUser(token));
    }
    if (user) {
      dispatch(fetchHabitsThunk(user.toString()));
    }
  }, [dispatch, user]);
   const handleLogin = () => {
    dispatch(fetchLoginUserThunk({ username, password }));
  };

  const handleRegister = () => {
    dispatch(fetchRegisterUserThunk({ username, password }));
  };
 return (
    <>
  <div>
        {!user && (
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold mb-6">Login / Register</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-pink-500 text-white rounded-md"
            >
              Register
            </button>
          </div>
        </div>
      )}
      {user && <Habits habits={habits} />}
  </div>
    </>
  )
}

export default App