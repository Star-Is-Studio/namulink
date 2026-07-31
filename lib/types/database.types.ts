export interface PRDChild {
  id: string;
  name: string;
  birth_date: string;
  status: "ACTIVE" | "EVALUATING" | "PAUSED" | "TERMINATED";
  termination_reason?: string;
  parent_phone?: string;
  address?: string;
  inflow_channel?: string;
  created_at?: string;
}

export interface PRDChildTherapy {
  id: string;
  child_id: string;
  therapist_id?: string;
  support_type: string;
  day_of_week: string;
  time_slot: string;
  fee_type?: string;
  fee: number;
  start_date?: string;
  end_date?: string;
}

export interface PRDSchedule {
  id: string;
  child_id: string;
  therapist_id?: string;
  therapy_id?: string;
  scheduled_at: string;
  status: "ATTENDED" | "ABSENT" | "MAKEUP_NEEDED" | "MAKEUP_COMPLETED";
  is_makeup: boolean;
  makeup_origin_id?: string;
  handoff_note?: string;
}

export interface PRDPayment {
  id: string;
  child_id: string;
  month_key: string;
  paid_sessions: number;
  amount: number;
  status: "PAID" | "UNPAID" | "PARTIAL";
  depositor_name?: string;
  paid_at?: string;
  is_locked?: boolean;
}

export interface PRDTherapyDocument {
  id: string;
  child_id: string;
  therapist_id?: string;
  doc_type: "DAILY" | "PLAN" | "MID_EVAL" | "FINAL_EVAL";
  content: Record<string, any>;
  created_at?: string;
}
