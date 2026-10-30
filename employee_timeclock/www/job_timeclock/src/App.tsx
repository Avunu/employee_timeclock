// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, HeaderGlobalAction } from "@carbon/react";
import { Logout, Pin, PinFilled, Settings } from "@carbon/react/icons";
import { useFrappeEventListener } from "frappe-react-sdk";
import { KioskHeader } from "../../../public/js/kiosk/KioskHeader";
import { KioskStatus } from "../../../public/js/kiosk/KioskHeader";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import { useFrappeSocket } from "../../../public/js/kiosk/useBackendCall";
import { useKeyboardWedge } from "../../../public/js/kiosk/useKeyboardWedge";
import { ActiveTimer } from "./components/Timers";
import { JobCardList } from "./components/JobCards";
import { MachineTimerBar } from "./components/Timers";
import { type PinnedCard, PinnedPanel } from "./components/Panels";
import { SessionStatus } from "./components/Timers";
import { SettingsPanel } from "./components/Panels";
import { WorkOrderList } from "./components/WorkOrders";
import type { GetDeviceInfoResponse, Operation } from "./types";
import { useEmployee } from "./useEmployee";
import { usePins } from "./useWork";
import { useSnapshot } from "./offline";
import { useTimers } from "./useTimers";
import { useTimerSync } from "./offline";
import { useTrackerData } from "./useEmployee";
import { useWork, visibleTo } from "./useWork";
import { useWorkstations } from "./useWork";

const NO_STATIONS: string[] = [];

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
	const { employee, expiry, session, request, scan, signOut, canCall, touch } = useEmployee();
	const { online, waiting, events, keep } = useTimerSync();
	const { snapshot, refreshSnapshot } = useSnapshot();
	const stations = useWorkstations();
	const [panel, setPanel] = useState<Panel>(null);
	const [scrollTarget, setScrollTarget] = useState<{ workOrder: string; operation: string } | null>(null);
	// The job last gone to, kept in view whatever the station filter says.
	const [revealed, setRevealed] = useState<string | null>(null);
	const live = online && canCall();

	const work = useWork({ employee, session, snapshot, workstations: stations.chosen });
	const { selected, select, selectByName, refreshOperations, workOrders } = work;

	const onStopped = useCallback(() => {
		refreshOperations();
		void refreshSnapshot();
	}, [refreshOperations, refreshSnapshot]);

	const timers = useTimers({
		employee,
		session,
		request,
		touch,
		live,
		waiting,
		events,
		keep,
		snapshot,
		onStopped,
	});
	const { activeTimer, machineTimers, groups, refresh } = timers;
	const pins = usePins(employee?.id);
	const device = useTrackerData<GetDeviceInfoResponse>(
		session,
		"get_device_info",
		panel === "settings" ? "device-info" : null,
	);

	useKeyboardWedge((badge) => void scan(badge));

	// Machine timers belong to whole groups, so other tablets' changes arrive by realtime event. The
	// server decides what this employee sees, so whatever changed, ask it again.
	const refreshAll = useCallback(() => {
		refresh();
		onStopped();
	}, [refresh, onStopped]);
	useFrappeEventListener("machine_timer_update", refreshAll);
	// Events sent while the socket was down are gone.
	const socket = useFrappeSocket();
	useEffect(() => {
		socket?.on("connect", refreshAll);
		return () => {
			socket?.off("connect", refreshAll);
		};
	}, [socket, refreshAll]);

	// What was waiting has just been sent, so the screen is out of date.
	const wasWaiting = useRef(waiting);
	useEffect(() => {
		if (waiting === 0 && wasWaiting.current > 0) refreshAll();
		wasWaiting.current = waiting;
	}, [waiting, refreshAll]);

	const operations = useMemo(() => visibleTo(work.operations, groups), [work.operations, groups]);

	const pinnedCards = useMemo<PinnedCard[]>(
		() =>
			pins.pins.flatMap(({ workOrder, operation }) => {
				const kept = visibleTo(snapshot?.operations[workOrder] ?? [], groups);
				const found = kept.find((item) => item.operation === operation);
				if (!found) return [];
				const order = workOrders.find((item) => item.name === workOrder);
				return [{ workOrder, operation: found, productName: order?.production_item ?? workOrder }];
			}),
		[pins.pins, snapshot, groups, workOrders],
	);

	// Scroll once the work order's cards are on screen.
	useEffect(() => {
		if (!scrollTarget) return;
		if (!operations.some((operation) => operation.operation === scrollTarget.operation)) return;
		scrollToCard("workOrder", scrollTarget.workOrder);
		scrollToCard("operation", scrollTarget.operation);
		setScrollTarget(null);
	}, [scrollTarget, operations]);

	const open = useCallback(
		(target: { work_order: string; operation: string }) => {
			setPanel(null);
			setRevealed(target.operation);
			setScrollTarget({ workOrder: target.work_order, operation: target.operation });
			selectByName(target.work_order);
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
				{employee && (
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
								onOpen={() => open(activeTimer)}
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
								select(workOrder);
							}}
						/>
						{panel === "pinned" && (
							<PinnedPanel
								cards={pinnedCards}
								activeTimer={activeTimer}
								machineTimers={machineTimers}
								onOpen={(card) => open({ work_order: card.workOrder, operation: card.operation.operation })}
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
						onOpen={open}
						onStop={(timer) => void timers.stopMachine(timer.work_order, timer.operation)}
					/>
					<SettingsPanel
						open={panel === "settings"}
						available={snapshot?.workstations ?? NO_STATIONS}
						chosen={stations.chosen}
						ip={device.data?.message.ip}
						mac={device.data?.message.mac}
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
