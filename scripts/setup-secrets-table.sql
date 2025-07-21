-- Create secrets table for storing API keys
CREATE TABLE IF NOT EXISTS secrets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for security
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

-- Only service role can access secrets
CREATE POLICY "Service role can manage secrets" ON secrets
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_secrets_updated_at 
  BEFORE UPDATE ON secrets 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default API key placeholders (you'll need to update these with real keys)
INSERT INTO secrets (name, value) VALUES 
  ('openai_api_key', 'your-openai-api-key-here'),
  ('openrouter_api_key', 'your-openrouter-api-key-here')
ON CONFLICT (name) DO NOTHING;
