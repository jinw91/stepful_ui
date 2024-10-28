import { Coach } from "@/interfaces/coach";
import { API_URL } from "./constants";

export async function getCoach(coach_id: number): Promise<Coach> {
    const response = await fetch(`${API_URL}/api/coaches/${coach_id}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}

export async function getCoaches(): Promise<Coach[]> {
    const response = await fetch(`${API_URL}/api/coaches/`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}