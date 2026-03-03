'use client';
import Image from "next/image";
import { useEffect } from "react";
import { useSelector,useDispatch} from "react-redux" ;
import { fetchHabitsThunk } from "@/features/habit/habitsSlice";
import { AppState, AppDispatch } from "../Redux/store";

export default function Home() {
  const dispatch =useDispatch<AppDispatch>();
 // useSelector((state: AppState) => state.habit); 
 const { habits, loading } = useSelector((state: AppState) => state.habit);
  useEffect(() => {
    dispatch(fetchHabitsThunk());
}, [dispatch]);

 
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Mis Hábitos de Redux
          </h1>

          {/* --- -------------------------------------------------------------- --- */}
          <div className="w-full grid gap-4 mt-8">
            {loading && <p className="text-zinc-500">Cargando...</p>}
            
            {habits && habits.map((habit: any) => (
              <div 
                key={habit._id} 
                className="p-4 border border-zinc-200 rounded-xl bg-zinc-50 dark:bg-zinc-900"
              >
                <h3 className="font-bold text-black dark:text-white">{habit.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{habit.description}</p>
              </div>
            ))}
          </div>
          {/* ------------------------------------------------------------------- */}

        </div>
        
        {/* ---------------------------------------------------------------------- */}
      </main>
    </div>
  );
}


