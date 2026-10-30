// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Checkbox, CheckboxGroup, HeaderPanel } from "@carbon/react";

interface SettingsPanelProps {
	open: boolean;
	available: string[];
	chosen: string[];
	ip: string | undefined;
	mac: string | undefined;
	onToggle: (workstation: string, checked: boolean) => void;
}

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
		</HeaderPanel>
	);
}
