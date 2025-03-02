
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createDiscountRule } from '@/lib/database';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Discount name must be at least 2 characters' }),
  code: z.string().min(3, { message: 'Discount code must be at least 3 characters' })
    .regex(/^[A-Z0-9_-]+$/, { message: 'Discount code can only contain uppercase letters, numbers, underscores, and hyphens' }),
  description: z.string().optional(),
  amount: z.string().transform(val => parseFloat(val)),
  type: z.enum(['percentage', 'fixed']),
  max_uses: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  expires_at: z.string().optional().transform(val => val || undefined),
});

type FormValues = z.infer<typeof formSchema>;

const DiscountForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      amount: '',
      type: 'percentage',
      max_uses: '',
      expires_at: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a discount');
      return;
    }

    try {
      const result = await createDiscountRule({
        name: values.name,
        code: values.code,
        description: values.description,
        amount: values.amount,
        type: values.type,
        max_uses: values.max_uses ? parseInt(values.max_uses.toString()) : undefined,
        expires_at: values.expires_at,
        created_by: user.id,
        starts_at: new Date().toISOString(),
      });

      if (result) {
        toast.success('Discount code created successfully');
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to create discount code');
      }
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('An error occurred while creating the discount code');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input placeholder="SUMMER2023" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormDescription>Code that customers will enter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Summer sale discount for new customers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="max_uses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Uses (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="100" {...field} />
                </FormControl>
                <FormDescription>Leave empty for unlimited</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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

        <Button type="submit" className="w-full">Create Discount Code</Button>
      </form>
    </Form>
  );
};

export default DiscountForm;
