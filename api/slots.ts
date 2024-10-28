import { CoachSlot, Slot, StudentSlot } from "@/interfaces/slot";
import { API_URL } from "./constants";

export async function getSlotsByCoachId(coach_id: number): Promise<CoachSlot[]> {
    const response = await fetch(`${API_URL}/api/slots/coach/${coach_id}`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // Return empty array for no slots
    return [];
}

export async function getPastSlotsWithoutCallsByCoachId(coach_id: number): Promise<Slot[]> {
    const response = await fetch(`${API_URL}/api/slots/past-without-calls/${coach_id}`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // Return empty array for no slots
    return [];
}

export async function getSlotsByStudentId(student_id: number): Promise<StudentSlot[]> {
    const response = await fetch(`${API_URL}/api/slots/student/${student_id}`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // Return empty array for no slots
    return [];
}

export async function getSlots(): Promise<Slot[]> {
    const response = await fetch(`${API_URL}/api/slots/`, {
        method: 'GET',
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    // Return empty array for no slots
    return [];
}

export async function addSlot(slot: Slot) {
    const response = await fetch(`${API_URL}/api/slots/`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(slot)
    });

    if (response.status != 201) {
        throw new Error("Failed to add slot");
    }
}

export async function updateSlot(slot: Slot) {
    debugger;
    const response = await fetch(`${API_URL}/api/slots/${slot.slot_id}`, {
        method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(slot)
    });

    if (response.status != 200) {
        throw new Error("Failed to update slot");
    }
}