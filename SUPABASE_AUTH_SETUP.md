# TaskFlow Multi-Tenancy & Auth Setup

## Environment Variables

Add these to `.env.local`:

```env
# Supabase Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DATABASE_MODE=supabase

# Webhook
VITE_WEBHOOK_URL=https://hooks.zapier.com/your-webhook-url
```

## SQL Migrations

Run these in your Supabase SQL editor to set up multi-tenancy:

```sql
-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Organization relationship (multi-tenancy)
CREATE TABLE user_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'admin', 'member', 'viewer'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Projects table (scoped by organization_id)
CREATE TABLE projects (
  id BIGINT PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  stage_id BIGINT NOT NULL,
  priority TEXT DEFAULT 'Med',
  last_update TIMESTAMP DEFAULT NOW(),
  subtasks JSONB DEFAULT '[]',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  synced_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Access requests (new teams)
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  organization_id UUID REFERENCES organizations(id)
);

-- Enable RLS for data isolation
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Organizations
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = organizations.id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies: User-Organization
CREATE POLICY "Users can view their organization memberships"
  ON user_organizations FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policies: Projects (scoped by organization)
CREATE POLICY "Users can view projects in their organizations"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert projects in their organizations"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update projects in their organizations"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_organizations
      WHERE user_organizations.organization_id = projects.organization_id
      AND user_organizations.user_id = auth.uid()
    )
  );

-- RLS Policies: Access Requests
CREATE POLICY "Users can view pending access requests for their email"
  ON access_requests FOR SELECT
  USING (email = auth.jwt() ->> 'email' OR status = 'approved');

-- Enable real-time for projects
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE user_organizations;
```

## Implementation Steps

### 1. Wrap App with AuthProvider
```javascript
// src/main.jsx
import { AuthProvider } from './lib/authContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
);
```

### 2. Use Login in App.jsx
```javascript
import { useAuth } from './lib/authContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard'; // your main app

export default function App() {
  const { user, orgId, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user || !orgId) return <Login onLoginSuccess={useAuth().login} />;

  return <Dashboard />;
}
```

### 3. All Queries Automatically Filtered

When you use the store, projects are automatically filtered by organization_id:

```javascript
const { projects, organizationId } = useTaskFlow();
// projects array only contains projects where organization_id === organizationId
```

## Security Features

✓ **RLS Policies** enforce organization isolation at database level
✓ **Organization Context** stored in Zustand (organizationId, userId)
✓ **Multi-tenancy** every query filtered by organization_id
✓ **Role-Based Access** (admin/member/viewer) can be added to user_organizations
✓ **Access Requests** new users request team admission
✓ **Data Isolation** Company A cannot see Company B's pipeline

## Feature Roadmap

- [ ] Admin panel to approve access requests
- [ ] Invite links for team members
- [ ] Role-based permissions (editor, viewer, admin)
- [ ] Organization settings & billing
- [ ] Audit log for compliance
