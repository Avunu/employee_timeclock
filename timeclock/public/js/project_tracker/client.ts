import { frappeCall } from "../FrappeCall";
import type {
  AuthenticateEmployeeResponse,
  UserSessionEmployee,
  EmployeeCheckinResponse,
  GetActiveTimerResponse,
  GetDeviceInfoResponse,
  GetMachineTimersResponse,
  GetOperationsResponse,
  GetWorkOrdersResponse,
  GetWorkstationsResponse,
  StartTimerResponse,
  StopMachineTimerResponse,
  StopTimerResponse,
  SubmitJobCardResponse,
  VerifyLoginResponse,
} from "./types";

const METHOD = "timeclock.www.project_tracker.project_tracker";

export const api = {
  authenticateEmployee(rfid: string) {
    return frappeCall<AuthenticateEmployeeResponse>(
      `${METHOD}.authenticate_employee`,
      { rfid },
    );
  },

  userSessionEmployee() {
    return frappeCall<UserSessionEmployee>(
      `${METHOD}.get_user_session_employee`,
    );
  },

  logInEmployee(time: string, token?: string | null) {
    return frappeCall<EmployeeCheckinResponse>(
      `${METHOD}.log_in_employee`,
      { time, token },
    );
  },

  logOutEmployee(time: string, token?: string | null) {
    return frappeCall<EmployeeCheckinResponse>(
      `${METHOD}.log_out_employee`,
      { time, token },
    );
  },

  getWorkOrders(token?: string | null) {
    return frappeCall<GetWorkOrdersResponse>(
      `${METHOD}.get_work_orders`,
      { token },
    );
  },

  getOperations(
    workOrder: string,
    workstations: string,
    token?: string | null,
  ) {
    return frappeCall<GetOperationsResponse>(
      `${METHOD}.get_operations`,
      { work_order: workOrder, workstations, token },
    );
  },

  getActiveTimer(token?: string | null) {
    return frappeCall<GetActiveTimerResponse>(
      `${METHOD}.get_active_timer`,
      { token },
    );
  },

  startTimer(
    workOrder: string,
    operation: string,
    startTime: string,
    isCorrective: boolean,
    token?: string | null,
  ) {
    return frappeCall<StartTimerResponse>(
      `${METHOD}.start_timer`,
      {
        work_order: workOrder,
        operation,
        start_time: startTime,
        is_corrective: isCorrective,
        token,
      },
    );
  },

  stopTimer(endTime: string, token?: string | null) {
    return frappeCall<StopTimerResponse>(
      `${METHOD}.stop_timer`,
      { end_time: endTime, token },
    );
  },

  submitJobcard(
    jobCard: { name: string; operation: string },
    completeTime: string,
    token?: string | null,
  ) {
    return frappeCall<SubmitJobCardResponse>(
      `${METHOD}.submit_jobcard`,
      { jobCard, complete_time: completeTime, token },
    );
  },

  getWorkstations() {
    return frappeCall<GetWorkstationsResponse>(
      `${METHOD}.get_workstations`,
    );
  },

  getDeviceInfo() {
    return frappeCall<GetDeviceInfoResponse>(
      `${METHOD}.get_device_info`,
    );
  },

  getMachineTimers(token?: string | null) {
    return frappeCall<GetMachineTimersResponse>(
      `${METHOD}.get_machine_timers`,
      { token },
    );
  },

  stopMachineTimer(
    workOrder: string,
    operation: string,
    endTime: string,
    token?: string | null,
  ) {
    return frappeCall<StopMachineTimerResponse>(
      `${METHOD}.stop_machine_timer`,
      {
        work_order: workOrder,
        operation,
        end_time: endTime,
        token,
      },
    );
  },

  verifyLogin(email: string, password: string) {
    return frappeCall<VerifyLoginResponse>(
      `${METHOD}.verify_login`,
      { email, password },
    );
  },
} as const;
