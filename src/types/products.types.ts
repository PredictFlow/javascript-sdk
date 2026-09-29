/**
 * Product Types for PredictFlow SDK
 */

export interface Product {
  id: string;
  store_id: string;
  external_id: string;
  sku: string;
  name: string;
  price: string;
  stock_quantity: number | null;
  stock_status: string | null;
  tracks_inventory: boolean;
  image_url?: string | null;
  abc_category?: 'A' | 'B' | 'C' | string | null;
  demand_30d?: number;
  status?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductListParams {
  store_id?: string;
  sku?: string;
  search?: string;
  category?: string;
  stock_status?: string;
  abc_category?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LowStockResponse {
  threshold: number;
  items: Product[];
}

export interface InventoryHealthResponse {
  healthy: number;
  healthy_pct: number;
  low_stock: number;
  low_stock_pct: number;
  out_of_stock: number;
  out_of_stock_pct: number;
  overstock: number;
  overstock_pct: number;
  unknown: number;
  unknown_pct: number;
  total: number;
  need_restocking: number;
  low_stock_alerts: number;
}

export interface ABCItem {
  product_id?: string | null;
  sku: string;
  product_name: string;
  units_sold: number;
  revenue: string;
  stock_quantity?: number | null;
  revenue_share_pct: number;
  cumulative_revenue_pct: number;
  category: 'A' | 'B' | 'C' | string;
}

export interface ABCAnalysisResponse {
  period_days: number;
  total_revenue: string;
  items: ABCItem[];
  summary: Record<string, number>;
}

export interface ProductCostUpdateInput {
  cogs?: number;
  shipping_cost?: number;
  other_fees?: number;
}

export interface MarginResponse {
  product_id: string;
  product_sku: string;
  price: string | number;
  cogs: number | null;
  shipping_cost: number | null;
  other_fees: number | null;
  landed_cost: number | null;
  contribution_margin: number | null;
  contribution_margin_pct: number | null;
}
