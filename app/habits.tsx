import { useSelector, useDispatch } from 'react-redux';
import { markAsDoneThunk, fetchHabitsThunk } from '@/features/habit/habitsSlice';
import { AppState, AppDispatch } from "../Redux/store";

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


export default function Habits({habits}: HabitsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: AppState) => state.habit);

    
   const handleMarkAsDone = async (habitId: string) => {
    const resultAction = await dispatch(markAsDoneThunk({ habitId }));

    if (markAsDoneThunk.fulfilled.match(resultAction)) {
        dispatch(fetchHabitsThunk());
    }
};

    const calculateProgress = (days: number): number => {
        // James Clear dice que toma 66 días formar un hábito
        return Math.min((days / 66) * 100, 100);
    };

    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Mis Hábitos
            </h1>

                {habits && habits.length > 0 ? (
                    habits.map((habit: Habit) => {
                        // Obtenemos el estado específico de ESTE hábito
                        const habitStatus = status[habit._id] || 'idle';
                        const habitError = error[habit._id];
                        const progress = calculateProgress(habit.days);

                        return (
                            <div
                                key={habit._id} className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-black dark:text-white">
                                            {habit.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                            {habit.description}
                                        </p>
                                    </div>
                                    
                                    {/* Botón ______________*/}
                                    <button 
                                      onClick={() => handleMarkAsDone(habit._id)}
                                      disabled={habitStatus === 'loading'}
                                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        habitStatus === 'loading' 
                                        ? 'bg-zinc-300 cursor-not-allowed' 
                                        : 'bg-black text-white hover:opacity-80'
                                        }`}
                                    >
                                        {habitStatus === 'loading' ? 'Procesando...' : 'Completar'}
                                    </button>
                                </div>

                                {/* Errores individuales */}
                                {habitError && (
                                    <p className="text-red-500 text-[10px] mb-2">{habitError}</p>
                                )}

                                {/* Barra de Progreso Dinámica */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                        <span>Racha: {habit.days} días</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="bg-black dark:bg-zinc-400 h-full rounded-full transition-all duration-700 ease-out" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    (
                        <p className="text-zinc-400 italic font-light">No hay hábitos disponibles aún.</p>
                    )
                )}
            </div>
       
    );
}