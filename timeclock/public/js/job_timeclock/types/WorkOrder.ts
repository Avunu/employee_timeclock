/**
 * Work Order from the Frappe backend API.
 * Represents a manufacturing work order containing multiple job cards.
 */
export interface WorkOrder {
    name: string;
    production_item: string;
    status: 'Draft' | 'Submitted' | 'Not Started' | 'In Process' | 'Completed' | 'Stopped' | 'Cancelled';
}
