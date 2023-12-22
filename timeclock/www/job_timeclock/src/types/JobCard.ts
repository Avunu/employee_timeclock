// JobCard.ts

export interface JobCard {
    name: string;
    production_item: string;
    operation: string;
    status: string;
    sequence_id: string;
    time_log: {
        employee: string;
        from_time: Date;
        to_time: Date;
        time_in_mins: number;
    }

    // ... any other properties you may have
}
