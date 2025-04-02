
export type Tables = {
  carbon_logs: {
    id: string;
    user_id: string;
    category: string;
    activity: string;
    quantity: number;
    unit: string;
    carbon_impact: number;
    log_date: string;
    created_at: string;
  };
  profiles: {
    id: string;
    name: string | null;
    created_at: string;
  };
}
