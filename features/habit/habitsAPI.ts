const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const fetchHabits = async (token: string) => {
    const response = await fetch(`${API_URL}/api/habits`, {
        headers: { Authorization: 'Bearer ' + token }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch habits");
    }
    return response.json();
};

export const markAsDone = async (habitId: string, token: string) => {
    const response = await fetch(`${API_URL}/api/habits/markasdone/${habitId}`, {
        method: "PATCH",
        headers: { Authorization: 'Bearer ' + token }
    });
    // Agregamos una validación aquí también por seguridad
    if (!response.ok) {
        throw new Error("Failed to mark as done");
    }
    return response.json();
};

export const fetchAddHabit = async (token: string, title: string, description: string) => {
    const response = await fetch(`${API_URL}/api/habits`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "description": description
        })
    });
    if (!response.ok) {
        throw new Error("Failed to add habit");
    }
    return response.json(); // <-- Cambiado para devolver los datos del hábito creado
};