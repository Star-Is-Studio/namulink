export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Tenant {
  tenant_id: string
  code: string
  name: string
  biz_no?: string
  phone?: string
  address?: string
}

export interface User {
  user_id: string
  tenant_id: string
  username: string
  name: string
  role: 'super_admin' | 'admin' | 'staff' | 'therapist' | 'parent'
  phone?: string
  email?: string
}

export interface Therapist {
  therapist_id: string
  user_id?: string
  tenant_id: string
  name: string
  employment_type: 'freelancer' | 'fulltime' | 'parttime'
  pay_rate: number
  hourly_rate: number
  specialties: string[]
  status: 'active' | 'on_leave' | 'resigned'
}

export interface Child {
  child_id: string
  tenant_id: string
  mgmt_no: string
  name: string
  birth_date: string
  gender?: '남' | '여' | '기타'
  disability_registered: boolean
  disability_type?: string
  income_bracket?: string
  status: 'consulting' | 'evaluating' | 'active' | 'paused' | 'terminated'
  inflow_channel?: string
}

export interface TherapyContract {
  contract_id: string
  tenant_id: string
  child_id: string
  therapist_id: string
  support_type: string
  service_category: string
  fee_per_session: number
  monthly_sessions: number
  self_pay_amount: number
  gov_subsidy_amount: number
  schedule_day: string
  time_slot: string
  start_date: string
  end_date?: string
  handoff_note?: string
  status: 'active' | 'paused' | 'terminated'
}

export interface Schedule {
  schedule_id: string
  tenant_id: string
  contract_id: string
  child_id: string
  therapist_id: string
  year_month: string
  scheduled_date: string
  start_time: string
  end_time: string
  session_no: number
  status: 'scheduled' | 'completed' | 'absent_child' | 'absent_therapist' | 'canceled' | 'makeup_needed' | 'makeup_done'
  actual_date?: string
  voucher_approval_no?: string
}

export interface AssessmentReport {
  report_id: string
  tenant_id: string
  contract_id: string
  child_id: string
  therapist_id: string
  report_type: 'plan' | 'mid_eval' | 'final_eval'
  eval_date: string
  long_term_goals?: string
  short_term_goals?: string
  activity_summary?: string
  change_progress?: string
  therapist_opinion?: string
  version: number
}
