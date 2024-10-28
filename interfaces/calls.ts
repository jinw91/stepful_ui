import { Slot } from "./slot";

export interface Call {
    call_id: number;
    slot_id: number;
    satisfaction_score: number;
    notes: string;
    Slot: Slot | null;
};