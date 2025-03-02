
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getCustomer, createCustomer } from '@/lib/database';
import type { Customer } from '@/lib/database-schema';

export const useCustomer = () => {
  const { user } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!user) {
        setCustomer(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const customerData = await getCustomer(user.id);
        
        if (customerData) {
          setCustomer(customerData);
        } else {
          // Create customer record if it doesn't exist
          if (user.email) {
            const newCustomer = await createCustomer({
              user_id: user.id,
              email: user.email,
            });
            
            if (newCustomer) {
              setCustomer(newCustomer);
            }
          }
        }
      } catch (err) {
        console.error('Error in useCustomer hook:', err);
        setError('Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [user]);

  return { customer, loading, error };
};
