import { Student } from "@/interfaces/student";
import { API_URL } from "./constants";

export async function getStudents(): Promise<Student[]> {
    const response = await fetch(`${API_URL}/api/students/`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}