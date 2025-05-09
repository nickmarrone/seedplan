export type PlantingType = 'direct_seed' | 'transplant';

export interface Seed {
    id: number;
    plant_type: string;
    name: string;
    days_to_maturity: number;
    company?: string;
    planting_type: PlantingType;
    weeks_before_frost?: number;
    weeks_after_frost?: number;
    seed_spacing?: string;
    seed_notes?: string;
    color?: string;
    user_id?: number;
    created_at: string;
    updated_at?: string;
}

export interface Task {
    id?: number;
    seed_id: number;
    user_id?: number;
    task_type: string;
    start_date: string;
    end_date: string;
    notes: string;
    created_at?: string;
    updated_at?: string;
}

export interface SeedWithTasks extends Seed {
    tasks: Task[];
} 