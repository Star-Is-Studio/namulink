-- =================================================================
-- 나무링크 (NamuLink) 엔터프라이즈 RDB 스키마 (v2.0)
-- 
-- 주요 특징:
-- 1. Multi-Tenant (타 센터 임대 사업 확장 지원)
-- 2. RBAC 권한 (슈퍼관리자, 기관관리자/행정, 치료사, 학부모)
-- 3. 표준 정규화 RDB (아동, 다중 보호자, 치료계획/계약, 실진행 회기)
-- 4. 결제회기 vs 실진행회기 분리 기반 치료사 급여 정산
-- 5. 발본(당월), 발추/센터(이월) 보강 추적 및 치료사 휴가 연동
-- 6. 다양한 사업/서식 가변 평가보고서(제공계획/중간/종결) 지원
-- =================================================================

-- 확장을 위한 UUID 및 PG extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- 1. MULTI-TENANT & USER RBAC (기관 및 사용자 권한)
-- =================================================================

-- 기관(센터) 마스터
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,             -- 예: 'daejeon_jarana'
    name VARCHAR(100) NOT NULL,                   -- 예: '자라는나무 아동발달센터 대전점'
    biz_no VARCHAR(20),                           -- 사업자등록번호
    owner_name VARCHAR(50),                       -- 대표자명
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 통합 사용자 계정 (RBAC)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    username VARCHAR(50) NOT NULL,                -- 로그인 아이디
    password_hash VARCHAR(255) NOT NULL,          -- 비밀번호 해시
    name VARCHAR(50) NOT NULL,                    -- 성명
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff', 'therapist', 'parent')),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_tenant_username UNIQUE (tenant_id, username)
);

-- 치료사/재활사 상세 프로필
CREATE TABLE therapists (
    therapist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    employment_type VARCHAR(20) DEFAULT 'freelancer' CHECK (employment_type IN ('freelancer', 'fulltime', 'parttime')), -- 프리랜서/근로
    pay_rate NUMERIC(5,2) DEFAULT 0.00,           -- 급여 비율 (%) 예: 60.00
    hourly_rate INT DEFAULT 0,                    -- 회기당 고정 단가 (원)
    specialties TEXT[],                           -- 전문 분야 ['언어', '감통', '놀이']
    join_date DATE,                               -- 입사일
    rrn_encrypted TEXT,                           -- 암호화된 주민등록번호 (필요 시)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'resigned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학부모 프로필
CREATE TABLE parents (
    parent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- 2. CHILD & GUARDIAN & COUNSEL (아동 및 상담/보호자)
-- =================================================================

-- 아동 마스터
CREATE TABLE children (
    child_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    mgmt_no VARCHAR(50) NOT NULL,                -- 관리자번호 (예: 202601자라는001)
    name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('남', '여', '기타')),
    disability_registered BOOLEAN DEFAULT FALSE,  -- 장애등록 여부
    disability_type VARCHAR(50),                  -- 장애 유형 (시각, 청각, 지적, 자폐성 등)
    disability_level VARCHAR(50),                 -- 장애 정도 (심함, 심하지 않음)
    income_bracket VARCHAR(50),                   -- 소득분위 (가형, 나형, 다형 등 -> 발본 세팅)
    address TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('consulting', 'evaluating', 'active', 'paused', 'terminated')), -- 상태(상담중/평가중/치료중/휴식/종결)
    termination_reason TEXT,                      -- 종결 사유
    inflow_channel VARCHAR(50),                   -- 유입 경로 (아웃리치/본인/소개 등)
    manager_user_id UUID REFERENCES users(user_id), -- 담당 행정 매니저
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_tenant_mgmt_no UNIQUE (tenant_id, mgmt_no)
);

