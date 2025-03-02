
/**
 * This file defines the database schema for the Trackify application.
 * These tables should be created in your Supabase dashboard.
 * 
 * Table definitions:
 * 
 * 1. customers - Stores customer information
 *    - id: uuid (primary key, default: uuid_generate_v4())
 *    - user_id: uuid (references auth.users.id)
 *    - email: text (unique, not null)
 *    - first_name: text
 *    - last_name: text
 *    - created_at: timestamp with time zone (default: now())
 * 
 * 2. discount_rules - Stores discount rules configuration
 *    - id: uuid (primary key, default: uuid_generate_v4())
 *    - name: text (not null)
 *    - code: text (unique, not null)
 *    - description: text
 *    - amount: numeric (not null)
 *    - type: text (not null, options: 'percentage', 'fixed')
 *    - starts_at: timestamp with time zone
 *    - expires_at: timestamp with time zone
 *    - max_uses: integer
 *    - current_uses: integer (default: 0)
 *    - created_by: uuid (references auth.users.id)
 *    - created_at: timestamp with time zone (default: now())
 * 
 * 3. tracking_sessions - Stores customer tracking information
 *    - id: uuid (primary key, default: uuid_generate_v4())
 *    - customer_id: uuid (references customers.id, can be null for anonymous sessions)
 *    - source: text
 *    - referrer: text
 *    - ip_address: text
 *    - user_agent: text
 *    - session_start: timestamp with time zone (default: now())
 *    - session_end: timestamp with time zone
 *    - created_at: timestamp with time zone (default: now())
 * 
 * 4. customer_discounts - Tracks which discounts are assigned to which customers
 *    - id: uuid (primary key, default: uuid_generate_v4())
 *    - customer_id: uuid (references customers.id, not null)
 *    - discount_id: uuid (references discount_rules.id, not null)
 *    - used: boolean (default: false)
 *    - used_at: timestamp with time zone
 *    - created_at: timestamp with time zone (default: now())
 * 
 * RLS Policies:
 * 
 * 1. customers table:
 *    - Users can read their own customer data
 *    - Users can create their own customer data
 *    - Users can update their own customer data
 * 
 * 2. discount_rules table:
 *    - Users can read all discount rules
 *    - Users can create discount rules
 *    - Users can update discount rules they created
 * 
 * 3. tracking_sessions table:
 *    - Users can read tracking sessions related to their customer data
 *    - Anyone can create tracking sessions (for anonymous tracking)
 *    - Users can update tracking sessions related to their customer data
 * 
 * 4. customer_discounts table:
 *    - Users can read their own customer discounts
 *    - Users can create their own customer discounts
 *    - Users can update their own customer discounts
 */

export type Customer = {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
};

export type DiscountRule = {
  id: string;
  name: string;
  code: string;
  description?: string;
  amount: number;
  type: 'percentage' | 'fixed';
  starts_at?: string;
  expires_at?: string;
  max_uses?: number;
  current_uses: number;
  created_by: string;
  created_at: string;
};

export type TrackingSession = {
  id: string;
  customer_id?: string;
  source?: string;
  referrer?: string;
  ip_address?: string;
  user_agent?: string;
  session_start: string;
  session_end?: string;
  created_at: string;
};

export type CustomerDiscount = {
  id: string;
  customer_id: string;
  discount_id: string;
  used: boolean;
  used_at?: string;
  created_at: string;
};
