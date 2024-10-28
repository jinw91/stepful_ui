import { Call } from "@/interfaces/calls";
import { API_URL } from "./constants";

export async function getCallsByCoachId(coach_id: number): Promise<Call[]> {
    const response = await fetch(`${API_URL}/api/calls/coach/${coach_id}`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // Return empty array for no calls
    return [];
}

export async function addCall(call: Call) {
    const response = await fetch(`${API_URL}/api/calls/`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(call)
    });

    if (response.status != 201) {
        throw new Error("Failed to add call");
    }
}