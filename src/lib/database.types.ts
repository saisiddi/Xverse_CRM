// Generated types will go here after running supabase gen types
// Run: npm run db:generate

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          lead_name: string;
          company: string | null;
          email: string | null;
          phone: string | null;
          source: string | null;
          setter_name: string | null;
          closer_name: string | null;
          status: string;
          date_created: string;
          first_contact_date: string | null;
          date_meeting_booked: string | null;
          date_of_meeting: string | null;
          last_touch_date: string | null;
          date_paid_in_full: string | null;
          meeting_status: string | null;
          offer_made: boolean;
          call_type: string | null;
          loss_reason: string | null;
          deposit_amount: number;
          total_deal_value: number;
          cash_collected: number;
          refund_clawback_amount: number;
          commission_pct: number;
          earnings: number;
          aging_flag: boolean;
          booking_lag_flag: boolean;
          deposit_unpaid_flag: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'earnings' | 'aging_flag' | 'booking_lag_flag' | 'deposit_unpaid_flag' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']> & { id: string };
      };
      setter_activities: {
        Row: {
          id: string;
          setter_name: string;
          activity_date: string;
          dials_dms: number;
          conversations: number;
          calls_scheduled: number;
          calls_taken: number;
          declines: number;
          cancels: number;
          no_shows: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['setter_activities']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['setter_activities']['Insert']> & { id: string };
      };
      revenue_goals: {
        Row: {
          id: string;
          month: string;
          revenue_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['revenue_goals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['revenue_goals']['Insert']> & { id: string };
      };
    };
  };
}