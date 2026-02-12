/**
 * The currently running timer for the authenticated employee, if any.
 * Tracked at the root level — identified by work order + operation.
 */
export interface ActiveTimer {
    work_order: string;
    operation: string;
    from_time: string;
    is_corrective: boolean;
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
 * An operation within a work order, anchored on the Work Order Operation child table.
 * Time totals are split across regular and corrective (rework) job cards.
 */
export interface Operation {
    name: string;
    operation: string;
    workstation: string;
    planned_time_mins: number;
    actual_time_mins: number;
    employee_time_mins: number;
    corrective_total_time_mins: number;
    corrective_employee_time_mins: number;
}
