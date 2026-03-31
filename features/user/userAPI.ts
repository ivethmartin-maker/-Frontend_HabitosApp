// 1. Asegúrate de que el puerto sea el 4000 (que es el que vi en tu app.js)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchRegisterUser = async (username: string, password: string) => {
    // CAMBIO AQUÍ: Agregamos /api/auth/ antes de register
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    
    if (!response.ok) {
        throw new Error("Failed to register user");
    }
    
    return response.json();
};

export const fetchLoginUser = async (username: string, password: string) => {
    // CAMBIO AQUÍ: Agregamos /api/auth/ antes de login
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });

    if (!response.ok) {
        throw new Error("Failed to login user");
    }

    return response.json();
};