import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits } from "./habitsAPI";
//type Habit ={
export type Habit ={

    _id: string;
    title: string;
    description: string;
    createdAt: string;
}

type HabitState = {
    habits: Habit [];
    // Agregar loading
    loading: boolean;
    error: string | null;
}

const initialState: HabitState = {
    habits: [],
    // por agregar loading
    loading: false,
    error: null,
}
export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async () => {
    return await fetchHabits();
})
const habitSlice = createSlice({
    name: "habit",
    initialState,
    reducers:{
        addHabits: (state, action) => {
            state.habits = action.payload;
        },
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removehabit: (state, action) => {
            state.habits =state.habits.filter(habit => habit._id !== action.payload);
        }
    },
    extraReducers: (builder) =>{
        builder
        // Mientras la petición está en curso
            .addCase(fetchHabitsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.habits = action.payload;
            })
                //Si hay un error
            .addCase(fetchHabitsThunk.rejected, (state) => {
                state.loading = false;
                state.error = "Error al cargar los hábitos";
        });
    }
});

export const { addHabits, addHabit, removehabit } =habitSlice.actions;
export default habitSlice.reducer;