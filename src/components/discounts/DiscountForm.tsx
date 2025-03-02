
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { discountFormSchema, type DiscountFormValues } from "./DiscountFormSchema";
import { DiscountBasicInfo } from "./DiscountBasicInfo";
import { DiscountValueSection } from "./DiscountValueSection";
import { DiscountLimitsSection } from "./DiscountLimitsSection";
import { useDiscountSubmit } from "./useDiscountSubmit";

interface DiscountFormProps {
  onSuccess?: () => void;
}

const DiscountForm = ({ onSuccess }: DiscountFormProps) => {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      amount: 0,
      type: "percentage",
      max_uses: null,
      expires_at: "",
    },
    mode: "onChange",
  });

  const { handleSubmit, isSubmitting } = useDiscountSubmit(onSuccess);

  const onSubmit = async (values: DiscountFormValues) => {
    console.log("Form values before submission:", values);
    const success = await handleSubmit(values);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DiscountBasicInfo control={form.control} />
        <DiscountValueSection control={form.control} />
        <DiscountLimitsSection control={form.control} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Discount Code"}
        </Button>
      </form>
    </Form>
  );
};

export default DiscountForm;
