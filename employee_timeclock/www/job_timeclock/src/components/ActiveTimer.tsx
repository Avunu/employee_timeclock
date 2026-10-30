// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Button, ClickableTile } from "@carbon/react";
import { StopFilled } from "@carbon/react/icons";
import { elapsedSince } from "../format";
import type { ActiveTimer as Timer } from "../types";
import { useTick } from "../useTick";

interface ActiveTimerProps {
	timer: Timer;
	onOpen: () => void;
	onStop: () => void;
}

/** The employee's running timer, wherever they are in the tracker. */
export function ActiveTimer({ timer, onOpen, onStop }: ActiveTimerProps) {
	const now = useTick();
	return (
		<div className="jt-machine">
			<ClickableTile
				className={timer.is_corrective ? "jt-card jt-card-rework" : "jt-card jt-card-labor"}
				onClick={onOpen}
			>
				<strong>{timer.operation}</strong>{" "}
				<span className="jt-elapsed">{elapsedSince(timer.from_time, now)}</span>
				{timer.is_corrective && " REWORK"}
			</ClickableTile>
			<Button
				kind="ghost"
				size="2xl"
				hasIconOnly
				renderIcon={StopFilled}
				iconDescription={timer.is_corrective ? "Stop Rework" : "Stop Timer"}
				onClick={onStop}
			/>
		</div>
	);
}
