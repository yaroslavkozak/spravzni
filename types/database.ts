/**
 * Database Type Definitions
 * TypeScript types for D1 database tables
 */

export interface Text {
  id: number;
  key: string;
  language: string;
  value: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: number;
  key: string;
  type: 'image' | 'video';
  r2_key: string;
  r2_bucket: string;
  mime_type?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  description?: string | null;
  metadata?: string | null; // JSON string
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTextInput {
  key: string;
  language?: string;
  value: string;
  description?: string;
}

export interface UpdateTextInput {
  value?: string;
  description?: string;
}

export interface CreateMediaInput {
  key: string;
  type: 'image' | 'video';
  r2_key: string;
  r2_bucket?: string;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  is_public?: boolean;
}

export interface UpdateMediaInput {
  r2_key?: string;
  mime_type?: string;
  size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  is_public?: boolean;
}

export interface MediaMetadata {
  [key: string]: unknown;
}


export interface Service {
  id: number;
  display_order: number;
  heading_uk: string;
  heading_en?: string | null;
  paragraphs_uk: string; // JSON array
  paragraphs_en?: string | null; // JSON array
  primary_button_text_uk: string;
  primary_button_text_en?: string | null;
  secondary_button_text_uk: string;
  secondary_button_text_en?: string | null;
  primary_action: 'vacationOptions' | 'none';
  secondary_action: 'contact' | 'none';
  image_key?: string | null;
  overlay_text_uk?: string | null;
  overlay_text_en?: string | null;
  show_primary_button: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceOption {
  id: number;
  service_id: number;
  display_order: number;
  title_uk: string;
  title_en?: string | null;
  description_uk: string;
  description_en?: string | null;
  image_path: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceInput {
  display_order?: number;
  heading_uk: string;
  heading_en?: string;
  paragraphs_uk: string[]; // Will be converted to JSON
  paragraphs_en?: string[];
  primary_button_text_uk: string;
  primary_button_text_en?: string;
  secondary_button_text_uk: string;
  secondary_button_text_en?: string;
  primary_action?: 'vacationOptions' | 'none';
  secondary_action?: 'contact' | 'none';
  image_key?: string;
  overlay_text_uk?: string;
  overlay_text_en?: string;
  show_primary_button?: boolean;
  is_active?: boolean;
}

export interface UpdateServiceInput {
  display_order?: number;
  heading_uk?: string;
  heading_en?: string;
  paragraphs_uk?: string[];
  paragraphs_en?: string[];
  primary_button_text_uk?: string;
  primary_button_text_en?: string;
  secondary_button_text_uk?: string;
  secondary_button_text_en?: string;
  primary_action?: 'vacationOptions' | 'none';
  secondary_action?: 'contact' | 'none';
  image_key?: string | null;
  overlay_text_uk?: string | null;
  overlay_text_en?: string | null;
  show_primary_button?: boolean;
  is_active?: boolean;
}

export interface CreateServiceOptionInput {
  service_id: number;
  display_order?: number;
  title_uk: string;
  title_en?: string;
  description_uk: string;
  description_en?: string;
  image_path: string;
  is_active?: boolean;
}

export interface UpdateServiceOptionInput {
  service_id?: number;
  display_order?: number;
  title_uk?: string;
  title_en?: string;
  description_uk?: string;
  description_en?: string;
  image_path?: string;
  is_active?: boolean;
}

export interface ReportItem {
  id: number;
  period: string;
  amount: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReportItemInput {
  period: string;
  amount: string;
  category: string;
}

export interface UpdateReportItemInput {
  period?: string;
  amount?: string;
  category?: string;
}

export interface ReportSettings {
  id: number;
  updated_date: string | null;
  incoming_amount: string | null;
  outgoing_amount: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateReportSettingsInput {
  updated_date?: string | null;
  incoming_amount?: string | null;
  outgoing_amount?: string | null;
}
