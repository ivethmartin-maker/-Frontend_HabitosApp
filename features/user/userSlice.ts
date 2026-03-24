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
    const response = await fetchRegisterUser(username, password);
    const responseJson = await response.json();

    if (!response.ok) {
        return rejectWithValue("Failed to register user");
    } else {
        return responseJson.message;
    }
});

export const fetchLoginUserThunk = createAsyncThunk("user/fetchLoginUser", async ({username, password}: userThunk, {rejectWithValue}) => {
    const response = await fetchLoginUser(username, password);
    const responseJson = await response.json();
    if (!response.ok) {
        return rejectWithValue(responseJson.message || "Failed to login");
    } else {
        return responseJson.token; // Retorna el string del token
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload;
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
                // IMPORTANTE: Guardamos como objeto para que coincida con el tipo 'user'
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