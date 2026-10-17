<template>
	<div :data-operation="operation.operation">
		<div
			class="flex flex-col rounded-lg border px-8 py-7 shadow font-sans text-black text-xl lg:text-5xl mt-3 mb-3"
			:class="cardClasses"
		>
			<!-- Header row: title + actions -->
			<div class="flex items-center justify-between mt-1 mb-2">
				<p v-if="productName" class="text-xl text-gray-600">
					{{ productName }}
				</p>
				<button
					v-if="showPin"
					@click.stop="
						$emit('toggle-pin', {
							workOrderName: workOrderName,
							operationName: operation.operation,
						})
					"
					class="p-1 rounded transition-colors ml-auto"
					:class="pinned ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-500'"
					:title="pinned ? 'Unpin' : 'Pin'"
				>
					<IconPin class="w-5 h-5" :class="{ 'fill-current rotate-45': pinned }" />
				</button>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-semibold" :class="titleColor">
						{{ operation.operation }}
					</h2>
				</div>
				<div class="flex items-center space-x-2">
					<div class="flex gap-2 items-start">
						<Button
							:theme="isMachine ? 'blue' : 'green'"
							variant="outline"
							size="2xl"
							label="Start Timer"
							@click="startTask"
							v-if="!taskStarted && !operation.is_submitted"
						/>
						<Button
							theme="gray"
							variant="ghost"
							size="2xl"
							label="Submitted"
							:disabled="true"
							class="italic"
							v-if="!taskStarted && operation.is_submitted"
						/>
						<Button
							:theme="isMachine ? 'blue' : 'green'"
							variant="outline"
							size="2xl"
							label="Stop Timer"
							@click="stopTask"
							v-if="taskStarted"
						/>
						<Button
							theme="gray"
							variant="outline"
							size="2xl"
							label="Start Rework"
							class="!bg-orange-500 !text-white hover:!bg-orange-600"
							@click="startRework"
							v-if="!reworkStarted"
						/>
						<Button
							theme="gray"
							variant="outline"
							size="2xl"
							label="Stop Rework"
							class="!text-orange-700 !border-orange-500 hover:!bg-orange-100"
							@click="stopRework"
							v-if="reworkStarted"
						/>
					</div>
				</div>
			</div>
			<!-- Progress bar -->
			<div v-if="operation.planned_time_mins > 0" class="mt-3 space-y-1">
				<div class="flex justify-between text-xl" :class="progressHintClass">
					<span>Estimated Time: {{ formatMins(operation.planned_time_mins) }}</span>
					<span v-if="isOverrun"
						>+{{ formatMins(totalLoggedMins - operation.planned_time_mins) }} overrun</span
					>
				</div>
				<div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden flex">
					<div
						class="h-full transition-all duration-300"
						:class="[
							isMachine ? 'bg-blue-500' : 'bg-green-500',
							{ 'rounded-full': !isOverrun, 'rounded-l-full': isOverrun },
						]"
						:style="{ width: progressPercent + '%' }"
					/>
					<div
						v-if="isOverrun"
						class="h-full rounded-r-full bg-red-500 transition-all duration-300"
						:style="{ width: overrunPercent + '%' }"
					/>
				</div>
			</div>
			<!-- Time data body -->
			<div class="mt-4 flex flex-col gap-2 text-xl" v-if="hasTimeData">
				<!-- Regular Time Row -->
				<div
					class="flex justify-between items-center"
					v-if="taskStarted || operation.actual_time_mins > 0 || operation.employee_time_mins > 0"
				>
					<div>
						<span
							:class="isMachine ? 'text-blue-600' : 'text-green-600'"
							class="w-full"
							v-if="operation.actual_time_mins > 0"
						>
							{{ formatMins(operation.actual_time_mins) }} logged
						</span>
					</div>
					<div class="text-right">
						<span
							:class="isMachine ? 'text-blue-700' : 'text-green-700'"
							class="font-mono text-xl"
							v-if="taskStarted"
						>
							{{ elapsedTime }}
						</span>
						<span
							:class="isMachine ? 'text-blue-500' : 'text-green-500'"
							class="text-xl ml-2"
							v-if="operation.employee_time_mins > 0"
						>
							Your total: {{ formatMins(operation.employee_time_mins) }}
						</span>
					</div>
				</div>
				<!-- Corrective Time Row -->
				<div
					class="flex justify-between items-center"
					v-if="
						reworkStarted ||
						operation.corrective_total_time_mins > 0 ||
						operation.corrective_employee_time_mins > 0
					"
				>
					<span class="text-orange-600" v-if="operation.corrective_total_time_mins > 0">
						{{ formatMins(operation.corrective_total_time_mins) }} rework
					</span>
					<span v-else />
					<div class="text-right">
						<span class="text-orange-700 font-mono font-bold" v-if="reworkStarted">
							{{ reworkElapsedTime }}
						</span>
						<span class="text-orange-600 text-xl ml-2" v-if="operation.corrective_employee_time_mins > 0">
							Your total:
							{{ formatMins(operation.corrective_employee_time_mins) }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import type { PropType } from "vue";
import Button from "./Button.vue";
import IconPin from "~icons/lucide/pin";
import type { Operation, ActiveTimer, MachineTimer, WorkOrder } from "../types";

export default defineComponent({
	name: "JobCardWidget",
	components: {
		Button,
		IconPin,
	},
	props: {
		operation: {
			type: Object as PropType<Operation>,
			default: () => ({}),
		},
		activeTimer: {
			type: Object as PropType<ActiveTimer | null>,
			default: null,
		},
		machineTimers: {
			type: Array as PropType<MachineTimer[]>,
			default: () => [],
		},
		workOrderName: {
			type: String,
			required: true,
		},
		pinned: {
			type: Boolean,
			default: false,
		},
		showPin: {
			type: Boolean,
			default: true,
		},
		productName: {
			type: String,
			default: "",
		},
	},
	emits: ["start-task", "stop-task", "start-rework", "stop-rework", "toggle-pin"],

	data(): {
		elapsedTime: string;
		reworkElapsedTime: string;
		interval: ReturnType<typeof setInterval> | null;
	} {
		return {
			elapsedTime: "00:00:00",
			reworkElapsedTime: "00:00:00",
			interval: null,
		};
	},

	computed: {
		isMachine(): boolean {
			return !!this.operation.is_machine_time;
		},
		/** Active = colored bg + ring; inactive = white bg + colored border. */
		cardClasses(): string {
			if (this.active_user && this.reworkStarted) {
				return "ring-2 ring-orange-500 bg-orange-100";
			}
			if (this.active_user) {
				return this.isMachine ? "ring-2 ring-blue-500 bg-blue-100" : "ring-2 ring-green-500 bg-green-100";
			}
			// Inactive — white bg, colored border to show type
			return this.isMachine ? "bg-white border-blue-200" : "bg-white border-green-200";
		},
		/** Operation name always in the type color. */
		titleColor(): string {
			return this.isMachine ? "text-blue-700" : "text-green-700";
		},
		/** The matching machine timer for this operation, if any. */
		activeMachineTimer(): MachineTimer | undefined {
			if (!this.isMachine) return undefined;
			return this.machineTimers.find(
				(t) => t.work_order === this.workOrderName && t.operation === this.operation.operation,
			);
		},
		/** True when the labor activeTimer is for this card. */
		isLaborActiveForThis(): boolean {
			if (this.isMachine) return false;
			return (
				this.activeTimer?.work_order === this.workOrderName &&
				this.activeTimer?.operation === this.operation.operation
			);
		},
		/** Unified "is active" — machine or labor. */
		isActiveForThis(): boolean {
			return this.isMachine ? !!this.activeMachineTimer : this.isLaborActiveForThis;
		},
		taskStarted(): boolean {
			if (this.isMachine) return !!this.activeMachineTimer && !this.activeMachineTimer.is_corrective;
			return this.isLaborActiveForThis && !this.activeTimer!.is_corrective;
		},
		reworkStarted(): boolean {
			if (this.isMachine) return !!this.activeMachineTimer?.is_corrective;
			return this.isLaborActiveForThis && !!this.activeTimer!.is_corrective;
		},
		active_user(): boolean {
			return this.isActiveForThis;
		},
		hasTimeData(): boolean {
			return (
				this.isActiveForThis ||
				this.operation.actual_time_mins > 0 ||
				this.operation.corrective_total_time_mins > 0 ||
				this.operation.employee_time_mins > 0 ||
				this.operation.corrective_employee_time_mins > 0
			);
		},
		totalLoggedMins(): number {
			return (this.operation.actual_time_mins || 0) + (this.operation.corrective_total_time_mins || 0);
		},
		progressPercent(): number {
			if (this.operation.planned_time_mins <= 0) return 0;
			if (this.totalLoggedMins <= this.operation.planned_time_mins) {
				return Math.round((this.totalLoggedMins / this.operation.planned_time_mins) * 100);
			}
			// On overrun: green shows planned as proportion of total logged
			return Math.round((this.operation.planned_time_mins / this.totalLoggedMins) * 100);
		},
		overrunPercent(): number {
			if (!this.isOverrun) return 0;
			return 100 - this.progressPercent;
		},
		isOverrun(): boolean {
			return this.totalLoggedMins > this.operation.planned_time_mins;
		},
		progressHintClass(): string {
			if (this.isOverrun) return "text-red-600";
			if (this.progressPercent >= 80) return "text-orange-600";
			return "text-ink-gray-5";
		},
	},

	methods: {
		startTask() {
			this.$emit("start-task", this.operation.operation);
		},

		stopTask() {
			this.$emit("stop-task", this.operation.operation);
		},

		startRework() {
			this.$emit("start-rework", this.operation.operation);
		},

		stopRework() {
			this.$emit("stop-rework", this.operation.operation);
		},

		formatElapsedTime(startTime: Date): string {
			const now = new Date();
			const timeDiff = now.getTime() - startTime.getTime();

			const hours = Math.floor(timeDiff / (1000 * 60 * 60));
			const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

			return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
		},

		updateElapsedDisplay(): void {
			if (this.isMachine) {
				// Machine timer — use machineTimers array
				const mt = this.activeMachineTimer;
				if (!mt?.from_time) return;
				const elapsed = this.formatElapsedTime(new Date(mt.from_time));
				if (mt.is_corrective) {
					this.reworkElapsedTime = elapsed;
				} else {
					this.elapsedTime = elapsed;
				}
				return;
			}
			// Labor timer
			if (!this.isLaborActiveForThis || !this.activeTimer?.from_time) return;
			const start = new Date(this.activeTimer.from_time);
			const elapsed = this.formatElapsedTime(start);
			if (this.activeTimer.is_corrective) {
				this.reworkElapsedTime = elapsed;
			} else {
				this.elapsedTime = elapsed;
			}
		},

		formatMins(mins: number): string {
			if (mins <= 0) return "0m";
			const h = Math.floor(mins / 60);
			const m = Math.round(mins % 60);
			if (h > 0 && m > 0) return `${h}h ${m}m`;
			if (h > 0) return `${h}h`;
			return `${m}m`;
		},
	},

	mounted() {
		watch(
			() => this.isActiveForThis,
			(active) => {
				if (this.interval) {
					clearInterval(this.interval);
					this.interval = null;
				}
				if (active) {
					this.updateElapsedDisplay();
					this.interval = setInterval(() => this.updateElapsedDisplay(), 1000);
				} else {
					this.elapsedTime = "00:00:00";
					this.reworkElapsedTime = "00:00:00";
				}
			},
			{ immediate: true },
		);
	},

	unmounted() {
		if (this.interval !== null) clearInterval(this.interval);
	},
});
</script>
