/**
 * The currently running time log for the authenticated employee, if any.
 * Only one card can be active per employee at any given time.
 */
export interface ActiveLog {
    operation: string;
    time_log_name: string;
    from_time: string;
    is_rework: boolean;
}

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
 * Operation-anchored job card data from the Frappe backend API.
 * Represents a single operation within a work order, with time totals
 * split across regular and rework (corrective) job cards.
 */
export interface JobCard {
    operation: string;
    status: 'Open' | 'Work In Progress' | 'Completed' | 'On Hold';
    sequence_id: number;
    all_regular_mins: number;
    all_rework_mins: number;
    employee_regular_mins: number;
    employee_rework_mins: number;
}
