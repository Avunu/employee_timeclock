// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// JobCard.ts

export interface JobCard {
	name: string;
	production_item: string;
	operation: string;
	status: string;
	sequence_id: string;
	is_active: Boolean;
	time_logs: {
		employee: string;
		from_time: Date;
		to_time: Date;
		time_in_mins: number;
	};

	// ... any other properties you may have
}
