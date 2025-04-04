export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ambulance_requests: {
        Row: {
          additional_notes: string | null
          coordinates: number[] | null
          created_at: string | null
          destination: string
          id: string
          patient_condition: string | null
          patient_id: string | null
          pickup_location: string
          pickup_time: string
          status: string | null
        }
        Insert: {
          additional_notes?: string | null
          coordinates?: number[] | null
          created_at?: string | null
          destination: string
          id?: string
          patient_condition?: string | null
          patient_id?: string | null
          pickup_location: string
          pickup_time: string
          status?: string | null
        }
        Update: {
          additional_notes?: string | null
          coordinates?: number[] | null
          created_at?: string | null
          destination?: string
          id?: string
          patient_condition?: string | null
          patient_id?: string | null
          pickup_location?: string
          pickup_time?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambulance_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_initialization: {
        Row: {
          created_at: string | null
          initialized: boolean
        }
        Insert: {
          created_at?: string | null
          initialized?: boolean
        }
        Update: {
          created_at?: string | null
          initialized?: boolean
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_time: string
          created_at: string | null
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          service_id: string | null
          status: string | null
        }
        Insert: {
          appointment_time: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          service_id?: string | null
          status?: string | null
        }
        Update: {
          appointment_time?: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          service_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          accepting_new_patients: boolean | null
          address: string | null
          available_slots: string[] | null
          available_today: boolean | null
          avatar: string | null
          bio: string | null
          certifications: string[] | null
          consultation_fee: number | null
          coordinates: number[] | null
          education: string[] | null
          experience: number | null
          id: string
          insurances: string[] | null
          languages: string[] | null
          lat: number | null
          lng: number | null
          location: string | null
          name: string
          online: boolean | null
          rating: number | null
          review_count: number | null
          specialty: string
        }
        Insert: {
          accepting_new_patients?: boolean | null
          address?: string | null
          available_slots?: string[] | null
          available_today?: boolean | null
          avatar?: string | null
          bio?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          coordinates?: number[] | null
          education?: string[] | null
          experience?: number | null
          id?: string
          insurances?: string[] | null
          languages?: string[] | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name: string
          online?: boolean | null
          rating?: number | null
          review_count?: number | null
          specialty: string
        }
        Update: {
          accepting_new_patients?: boolean | null
          address?: string | null
          available_slots?: string[] | null
          available_today?: boolean | null
          avatar?: string | null
          bio?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          coordinates?: number[] | null
          education?: string[] | null
          experience?: number | null
          id?: string
          insurances?: string[] | null
          languages?: string[] | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string
          online?: boolean | null
          rating?: number | null
          review_count?: number | null
          specialty?: string
        }
        Relationships: []
      }
      medication_orders: {
        Row: {
          created_at: string | null
          delivery_address: string
          delivery_time: string | null
          id: string
          items: Json
          patient_id: string | null
          payment_method: string | null
          prescription_url: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_address: string
          delivery_time?: string | null
          id?: string
          items: Json
          patient_id?: string | null
          payment_method?: string | null
          prescription_url?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string
          delivery_time?: string | null
          id?: string
          items?: Json
          patient_id?: string | null
          payment_method?: string | null
          prescription_url?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      user_calendar_settings: {
        Row: {
          calendar_connected: boolean | null
          calendar_id: string | null
          calendar_provider: string | null
          created_at: string | null
          last_synced: string | null
          sync_enabled: boolean | null
          user_id: string
        }
        Insert: {
          calendar_connected?: boolean | null
          calendar_id?: string | null
          calendar_provider?: string | null
          created_at?: string | null
          last_synced?: string | null
          sync_enabled?: boolean | null
          user_id: string
        }
        Update: {
          calendar_connected?: boolean | null
          calendar_id?: string | null
          calendar_provider?: string | null
          created_at?: string | null
          last_synced?: string | null
          sync_enabled?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_calendar_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          dark_mode: boolean | null
          language_preference: string | null
          notification_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          dark_mode?: boolean | null
          language_preference?: string | null
          notification_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          dark_mode?: boolean | null
          language_preference?: string | null
          notification_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_guest: boolean | null
          last_name: string | null
          patient_id: string | null
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_guest?: boolean | null
          last_name?: string | null
          patient_id?: string | null
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_guest?: boolean | null
          last_name?: string | null
          patient_id?: string | null
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
