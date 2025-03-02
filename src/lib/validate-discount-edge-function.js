
// This is a Supabase Edge Function. 
// Copy this code into your Supabase Edge Functions section.

// File: functions/validate-discount/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Update in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Get user info from auth token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 401 }
      )
    }
    
    // Parse request body
    const { code } = await req.json()
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Discount code is required' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      )
    }
    
    // Get customer info
    const { data: customerData, error: customerError } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()
    
    if (customerError || !customerData) {
      return new Response(
        JSON.stringify({ error: 'Customer not found' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 404 }
      )
    }
    
    // Get discount code
    const { data: discountData, error: discountError } = await supabaseClient
      .from('discount_rules')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()
    
    if (discountError || !discountData) {
      return new Response(
        JSON.stringify({ error: 'Invalid discount code' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 404 }
      )
    }
    
    const now = new Date()
    
    // Validate discount code
    if (discountData.expires_at && new Date(discountData.expires_at) < now) {
      return new Response(
        JSON.stringify({ error: 'Discount code has expired' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      )
    }
    
    if (discountData.max_uses && discountData.current_uses >= discountData.max_uses) {
      return new Response(
        JSON.stringify({ error: 'Discount code has reached maximum usage limit' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      )
    }
    
    // Check if customer already has this discount assigned
    const { data: existingDiscount, error: existingError } = await supabaseClient
      .from('customer_discounts')
      .select('*')
      .eq('customer_id', customerData.id)
      .eq('discount_id', discountData.id)
      .maybeSingle()
    
    // If customer already has this discount, return it
    if (existingDiscount) {
      if (existingDiscount.used) {
        return new Response(
          JSON.stringify({ error: 'You have already used this discount code' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          discount: discountData,
          customer_discount: existingDiscount,
          message: 'Discount code already applied to your account' 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }
    
    // Assign discount to customer
    const { data: newDiscount, error: assignError } = await supabaseClient
      .from('customer_discounts')
      .insert({
        customer_id: customerData.id,
        discount_id: discountData.id,
        used: false
      })
      .select()
      .single()
    
    if (assignError) {
      return new Response(
        JSON.stringify({ error: 'Error assigning discount to customer' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        discount: discountData,
        customer_discount: newDiscount,
        message: 'Discount code applied successfully' 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    )
  }
})
