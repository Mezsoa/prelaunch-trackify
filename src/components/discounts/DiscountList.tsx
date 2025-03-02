
import React, { useEffect, useState } from 'react';
import { getDiscountRules } from '@/lib/database';
import type { DiscountRule } from '@/lib/database-schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const DiscountList = () => {
  const [discounts, setDiscounts] = useState<DiscountRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discountRules = await getDiscountRules();
        setDiscounts(discountRules);
      } catch (error) {
        console.error('Error fetching discounts:', error);
        toast.error('Failed to load discount codes');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const isExpired = (discount: DiscountRule) => {
    if (!discount.expires_at) return false;
    return new Date(discount.expires_at) < new Date();
  };

  const isFullyUsed = (discount: DiscountRule) => {
    if (!discount.max_uses) return false;
    return discount.current_uses >= discount.max_uses;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No discount codes found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {discounts.map((discount) => (
        <Card key={discount.id} className={`${isExpired(discount) || isFullyUsed(discount) ? 'opacity-70' : ''}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{discount.name}</CardTitle>
              <Badge variant={isExpired(discount) || isFullyUsed(discount) ? "outline" : "default"}>
                {discount.type === 'percentage' ? `${discount.amount}%` : `$${discount.amount.toFixed(2)}`}
              </Badge>
            </div>
            <CardDescription>Code: <span className="font-mono">{discount.code}</span></CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {discount.description && <p className="mb-2">{discount.description}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {isExpired(discount) && (
                <Badge variant="destructive">Expired</Badge>
              )}
              {isFullyUsed(discount) && (
                <Badge variant="destructive">Fully Used</Badge>
              )}
              {discount.max_uses && (
                <Badge variant="secondary">
                  {discount.current_uses} / {discount.max_uses} used
                </Badge>
              )}
              {discount.expires_at && !isExpired(discount) && (
                <Badge variant="secondary">
                  Expires: {new Date(discount.expires_at).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-500">
            Created: {new Date(discount.created_at).toLocaleDateString()}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DiscountList;
