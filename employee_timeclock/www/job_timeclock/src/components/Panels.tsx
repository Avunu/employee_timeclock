// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Button, Checkbox, CheckboxGroup, HeaderPanel } from "@carbon/react";
import type { ActiveTimer, MachineTimer, Operation } from "../types";
import { JobCard, type JobCardActions } from "./JobCards";

interface SettingsPanelProps {
	open: boolean;
	available: string[];
	chosen: string[];
	ip: string | undefined;
	mac: string | undefined;
	onToggle: (workstation: string, checked: boolean) => void;
}

/** The old Vue tracker, while the two are tried side by side. */
export const OLD_TRACKER = "/job_timeclock_vue";

/** This tablet's workstations, and its network address for whoever is setting it up. */
export function SettingsPanel({ open, available, chosen, ip, mac, onToggle }: SettingsPanelProps) {
	if (!open) return null;
	return (
		<HeaderPanel className="jt-panel" expanded aria-label="Settings">
			<h2 className="jt-column-title">Settings</h2>
			<CheckboxGroup legendText="Workstations">
				{available.length === 0 && <p className="jt-muted">Loading…</p>}
				{available.map((workstation) => (
					<Checkbox
						key={workstation}
						id={`jt-station-${workstation}`}
						labelText={workstation}
						checked={chosen.includes(workstation)}
						onChange={(_event, { checked }) => onToggle(workstation, checked)}
					/>
				))}
			</CheckboxGroup>
			<dl className="jt-device">
				<dt>IP</dt>
				<dd>{ip || "—"}</dd>
				<dt>MAC</dt>
				<dd>{mac || "—"}</dd>
			</dl>
			<Button kind="ghost" href={OLD_TRACKER}>
				Use old tracker
			</Button>
		</HeaderPanel>
	);
}

export interface PinnedCard {
	workOrder: string;
	productName: string;
	operation: Operation;
}

interface PinnedPanelProps extends JobCardActions {
	cards: PinnedCard[];
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
	/** A pinned job was tapped. */
	onOpen: (card: PinnedCard) => void;
}

/** The job cards this employee pinned, beside the work orders. Tapping one goes to it. */
export function PinnedPanel({ cards, activeTimer, machineTimers, onOpen, ...actions }: PinnedPanelProps) {
	return (
		<section className="jt-column jt-column-half">
			<h2 className="jt-column-title">Pinned Jobs</h2>
			{cards.length === 0 && (
				<p className="jt-muted">No pinned job cards yet. Tap the pin on any job card to keep it here.</p>
			)}
			{cards.map((card) => (
				<JobCard
					key={`${card.workOrder}::${card.operation.operation}`}
					workOrder={card.workOrder}
					productName={card.productName}
					operation={card.operation}
					activeTimer={activeTimer}
					machineTimers={machineTimers}
					pinned
					canPin
					onOpen={() => onOpen(card)}
					{...actions}
				/>
			))}
		</section>
	);
}
