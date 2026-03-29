-- ============================================================================
-- TaskFlow Database Initialization Script
-- Purpose: Single-paste setup for Supabase
-- Security: Complete RLS enforcement for multi-org isolation
-- Admin: Superadmin role for global metrics access
-- ============================================================================

-- ============================================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CREATE ORGANIZATIONS TABLE (Tenant isolation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  plan VARCHAR(50) DEFAULT 'basic', -- basic, pro, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================================================
-- 3. CREATE PROFILES TABLE (User identity + org membership)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member', -- member, admin, superadmin
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================================
-- 4. CREATE STAGES TABLE (Pipeline stages per org)
-- ============================================================================
CREATE TABLE IF NOT EXISTS stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#E5DBFF',
  position INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stages_org_id ON stages(org_id);
CREATE UNIQUE INDEX idx_stages_org_label ON stages(org_id, label);

-- ============================================================================
-- 5. CREATE PROJECTS TABLE (Core task management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  client VARCHAR(255) NOT NULL,
  stage_id UUID REFERENCES stages(id),
  priority VARCHAR(50) DEFAULT 'Med', -- Low, Med, High
  description TEXT,
  budget DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_stage_id ON projects(stage_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_priority ON projects(priority);

-- ============================================================================
-- 6. CREATE SUBTASKS TABLE (Project deliverables)
-- ============================================================================
CREATE TABLE IF NOT EXISTS subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  text VARCHAR(500) NOT NULL,
  done BOOLEAN DEFAULT false,
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subtasks_project_id ON subtasks(project_id);
CREATE INDEX idx_subtasks_done ON subtasks(done);
CREATE INDEX idx_subtasks_assigned_to ON subtasks(assigned_to);

-- ============================================================================
-- 7. CREATE ARCHIVES TABLE (Deleted/archived projects)
-- ============================================================================
CREATE TABLE IF NOT EXISTS archives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  project_data JSONB NOT NULL,
  archived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  archived_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_archives_org_id ON archives(org_id);
CREATE INDEX idx_archives_archived_at ON archives(archived_at);

-- ============================================================================
-- 8. CREATE AUDIT LOG TABLE (System accountability)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(user_id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_org_id ON audit_logs(org_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) - ENABLE ON ALL TABLES
-- ============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 10. RLS POLICIES - ORGANIZATIONS TABLE
-- ============================================================================
-- Only owner can view their org
CREATE POLICY "Organizations: Owner can view" ON organizations
  FOR SELECT
  USING (owner_id = auth.uid());

-- Only owner can update their org
CREATE POLICY "Organizations: Owner can update" ON organizations
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Superadmin can view all orgs
CREATE POLICY "Organizations: Superadmin can view all" ON organizations
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'superadmin'
  ));

-- ============================================================================
-- 11. RLS POLICIES - PROFILES TABLE
-- ============================================================================
-- Users can view profiles in their org
CREATE POLICY "Profiles: Org members can view" ON profiles
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can update their own profile
CREATE POLICY "Profiles: Users can update self" ON profiles
  FOR UPDATE
  USING (user_id = auth.uid());

-- Org admins can update profiles in their org
CREATE POLICY "Profiles: Admins can update org profiles" ON profiles
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Superadmin can view all profiles
CREATE POLICY "Profiles: Superadmin can view all" ON profiles
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p2
    WHERE p2.user_id = auth.uid() AND p2.role = 'superadmin'
  ));

-- ============================================================================
-- 12. RLS POLICIES - STAGES TABLE (Org-isolated pipeline)
-- ============================================================================
-- Users can only see stages for their org
CREATE POLICY "Stages: Users can view org stages" ON stages
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can create stages in their org
CREATE POLICY "Stages: Users can create in org" ON stages
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can update stages in their org
CREATE POLICY "Stages: Users can update org stages" ON stages
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can delete stages in their org
CREATE POLICY "Stages: Users can delete org stages" ON stages
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 13. RLS POLICIES - PROJECTS TABLE (THE CRITICAL ISOLATION)
-- ============================================================================
-- Users can ONLY see projects in their org
CREATE POLICY "Projects: Org isolation on SELECT" ON projects
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can only INSERT projects into their org
CREATE POLICY "Projects: Org isolation on INSERT" ON projects
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can only UPDATE projects in their org
CREATE POLICY "Projects: Org isolation on UPDATE" ON projects
  FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can only DELETE projects in their org
CREATE POLICY "Projects: Org isolation on DELETE" ON projects
  FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Superadmin can view all projects globally
CREATE POLICY "Projects: Superadmin can view all" ON projects
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'superadmin'
  ));

