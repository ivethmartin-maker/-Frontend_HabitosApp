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
    
    // 1. Si hay cookie pero no hay usuario en Redux, lo cargamos como objeto
    if (token && !user) {
      dispatch(addUser(token.toString()));
    }

    // 2. Si el usuario existe, extraemos el TOKEN (string) para los hábitos
    if (user && user.token) {
      dispatch(fetchHabitsThunk(user.token));
    }
  }, [dispatch, user]); // Quitamos dependencias innecesarias

  const handleLogin = () => {
    dispatch(fetchLoginUserThunk({ username, password }));
  };

  const handleRegister = () => {
    dispatch(fetchRegisterUserThunk({ username, password }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
        {!user ? (
          <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">Bienvenido</h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-yellow-700 dark:text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                placeholder="Tu usuario..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-yellow-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                placeholder="••••••••"
              />
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={handleRegister}
                className="w-full px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-black font-semibold rounded-md transition-colors"
              >
                Registrarse
              </button>
            </div>
          </div>
        ) : (
          <Habits habits={habits} />
        )}
      </div>
    </>
  );
}

export default App;