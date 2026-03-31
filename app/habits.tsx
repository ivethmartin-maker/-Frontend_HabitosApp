import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { markAsDoneThunk, fetchHabitsThunk,fetchAddHabitThunk } from '@/features/habit/habitsSlice';
import type { RootState, AppDispatch } from "../Redux/store";


type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    days: number;
    lastDone: Date;
    lastUpdate: Date;
}

type HabitsProps = {
    habits: Habit[];    
}
const handleMarkAsDone = async (habitId: string, dispatch: AppDispatch, token: string) => {
    if (!token) return;
    await dispatch(markAsDoneThunk({ habitId, token }));
    dispatch(fetchHabitsThunk(token));
}

export default function Habits({habits}: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.habits) || {};
    const user = useSelector((state: RootState) => state.user.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const calculateProgress = (days: number): number => {
        return Math.min((days / 66) * 100, 100);
    };

   const handleAddHabit = async () => { 
    if (title && description) {
       const token = user?.token || '';
        await dispatch(fetchAddHabitThunk({ token, title, description }));
        
        setTitle('');
        setDescription('');
        
        dispatch(fetchHabitsThunk(token));
    }
};

return (
    <> 
        <div className="w-full flex justify-end mb-4 max-w-2xl mx-auto px-4">
            <button 
                onClick={() => {
                    document.cookie = "habitToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    localStorage.removeItem('habitToken');
                    window.location.reload();
                }}
                className="text-xs text-red-500 hover:underline font-medium"
            >
                Cerrar Sesión
            </button>
        </div>
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4">
            
            <div className="w-full p-6 border border-zinc-200 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Agrega un hábito nuevo</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Título del hábito..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="Descripción corta..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={handleAddHabit}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Añadir Hábito
                    </button>
                </div>
            </div>

            <hr className="w-full border-zinc-200 dark:border-zinc-800" />

            {/* --- SECCIÓN: LISTADO DE HÁBITOS --- */}
            <div className="w-full space-y-4 text-left">
                <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
                    Mis Hábitos
                </h1>

                {habits && habits.length > 0 ? (
                    habits.map((habit: Habit) => {
                        const habitStatus = status[habit._id] || 'idle';
                        const habitError = error[habit._id];
                        const progress = calculateProgress(habit.days);

                        return (
                            <div key={habit._id} className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-black dark:text-white">{habit.title}</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">{habit.description}</p>
                                    </div>
                                    
                                     {/* Botón ______________*/}
                                    <button 
                                      onClick={() => handleMarkAsDone(habit._id, dispatch, user?.token || '')}
                                      disabled={habitStatus === 'loading'}
                                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        habitStatus === 'loading' 
                                        ? 'bg-zinc-300 cursor-not-allowed' 
                                        : 'bg-black text-white dark:bg-zinc-100 dark:text-black hover:opacity-80'
                                      }`}
                                    >
                                        {habitStatus === 'loading' ? 'Procesando...' : 'Completar'}
                                    </button>
                                </div>

                                {habitError && <p className="text-red-500 text-[10px] mb-2">{habitError}</p>}
                                
                                {/* Barra de Progreso Dinámica */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-medium text-zinc-500 uppercase">
                                        <span>Racha: {habit.days} días</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-blue-600 dark:bg-blue-400 h-full rounded-full transition-all duration-700 ease-out" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-zinc-400 italic font-light">No hay hábitos disponibles aún.</p>
                )}
            </div>
        </div>
    </>
    );
}