-- ============================================================================
-- 14. RLS POLICIES - SUBTASKS TABLE
-- ============================================================================
-- Users can only view subtasks for projects in their org
CREATE POLICY "Subtasks: Org isolation on SELECT" ON subtasks
  FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (
        SELECT org_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Users can only INSERT subtasks into their org projects
CREATE POLICY "Subtasks: Org isolation on INSERT" ON subtasks
  FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (
        SELECT org_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Users can only UPDATE subtasks in their org
CREATE POLICY "Subtasks: Org isolation on UPDATE" ON subtasks
  FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (
        SELECT org_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Users can only DELETE subtasks in their org
CREATE POLICY "Subtasks: Org isolation on DELETE" ON subtasks
  FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE org_id IN (
        SELECT org_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- 15. RLS POLICIES - ARCHIVES TABLE
-- ============================================================================
-- Users can only view archives from their org
CREATE POLICY "Archives: Org isolation" ON archives
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Users can only INSERT archives to their org
CREATE POLICY "Archives: Org isolation on INSERT" ON archives
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 16. RLS POLICIES - AUDIT LOG TABLE
-- ============================================================================
-- Users can only view audit logs from their org
CREATE POLICY "Audit logs: Org isolation" ON audit_logs
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Org admins can INSERT audit logs
CREATE POLICY "Audit logs: Admins can insert" ON audit_logs
  FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- ============================================================================
-- 17. CREATE DEFAULT PIPELINE STAGES (Executed per org)
-- ============================================================================
-- NOTE: Call this function after creating an org to initialize default stages
CREATE OR REPLACE FUNCTION initialize_default_stages(org_uuid UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO stages (org_id, label, color, position) VALUES
    (org_uuid, 'Enquiry', '#C5F6FA', 0),
    (org_uuid, 'Site Survey', '#B4E7FF', 1),
    (org_uuid, 'LUX Calculation', '#FFE5A3', 2),
    (org_uuid, 'Design', '#E5DBFF', 3),
    (org_uuid, 'Procurement', '#FFE3A3', 4),
    (org_uuid, 'Quotation', '#B2F2BB', 5),
    (org_uuid, 'Sent', '#F8F9FA', 6),
    (org_uuid, 'Following', '#FFD8D8', 7),
    (org_uuid, 'Won', '#B2F2BB', 8),
    (org_uuid, 'Lost', '#FFD8D8', 9)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 18. SUPERADMIN ROLE CREATION
-- ============================================================================
-- To create a superadmin, manually execute this in Supabase as a service role:
-- INSERT INTO profiles (user_id, org_id, email, full_name, role)
-- VALUES (
--   'USER_ID_HERE',
--   (SELECT id FROM organizations LIMIT 1),
--   'admin@company.com',
--   'Super Admin',
--   'superadmin'
-- );

-- Or use this function for bulk promotion:
CREATE OR REPLACE FUNCTION promote_to_superadmin(user_email VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET role = 'superadmin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 19. UTILITY: Get organization metrics (for SuperAdmin dashboard)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_org_metrics(org_uuid UUID)
RETURNS TABLE (
  total_projects INT,
  total_members INT,
  completed_projects INT,
  avg_project_days DECIMAL,
  highest_priority_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(COUNT(DISTINCT p.id), 0)::INT as total_projects,
    COALESCE(COUNT(DISTINCT pr.id), 0)::INT as total_members,
    COALESCE(SUM(CASE WHEN s.label = 'Won' THEN 1 ELSE 0 END), 0)::INT as completed_projects,
    COALESCE(AVG(EXTRACT(DAY FROM (p.updated_at - p.created_at))), 0)::DECIMAL as avg_project_days,
    COALESCE(COUNT(CASE WHEN p.priority = 'High' THEN 1 ELSE NULL END), 0)::INT as highest_priority_count
  FROM projects p
  LEFT JOIN stages s ON p.stage_id = s.id
  LEFT JOIN profiles pr ON pr.org_id = org_uuid
  WHERE p.org_id = org_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 20. TRIGGER: Auto-update timestamp on records
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subtasks_updated_at BEFORE UPDATE ON subtasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 21. INITIAL SETUP NOTES (For non-developers)
-- ============================================================================
-- 1. Paste this entire file into Supabase SQL Editor
-- 2. Click "Run" to execute
-- 3. All tables, RLS policies, and functions are created
-- 4. To create first org:
--    INSERT INTO organizations (name, slug, owner_id)
--    VALUES ('Your Company', 'your-company', auth.uid());
-- 5. To initialize pipeline stages:
--    SELECT initialize_default_stages('ORG_ID_HERE');
-- 6. To view global metrics as superadmin:
--    SELECT * FROM get_org_metrics('ORG_ID_HERE');
-- ============================================================================