-- 아동 ↔ 보호자 1:N 매핑
CREATE TABLE child_guardians (
    relation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(parent_id) ON DELETE SET NULL,
    guardian_name VARCHAR(50) NOT NULL,
    relation VARCHAR(20) NOT NULL,               -- 관계 (모, 부, 조부, 조모, 기타)
    phone VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,            -- 대표 보호자 여부
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 신규 상담 및 평가 이벤트 기록 (다음년도 사업계획 반영용)
CREATE TABLE counsels (
    counsel_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(child_id) ON DELETE CASCADE,
    counselor_id UUID REFERENCES users(user_id),
    counsel_date DATE NOT NULL,
    eval_schedule_date DATE,                     -- 평가 예정일
    target_class VARCHAR(50),                    -- 대상자 구분 (수급자/차상위/일반)
    gov_subsidy INT DEFAULT 0,                   -- 정부지원금
    self_pay INT DEFAULT 0,                      -- 본인부담금
    content TEXT,                                -- 상담 내용
    result_action TEXT,                          -- 상담 결과 및 조치사항
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- 3. THERAPY CONTRACTS & SCHEDULES (치료 계약 및 회기/보강)
-- =================================================================

-- 치료 계약 및 정보
CREATE TABLE therapy_contracts (
    contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    support_type VARCHAR(50) NOT NULL,           -- 지원유형 (발달재활, 발추, 방치, 방치언, 방치작, 방과후, 센터비용 등)
    service_category VARCHAR(50) NOT NULL,        -- 언어재활, 감각통합, 미술심리 등
    fee_per_session INT NOT NULL,                -- 회기당 단가
    monthly_sessions INT NOT NULL DEFAULT 4,     -- 월 기본 횟수 (4회, 5회 등)
    self_pay_amount INT DEFAULT 0,               -- 본인부담금
    gov_subsidy_amount INT DEFAULT 0,            -- 정부지원금
    schedule_day VARCHAR(10) NOT NULL,           -- 요일 (월, 화, 수, 목, 금, 토)
    time_slot VARCHAR(20) NOT NULL,              -- 시간대 (예: 14:00~14:40)
    start_date DATE NOT NULL,                    -- 치료 개시일
    end_date DATE,                               -- 종결일
    is_paused BOOLEAN DEFAULT FALSE,
    handoff_note VARCHAR(100),                   -- 치료사 인수인계 표기 (한달간 표시)
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 회차별 실제 수업 및 일정 (월/주/일 스케줄)
CREATE TABLE schedules (
    schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES therapy_contracts(contract_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    year_month VARCHAR(7) NOT NULL,               -- YYYY-MM
    scheduled_date DATE NOT NULL,                -- 예정 제공일자
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_no INT DEFAULT 1,                    -- 회차 번호 (1회기, 2회기...)
    status VARCHAR(30) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',      -- 예정
        'completed',      -- 정상 진행
        'absent_child',   -- 아동 결석
        'absent_therapist',-- 치료사 휴무/휴가
        'canceled',       -- 취소
        'makeup_needed',  -- 보강 필요
        'makeup_done'     -- 보강 완료
    )),
    actual_date DATE,                            -- 실제 진행일자 (보강 시 변경)
    voucher_approval_no VARCHAR(50),             -- 바우처 승인번호
    voucher_approval_date DATE,                  -- 바우처 승인일자
    parent_signature TEXT,                       -- 이용자 확인 서명 (Base64/SVG)
    therapist_signature TEXT,                    -- 치료사 확인 서명
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보강 관리 (발본 당월, 발추/센터 이월 연동)
CREATE TABLE makeup_lessons (
    makeup_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    original_schedule_id UUID NOT NULL REFERENCES schedules(schedule_id) ON DELETE CASCADE,
    makeup_schedule_id UUID REFERENCES schedules(schedule_id) ON DELETE SET NULL,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    support_type VARCHAR(50) NOT NULL,
    reason VARCHAR(50) NOT NULL,                 -- 아동결석, 치료사휴가, 센터휴관 등
    allow_carryover BOOLEAN DEFAULT FALSE,       -- 이월 보강 가능 여부 (발본: FALSE, 발추/센터: TRUE)
    target_month VARCHAR(7) NOT NULL,            -- 발생 연월 (YYYY-MM)
    expire_month VARCHAR(7) NOT NULL,            -- 보강 마감 연월
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 치료사 휴가 및 센터 휴무
CREATE TABLE therapist_vacations (
    vacation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(100),
    status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- 4. PAYMENTS & PAYROLL (결제 및 실제 진행회기 기반 치료사 급여)
-- =================================================================

-- 월별 납부/결제 관리
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    contract_id UUID REFERENCES therapy_contracts(contract_id) ON DELETE CASCADE,
    year_month VARCHAR(7) NOT NULL,               -- 결제 대상 연월 (YYYY-MM)
    support_type VARCHAR(50) NOT NULL,
    paid_sessions INT DEFAULT 0,                 -- 결제 완료 회기 수
    total_amount INT NOT NULL,                   -- 총 수입 금액
    self_pay_amount INT DEFAULT 0,               -- 본인부담금 결제액
    gov_subsidy_amount INT DEFAULT 0,            -- 정부지원금 액수
    pay_status VARCHAR(20) DEFAULT 'unpaid' CHECK (pay_status IN ('unpaid', 'partial', 'paid', 'refunded')),
    pay_method VARCHAR(30),                      -- 신용카드, 계좌이체, 바우처 등
    paid_date DATE,
    depositor_name VARCHAR(50),                  -- 입금자명 (은행 대사용)
    deposit_date DATE,                           -- 실제 입금확인일
    is_locked BOOLEAN DEFAULT FALSE,             -- 완납 마감 락 (paid_locks)
    memo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_child_month_contract UNIQUE (child_id, year_month, contract_id)
);

-- 치료사 월별 급여 정산 (핵심: 실진행 회기 수 기준 정산)
CREATE TABLE therapist_payrolls (
    payroll_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    year_month VARCHAR(7) NOT NULL,               -- 정산 연월
    paid_sessions_count INT DEFAULT 0,           -- 참고: 결제된 회기 수
    actual_conducted_sessions INT NOT NULL,      -- ★ 핵심: 실제 진행(완료)된 회기 수
    gross_amount INT NOT NULL,                   -- 정산 총 급여액
    deductions INT DEFAULT 0,                    -- 공제액 (원천징수 3.3% 등)
    net_amount INT NOT NULL,                     -- 실수령액
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'paid')),
    paid_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uk_therapist_payroll_month UNIQUE (therapist_id, year_month)
);


-- =================================================================
-- 5. THERAPY LOGS & FORM REPORTS (치료기록 및 가변 서식 평가보고서)
-- =================================================================

-- 회차별 치료기록지
CREATE TABLE therapy_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID UNIQUE NOT NULL REFERENCES schedules(schedule_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    activity_content TEXT NOT NULL,              -- 주요 활동 내용 (STT 입력 지원)
    eval_note TEXT,                              -- 아동 반응 및 평가
    homework_note TEXT,                          -- 과제 및 제언
    parent_feedback TEXT,                        -- 학부모 피드백
    state_check JSONB,                           -- 아동 상태 체크 (옷, 표정, 컨디션)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 서식 템플릿 마스터 (다양한 기관/사업별 서식 지원)
CREATE TABLE form_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(tenant_id) ON DELETE CASCADE, -- NULL이면 공통 표준 양식
    form_code VARCHAR(50) NOT NULL,               -- plan(제공계획서), mid_eval(중간평가), final_eval(종결평가)
    title VARCHAR(100) NOT NULL,                  -- 양식명
    schema_definition JSONB NOT NULL,             -- 서식 항목 구조 (JSON Schema)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 제공계획서 / 중간평가보고서 / 종결평가보고서 (수시 수정 및 이력 관리)
CREATE TABLE assessment_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES therapy_contracts(contract_id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES children(child_id) ON DELETE CASCADE,
    therapist_id UUID NOT NULL REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    template_id UUID REFERENCES form_templates(template_id),
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('plan', 'mid_eval', 'final_eval')), -- 제공계획 / 중간(6개월) / 종결(12개월)
    eval_date DATE NOT NULL,
    long_term_goals TEXT,                         -- 장기 목표
    short_term_goals TEXT,                        -- 단기 목표
    activity_summary TEXT,                        -- 회차별 활동 요약
    change_progress TEXT,                         -- 변화 정도 및 달성도
    therapist_opinion TEXT,                       -- 종합 소견
    report_data JSONB DEFAULT '{}'::jsonb,        -- 가변 서식 확장 필드
    version INT DEFAULT 1,                        -- 수시 업데이트 버전 번호
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =================================================================
-- 6. NOTIFICATIONS & INDEXES (알림 및 인덱스)
-- =================================================================

-- 푸시 알림 & 카카오 알림톡 로그
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) CHECK (type IN ('schedule_change', 'vacation_notice', 'makeup_alert', 'eval_reminder', 'pay_alert')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 주요 조회성능 최적화 인덱스
CREATE INDEX idx_children_tenant_mgmt ON children (tenant_id, mgmt_no);
CREATE INDEX idx_schedules_month ON schedules (tenant_id, year_month, scheduled_date);
CREATE INDEX idx_schedules_therapist_date ON schedules (therapist_id, scheduled_date);
CREATE INDEX idx_schedules_child ON schedules (child_id, scheduled_date);
CREATE INDEX idx_payments_month ON payments (tenant_id, year_month, pay_status);
CREATE INDEX idx_reports_child_type ON assessment_reports (child_id, report_type);
