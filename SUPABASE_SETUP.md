# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - **Name**: `brandcraft-saas`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 2. Get Project Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJ...` (starts with eyJ)
   - **service_role key**: `eyJ...` (starts with eyJ)

### 3. Create Environment File

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Alternative names (for backward compatibility)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration (optional - add these later)
# OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `scripts/setup-secrets-table.sql`
3. Click "Run" to execute the SQL

### 5. Test the Setup

Run the development server:

```bash
pnpm run dev
```

Visit `http://localhost:3000/admin/api-keys` to configure your API keys.

## 🔧 Database Schema

The setup creates a `secrets` table with:

- `id`: Unique identifier
- `name`: API key name (e.g., "openai_api_key")
- `value`: The actual API key value
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## 🔒 Security Features

- **Row Level Security (RLS)**: Enabled on the secrets table
- **Service Role Access**: Only the service role can access secrets
- **Automatic Timestamps**: Updated automatically on changes

## 🚨 Important Notes

1. **Never commit `.env.local`** - it's already in `.gitignore`
2. **Keep service role key secret** - it has full database access
3. **Use environment variables** in production deployments
4. **Backup your database** regularly

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript) 