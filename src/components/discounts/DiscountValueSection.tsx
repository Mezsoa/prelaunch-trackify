
import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DiscountFormValues } from "./DiscountFormSchema";

interface DiscountValueSectionProps {
  control: Control<DiscountFormValues>;
}

export const DiscountValueSection: React.FC<DiscountValueSectionProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="10"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? 0 : parseFloat(value));
                }}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
