import { Coach } from "./coach";
import { Student } from "./student";

export interface Slot {
    slot_id: number;
    coach_id: number;
    start_time: Date;
    student_id: number | null;
};

export interface CoachSlot extends Slot {
    Student: Student | null;
};

export interface StudentSlot extends Slot {
    Coach: Coach | null;
};