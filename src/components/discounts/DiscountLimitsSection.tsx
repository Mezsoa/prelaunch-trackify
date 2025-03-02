
import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DiscountFormValues } from "./DiscountFormSchema";

interface DiscountLimitsSectionProps {
  control: Control<DiscountFormValues>;
}

export const DiscountLimitsSection: React.FC<DiscountLimitsSectionProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="max_uses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Uses (Optional)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                placeholder="100" 
                {...field}
                value={field.value === null ? "" : field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? null : parseInt(value));
                }}
              />
            </FormControl>
            <FormDescription>Leave empty for unlimited</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="expires_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expiration Date (Optional)</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
