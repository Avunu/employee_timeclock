// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, HeaderGlobalAction } from "@carbon/react";
import { Logout, Pin, PinFilled, Settings } from "@carbon/react/icons";
import { KioskHeader } from "../../../public/js/kiosk/KioskHeader";
import { KioskStatus } from "../../../public/js/kiosk/KioskStatus";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import { useKeyboardWedge } from "../../../public/js/kiosk/useKeyboardWedge";
import { ActiveTimer } from "./components/ActiveTimer";
import { JobCardList } from "./components/JobCardList";
import { MachineTimerBar } from "./components/MachineTimerBar";
import { type PinnedCard, PinnedPanel } from "./components/PinnedPanel";
import { SessionStatus } from "./components/SessionStatus";
import { SettingsPanel } from "./components/SettingsPanel";
import { WorkOrderList } from "./components/WorkOrderList";
import type { Operation } from "./types";
import { useEmployee } from "./useEmployee";
import { usePins } from "./usePins";
import { useSnapshot } from "./useSnapshot";
import { useTimers } from "./useTimers";
import { useTimerSync } from "./useTimerSync";
import { useWork } from "./useWork";
import { useWorkstations } from "./useWorkstations";

/** The old Vue tracker, while the two are tried side by side. */
const OLD_TRACKER = "/job_timeclock_vue";

const WAITING_NOUN = ["timer action", "timer actions"] as const;

type Panel = "settings" | "pinned" | null;

