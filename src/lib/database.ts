
import { supabase } from './supabase';
import type { Customer, DiscountRule, TrackingSession, CustomerDiscount } from './database-schema';

/**
 * Customer functions
 */
export const getCustomer = async (userId: string): Promise<Customer | null> => {
  // Check if supabase is properly initialized
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in getCustomer:', err);
    return null;
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) {
      console.error('Error creating customer:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in createCustomer:', err);
    return null;
  }
};

export const updateCustomer = async (id: string, customer: Partial<Omit<Customer, 'id' | 'user_id' | 'created_at'>>): Promise<Customer | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating customer:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in updateCustomer:', err);
    return null;
  }
};

/**
 * Discount rules functions
 */
export const getDiscountRules = async (): Promise<DiscountRule[]> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('discount_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discount rules:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getDiscountRules:', err);
    return [];
  }
};

export const getDiscountRule = async (id: string): Promise<DiscountRule | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('discount_rules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching discount rule:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in getDiscountRule:', err);
    return null;
  }
};

export const createDiscountRule = async (rule: Omit<DiscountRule, 'id' | 'current_uses' | 'created_at'>): Promise<DiscountRule | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('discount_rules')
      .insert({ ...rule, current_uses: 0 })
      .select()
      .single();

    if (error) {
      console.error('Error creating discount rule:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in createDiscountRule:', err);
    return null;
  }
};

export const updateDiscountRule = async (id: string, rule: Partial<Omit<DiscountRule, 'id' | 'created_by' | 'created_at'>>): Promise<DiscountRule | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('discount_rules')
      .update(rule)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating discount rule:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in updateDiscountRule:', err);
    return null;
  }
};

/**
 * Tracking sessions functions
 */
export const createTrackingSession = async (session: Omit<TrackingSession, 'id' | 'created_at'>): Promise<TrackingSession | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('tracking_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating tracking session:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in createTrackingSession:', err);
    return null;
  }
};

export const updateTrackingSession = async (id: string, session: Partial<Omit<TrackingSession, 'id' | 'created_at'>>): Promise<TrackingSession | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('tracking_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tracking session:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in updateTrackingSession:', err);
    return null;
  }
};

export const getCustomerSessions = async (customerId: string): Promise<TrackingSession[]> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('tracking_sessions')
      .select('*')
      .eq('customer_id', customerId)
      .order('session_start', { ascending: false });

    if (error) {
      console.error('Error fetching customer sessions:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getCustomerSessions:', err);
    return [];
  }
};

/**
 * Customer discounts functions
 */
export const getCustomerDiscounts = async (customerId: string): Promise<CustomerDiscount[]> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('customer_discounts')
      .select('*, discount_rules(*)')
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error fetching customer discounts:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception in getCustomerDiscounts:', err);
    return [];
  }
};

export const assignDiscountToCustomer = async (customerId: string, discountId: string): Promise<CustomerDiscount | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('customer_discounts')
      .insert({
        customer_id: customerId,
        discount_id: discountId,
        used: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error assigning discount to customer:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in assignDiscountToCustomer:', err);
    return null;
  }
};

export const markDiscountAsUsed = async (id: string): Promise<CustomerDiscount | null> => {
  if (!supabase || !supabase.from) {
    console.error('Supabase client not properly initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('customer_discounts')
      .update({
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error marking discount as used:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception in markDiscountAsUsed:', err);
    return null;
  }
};
