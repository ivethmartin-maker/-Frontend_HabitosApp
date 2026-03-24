import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchHabits, markAsDone, fetchAddHabit } from "./habitsAPI";
type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    days: number;
    lastDone: Date;
    lastUpdate: Date;
}

type HabitState = {
    habits: Habit[],
    status: Record<string, "idle" | "loading" | "success" | "failed">,
    error: Record<string, string | null>;
}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {},
}
type markAsDoneThunkParmas = {
    habitId: string, 
        token: string,
}
type addHabitThunkParmas = {
    token: string, 
    title: string,
    description: string
}
export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async (token: string) => {
    return await fetchHabits(token);
});

export const markAsDoneThunk = createAsyncThunk("habit/markAsDone", async ({habitId, token}:markAsDoneThunkParmas, { rejectWithValue }) => {
    
    const responseJson = await markAsDone(habitId, token);
    console.log(responseJson);
    if (responseJson.message.toString() === "Habit marked as done") {
        return ("Habito marcado como hecho");
    }else if(responseJson.message.toString() === "Habit restarted"){
        return rejectWithValue(responseJson.message);
    }else{
        return rejectWithValue("Failed to mark habit as done");
    }
    
});
export const fetchAddHabitThunk = createAsyncThunk("habit/fetchAddHabit", async ({token, title, description}: addHabitThunkParmas) => {
    const response = await fetchAddHabit(token, title, description);
    const responseJson = await response.json();
    return responseJson;
});
const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habits = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg.habitId] = "success";
            state.error[action.meta.arg.habitId] = null;
        }).addCase(markAsDoneThunk.rejected, (state, action) => {  
            state.status[action.meta.arg.habitId] = "failed";
            state.error[action.meta.arg.habitId] = action.payload as string;
        }).addCase(fetchAddHabitThunk.fulfilled, (state, action) => {  
            console.log("action.payload:", action.payload);
            state.habits.push(action.payload);
        });;
    }
});

export const { addHabits} = habitSlice.actions;
export default habitSlice.reducer;