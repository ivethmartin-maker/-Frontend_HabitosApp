// components/Habits.tsx
interface Habit {
  _id: string;
  title: string;
  description: string;
}

interface HabitsProps {
  habits: Habit[];
  loading: boolean;
}

export const Habits = ({ habits, loading }: HabitsProps) => {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Mis Hábitos de Redux
      </h1>

      <div className="w-full grid gap-6 mt-8">
        {loading && <p className="text-zinc-500 animate-pulse">Cargando...</p>}

        {habits && habits.length > 0 ? (
          habits.map((habit: Habit) => (
            <div
              key={habit._id}
              className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50 dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-black dark:text-white">{habit.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    {habit.description}
                  </p>
                </div>
                
                {/* Botón de completar (Estático por ahora) */}
                <button className="px-4 py-2 bg-black dark:bg-white dark:text-black text-white text-xs font-bold rounded-lg hover:opacity-80 transition-opacity">
                  Completar
                </button>
              </div>

              {/* Barra de Progreso (Estática al 60%) */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                  <span>Progreso Actual</span>
                  <span>60%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-black dark:bg-zinc-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-zinc-400 italic font-light">No hay hábitos disponibles aún.</p>
          )
        )}
      </div>
    </div>
  );
};