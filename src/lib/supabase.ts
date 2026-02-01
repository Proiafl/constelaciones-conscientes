import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Some features may not work.');
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// Types for database tables
export interface Service {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    calendly_url: string | null;
    active: boolean;
    created_at: string;
}

export interface Payment {
    id: string;
    created_at: string;
    updated_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    service_type: 'individual' | 'taller' | 'presencial';
    service_name: string;
    amount: number;
    currency: string;
    mp_preference_id: string | null;
    mp_payment_id: string | null;
    mp_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_process' | 'refunded';
    mp_status_detail: string | null;
    mp_payment_method: string | null;
    calendly_event_url: string | null;
    booking_date: string | null;
    booking_confirmed: boolean;
    metadata: Record<string, unknown>;
}
