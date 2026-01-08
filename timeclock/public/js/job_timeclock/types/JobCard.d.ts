/**
 * Time log entry for a job card operation.
 * Represents a single work session on a job card.
 */
export interface JobCardTimeLog {
    name: string;
    from_time: string;
    to_time: string | null;
    time_in_mins: number;
    employee: string;
}

/**
 * Job Card from the Frappe backend API.
 * Represents a single operation within a work order.
 */
export interface JobCard {
    name: string;
    operation: string;
    status: 'Open' | 'Work In Progress' | 'Completed' | 'On Hold';
    sequence_id: number;
    is_active: boolean;
    time_logs: JobCardTimeLog | null;
}
