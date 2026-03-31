import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRegisterUser, fetchLoginUser } from "./userAPI";

interface userThunk {
    username: string;
    password: string;
}

type user = {
    token: string;
}

type userState = {
    user: user | null;
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
}

const initialState: userState = {
    user: null, 
    status: "idle",
    error: null,
}

export const fetchRegisterUserThunk = createAsyncThunk("user/fetchRegisterUser", async ({username, password}: userThunk, {rejectWithValue}) => {
    try {
        const responseJson = await fetchRegisterUser(username, password);
        return responseJson.message;
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to register user");
    }
});

export const fetchLoginUserThunk = createAsyncThunk("user/fetchLoginUser", async ({username, password}: userThunk, {rejectWithValue}) => {
    try {
        const responseJson = await fetchLoginUser(username, password);
        
        // Guardamos el token
        localStorage.setItem('habitToken', responseJson.token);
        document.cookie = `habitToken=${responseJson.token}; path=/; max-age=86400`;
        
        return responseJson.token; 
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to login");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = { token: action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegisterUserThunk.fulfilled, (state, action) => {
                state.status = "success";
                state.error = action.payload as string;
                alert('Usuario registrado correctamente');
            })
            .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                alert('No es posible registrar el usuario');
            })
            .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
                state.status = "success";
                state.user = { token: action.payload as string };
                state.error = null;
            })
            .addCase(fetchLoginUserThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
                alert('Credenciales incorrectas o error de conexión');
            });
    }
});

export const { addUser } = userSlice.actions;
export default userSlice.reducer;