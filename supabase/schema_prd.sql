-- =================================================================
-- [PRD] 나무링크 (NamuLink) 아동발달센터 통합 관리 시스템 DDL 스키마 (v3.0)
-- =================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 아동 마스터
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE(치료중), PAUSED(휴식), TERMINATED(종결), EVALUATING(평가)
  termination_reason TEXT,
  parent_phone VARCHAR(20),
  address TEXT,
  inflow_channel VARCHAR(50), -- 유입경로 (아웃리치, 본인, 소개 등)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 아동별 등록 치료 (다중 치료 관계)
CREATE TABLE IF NOT EXISTS child_therapies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  therapist_id UUID,
  support_type VARCHAR(50), -- 발본, 발추, 방치, 센터 등
  day_of_week VARCHAR(10),
  time_slot VARCHAR(20),
  fee_type VARCHAR(50),
  fee INT DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 스케줄 및 보강 관리
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  therapist_id UUID,
  therapy_id UUID REFERENCES child_therapies(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(30) DEFAULT 'ATTENDED', -- ATTENDED(진행완료), ABSENT(결석), MAKEUP_NEEDED(보강필요), MAKEUP_COMPLETED(보강완료)
  is_makeup BOOLEAN DEFAULT FALSE,
  makeup_origin_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  handoff_note VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 납부 및 결제 기록
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  month_key VARCHAR(7) NOT NULL, -- YYYY-MM
  paid_sessions INT DEFAULT 0, -- 결제 회기 수
  amount INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'UNPAID', -- PAID, UNPAID, PARTIAL
  depositor_name VARCHAR(50),
  paid_at DATE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 치료기록 및 평가서 (통합 문서 관리)
CREATE TABLE IF NOT EXISTS therapy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  therapist_id UUID,
  doc_type VARCHAR(50) NOT NULL, -- DAILY(일지), PLAN(제공계획서), MID_EVAL(중간평가), FINAL_EVAL(종결평가)
  content JSONB NOT NULL, -- 서식별 가변 데이터
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 보안 설정
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_therapies ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON children FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON child_therapies FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON schedules FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON payments FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON therapy_documents FOR SELECT USING (true);
