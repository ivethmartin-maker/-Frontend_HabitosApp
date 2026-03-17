'use client';
import Image from "next/image";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk } from "@/features/habit/habitsSlice";
import { AppState, AppDispatch } from "../Redux/store";
import Habits from "../app/habits";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { habits,} = useSelector((state: AppState) => state.habit);

  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert mb-10"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {/* --- Renderizamos el componente Habits y le pasamos los datos --- */}
        <Habits habits={habits} />
        
      </main>
    </div>
  );
}
