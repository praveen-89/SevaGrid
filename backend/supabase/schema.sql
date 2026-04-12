-- Supabase schema generated for SevaGrid
-- Enum Definitions

CREATE TYPE user_role AS ENUM ('ADMIN', 'FIELD_STAFF', 'VOLUNTEER');
CREATE TYPE case_status AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'READY_FOR_ASSIGNMENT', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED_PENDING_VERIFICATION', 'COMPLETED', 'FAILED', 'ESCALATED');
CREATE TYPE assignment_status AS ENUM ('ASSIGNED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');
CREATE TYPE volunteer_status AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');
CREATE TYPE attachment_kind AS ENUM ('INTAKE', 'PROOF');
CREATE TYPE proof_verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE case_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Profiles Table (Extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer Profiles
CREATE TABLE volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    status volunteer_status DEFAULT 'OFFLINE',
    rating NUMERIC(3,2) DEFAULT 0.0,
    completed_tasks_count INT DEFAULT 0,
    active_tasks_count INT DEFAULT 0,
    location_label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer Specialties
CREATE TABLE volunteer_specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_profile_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    specialty TEXT NOT NULL
);

-- Cases Main Table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    severity case_severity NOT NULL DEFAULT 'MEDIUM',
    status case_status NOT NULL DEFAULT 'SUBMITTED',
    people_affected INT DEFAULT 0,
    address TEXT NOT NULL,
    area TEXT NOT NULL,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    field_staff_id UUID NOT NULL REFERENCES profiles(id),
    assigned_volunteer_id UUID REFERENCES volunteer_profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case History (Audit Timeline)
CREATE TABLE case_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    status case_status NOT NULL,
    actor_id UUID NOT NULL REFERENCES profiles(id),
    actor_name_snapshot TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case Attachments (Intake and Proof)
CREATE TABLE case_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    kind attachment_kind NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proof Submissions 
CREATE TABLE proof_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id),
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    verification_status proof_verification_status DEFAULT 'PENDING',
    verification_note TEXT
);

-- Assignments History
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id),
    assigned_by UUID NOT NULL REFERENCES profiles(id),
    status assignment_status NOT NULL DEFAULT 'ASSIGNED',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    note TEXT
);

-- Automatically update `updated_at` triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_volunteer_profiles_updated_at BEFORE UPDATE ON volunteer_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Note on Row Level Security (RLS)
-- To ensure robust security, the following is a baseline. 
-- In a real scenario, the Express backend typically operates via the SUPPLEMENTARY Service Role key, bypassing RLS directly.
-- However, if frontend direct queries were allowed:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow individuals to update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Cases RLS (Strict filtering)
-- Admins can view all cases
CREATE POLICY "Admin full access" ON cases FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Field staff can see only their own cases
CREATE POLICY "Field staff own cases" ON cases FOR SELECT USING (
    field_staff_id = auth.uid()
);

-- Volunteers can see their assigned cases
CREATE POLICY "Volunteer assigned cases" ON cases FOR SELECT USING (
    assigned_volunteer_id IN (SELECT id FROM volunteer_profiles WHERE user_id = auth.uid())
);