/** Scroll the element whose `data-<attribute>` is `value` to the middle of its column. */
function scrollToCard(attribute: "workOrder" | "operation", value: string): void {
	const name = attribute === "workOrder" ? "data-work-order" : "data-operation";
	const card = [...document.querySelectorAll<HTMLElement>(`[${name}]`)].find(
		(element) => element.dataset[attribute] === value,
	);
	card?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function App() {
	const showToast = useToasts();
	const { employee, expiry, wakes, request, scan, signOut, canCall, touch } = useEmployee();
	const { online, waiting, events, keep } = useTimerSync();
	const snapshot = useSnapshot(online);
	const stations = useWorkstations(request, snapshot);
	const [panel, setPanel] = useState<Panel>(null);
	const [scrollTarget, setScrollTarget] = useState<{ workOrder: string; operation: string } | null>(null);

	// The job last gone to, kept in view whatever the station filter says.
	const [revealed, setRevealed] = useState<string | null>(null);
	// The work order a timer last stopped on, whose totals have changed.
	const [stopped, onStopped] = useState<string | null>(null);

	const timers = useTimers({
		employee,
		request,
		canCall,
		touch,
		online,
		waiting,
		events,
		keep,
		snapshot,
		onStopped,
	});
	const { activeTimer, machineTimers, refresh } = timers;

	const work = useWork({
		employee,
		groups: timers.groups,
		request,
		canCall,
		online,
		snapshot,
		workstations: stations.chosen,
	});
	const { selected, select, selectByName, loadOperations, refreshOrders, workOrders } = work;
	const pins = usePins(employee?.id);

	const selectedName = selected?.name;
	useEffect(() => {
		if (stopped === null) return;
		onStopped(null);
		if (stopped === selectedName) void loadOperations(stopped);
	}, [stopped, selectedName, loadOperations]);

	useKeyboardWedge((badge) => void scan(badge));

	const signedIn = employee !== null;
	const refreshAll = useCallback(async () => {
		await Promise.all([refresh(), refreshOrders(), ...(selectedName ? [loadOperations(selectedName)] : [])]);
	}, [refresh, refreshOrders, loadOperations, selectedName]);

	// Whoever signs in sees the work now, not as the last person left it.
	const key = employee?.key;
	useEffect(() => {
		if (key && online && canCall()) void refreshOrders();
	}, [key, online, canCall, refreshOrders]);

	// Back from sleep, or with the queue just sent: what's on screen is out of date.
	const seenWakes = useRef(wakes);
	const wasWaiting = useRef(waiting);
	useEffect(() => {
		const woke = wakes !== seenWakes.current;
		const sent = waiting === 0 && wasWaiting.current > 0;
		seenWakes.current = wakes;
		wasWaiting.current = waiting;
		if ((woke || sent) && signedIn && online && canCall()) void refreshAll();
	}, [wakes, waiting, signedIn, online, canCall, refreshAll]);

	// One at a time: the server takes four of these a second.
	const pinKeys = pins.pins;
	const { cache } = work;
	useEffect(() => {
		if (panel !== "pinned") return;
		void (async () => {
			/* oxlint-disable no-await-in-loop -- one at a time, on purpose */
			for (const workOrder of new Set(pinKeys.map((pin) => pin.workOrder))) {
				if (!cache[workOrder]) await loadOperations(workOrder);
			}
			/* oxlint-enable no-await-in-loop */
		})();
		// Each time the panel opens, not as each answer lands.
		// oxlint-disable-next-line react-hooks/exhaustive-deps
	}, [panel]);

	const { loadDevice } = stations;
	useEffect(() => {
		if (panel === "settings") void loadDevice();
	}, [panel, loadDevice]);

	const pinnedCards = useMemo<PinnedCard[]>(
		() =>
			pinKeys.flatMap(({ workOrder, operation }) => {
				const found = cache[workOrder]?.find((item) => item.operation === operation);
				if (!found) return [];
				const order = workOrders.find((item) => item.name === workOrder);
				return [{ workOrder, operation: found, productName: order?.production_item ?? workOrder }];
			}),
		[pinKeys, cache, workOrders],
	);

	// Scroll once the work order's cards are on screen.
	const { operations } = work;
	useEffect(() => {
		if (!scrollTarget) return;
		if (!operations.some((operation) => operation.operation === scrollTarget.operation)) return;
		scrollToCard("workOrder", scrollTarget.workOrder);
		scrollToCard("operation", scrollTarget.operation);
		setScrollTarget(null);
	}, [scrollTarget, operations]);

	const open = useCallback(
		async (target: { work_order: string; operation: string }) => {
			setPanel(null);
			setRevealed(target.operation);
			setScrollTarget({ workOrder: target.work_order, operation: target.operation });
			await selectByName(target.work_order);
		},
		[selectByName],
	);

	const leave = useCallback(() => {
		if (employee?.name) showToast({ kind: "success", title: `${employee.name} switched user.` });
		setPanel(null);
		signOut();
	}, [employee, showToast, signOut]);

	const togglePanel = (next: Exclude<Panel, null>) => setPanel((now) => (now === next ? null : next));

	const cardActions = {
		onStart: (workOrder: string, operation: Operation, rework: boolean) =>
			void timers.start(workOrder, operation, rework),
		onStop: (workOrder: string, operation: Operation, rework: boolean) =>
			void timers.stop(workOrder, operation, rework),
		onTogglePin: pins.toggle,
	};

	return (
		<>
			<KioskHeader name="Project Tracker">
				<KioskStatus online={online} waiting={waiting} noun={WAITING_NOUN} />
				<Button kind="ghost" href={OLD_TRACKER}>
					Use old tracker
				</Button>
				{signedIn && (
					<>
						<HeaderGlobalAction aria-label="Sign Out" onClick={leave}>
							<Logout size={20} />
						</HeaderGlobalAction>
						<HeaderGlobalAction
							aria-label="Settings"
							isActive={panel === "settings"}
							onClick={() => togglePanel("settings")}
						>
							<Settings size={20} />
						</HeaderGlobalAction>
						<HeaderGlobalAction
							aria-label={`Pinned Jobs (${pins.pins.length})`}
							isActive={panel === "pinned"}
							onClick={() => togglePanel("pinned")}
						>
							{pins.pins.length > 0 ? <PinFilled size={20} /> : <Pin size={20} />}
						</HeaderGlobalAction>
					</>
				)}
			</KioskHeader>
			{employee ? (
				<div className="jt-page">
					<div className="jt-status">
						<SessionStatus name={employee.name} expiry={expiry} />
						{activeTimer && (
							<ActiveTimer
								timer={activeTimer}
								onOpen={() => void open(activeTimer)}
								onStop={() =>
									void timers.stop(
										activeTimer.work_order,
										{ operation: activeTimer.operation, is_machine_time: false },
										activeTimer.is_corrective,
									)
								}
							/>
						)}
					</div>
					<main className="jt-main">
						<WorkOrderList
							workOrders={workOrders}
							selected={selected}
							activeTimer={activeTimer}
							narrow={selected !== null || panel === "pinned"}
							onSelect={(workOrder) => {
								setRevealed(null);
								setPanel((now) => (now === "pinned" ? null : now));
								void select(workOrder);
							}}
						/>
						{panel === "pinned" && (
							<PinnedPanel
								cards={pinnedCards}
								activeTimer={activeTimer}
								machineTimers={machineTimers}
								onOpen={(card) =>
									void open({ work_order: card.workOrder, operation: card.operation.operation })
								}
								{...cardActions}
							/>
						)}
						{selected && panel !== "pinned" && (
							<JobCardList
								workOrder={selected}
								operations={operations}
								workstations={stations.chosen}
								activeTimer={activeTimer}
								machineTimers={machineTimers}
								isPinned={pins.isPinned}
								canPin={employee.id !== null}
								revealed={revealed}
								{...cardActions}
							/>
						)}
					</main>
					<MachineTimerBar
						timers={machineTimers}
						workOrders={workOrders}
						onOpen={(timer) => void open(timer)}
						onStop={(timer) => void timers.stopMachine(timer.work_order, timer.operation)}
					/>
					<SettingsPanel
						open={panel === "settings"}
						available={stations.available}
						chosen={stations.chosen}
						device={stations.device}
						onToggle={stations.toggle}
					/>
				</div>
			) : (
				<main className="tc-kiosk">
					<p className="tc-prompt">Scan your badge to start tracking time.</p>
				</main>
			)}
		</>
	);
}
