
import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DiscountFormValues } from "./DiscountFormSchema";

interface DiscountBasicInfoProps {
  control: Control<DiscountFormValues>;
}

export const DiscountBasicInfo: React.FC<DiscountBasicInfoProps> = ({
  control,
}) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Name</FormLabel>
            <FormControl>
              <Input placeholder="Summer Sale" {...field} />
            </FormControl>
            <FormDescription>Internal name for this discount</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Code</FormLabel>
            <FormControl>
              <Input
                placeholder="SUMMER2023"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />
            </FormControl>
            <FormDescription>Code that customers will enter</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Summer sale discount for new customers"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
