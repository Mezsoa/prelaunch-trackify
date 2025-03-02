
import { useState } from 'react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createDiscountRule } from "@/lib/database";
import { DiscountFormValues } from "./DiscountFormSchema";

export const useDiscountSubmit = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: DiscountFormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a discount");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting discount with values:", values);
      const discountAmount = typeof values.amount === 'string' 
        ? parseFloat(values.amount) 
        : values.amount;
        
      const maxUses = values.max_uses === '' 
        ? null 
        : (typeof values.max_uses === 'string' 
            ? parseInt(values.max_uses) 
            : values.max_uses);

      const result = await createDiscountRule({
        name: values.name,
        code: values.code,
        description: values.description || "",
        amount: discountAmount,
        type: values.type,
        max_uses: maxUses,
        expires_at: values.expires_at,
        created_by: user.id,
        starts_at: new Date().toISOString(),
      });

      if (result) {
        toast.success("Discount code created successfully");
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error("Failed to create discount code");
        return false;
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      toast.error("An error occurred while creating the discount code");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
