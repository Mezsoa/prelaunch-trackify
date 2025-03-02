
-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Discount rules table
CREATE TABLE IF NOT EXISTS discount_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracking sessions table
CREATE TABLE IF NOT EXISTS tracking_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  source TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer discounts table
CREATE TABLE IF NOT EXISTS customer_discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  discount_id UUID NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, discount_id)
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_discounts ENABLE ROW LEVEL SECURITY;

-- Policy for customers table
CREATE POLICY "Users can read their own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customer data"
  ON customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for discount_rules table
CREATE POLICY "Users can read all discount rules"
  ON discount_rules FOR SELECT
  USING (true);

CREATE POLICY "Users can create discount rules"
  ON discount_rules FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update discount rules they created"
  ON discount_rules FOR UPDATE
  USING (auth.uid() = created_by);

-- Policy for tracking_sessions table
CREATE POLICY "Users can read tracking sessions related to their customer data"
  ON tracking_sessions FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
    OR customer_id IS NULL -- Allow reading anonymous sessions
  );

CREATE POLICY "Anyone can create tracking sessions"
  ON tracking_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update tracking sessions related to their customer data"
  ON tracking_sessions FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
    OR customer_id IS NULL -- Allow updating anonymous sessions
  );

-- Policy for customer_discounts table
CREATE POLICY "Users can read their own customer discounts"
  ON customer_discounts FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own customer discounts"
  ON customer_discounts FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own customer discounts"
  ON customer_discounts FOR UPDATE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Create a function to increment the discount usage count
CREATE OR REPLACE FUNCTION increment_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.used = TRUE AND OLD.used = FALSE THEN
    UPDATE discount_rules
    SET current_uses = current_uses + 1
    WHERE id = NEW.discount_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to increment the discount usage count
CREATE TRIGGER increment_discount_usage_trigger
AFTER UPDATE ON customer_discounts
FOR EACH ROW
EXECUTE FUNCTION increment_discount_usage();
