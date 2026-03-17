export const fetchHabits = async () => {
    const response = await fetch("http://localhost:3002/habits");
    if (!response.ok) {
        throw new Error("Failed to fetch habits");
}
return response.json();
};

export const markAsDone = async (habitId: string) => {
    const response = await fetch(`http://localhost:3002/habits/markasdone/${habitId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
};