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
      brain_dumps: {
        Row: {
          ai_result: Json | null
          content: string
          created_at: string | null
          entry_type: string
          id: string
          processed: boolean | null
          timestamp: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_result?: Json | null
          content: string
          created_at?: string | null
          entry_type: string
          id: string
          processed?: boolean | null
          timestamp: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_result?: Json | null
          content?: string
          created_at?: string | null
          entry_type?: string
          id?: string
          processed?: boolean | null
          timestamp?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brain_dumps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          created_at: string | null
          current_task: string | null
          host_id: string
          id: string
          is_active: boolean | null
          mood: string | null
          session_link_uuid: string
          timer_state: Json | null
          updated_at: string | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_task?: string | null
          host_id: string
          id?: string
          is_active?: boolean | null
          mood?: string | null
          session_link_uuid?: string
          timer_state?: Json | null
          updated_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_task?: string | null
          host_id?: string
          id?: string
          is_active?: boolean | null
          mood?: string | null
          session_link_uuid?: string
          timer_state?: Json | null
          updated_at?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string | null
          energy_level: number
          focus_level: number
          id: string
          mood_score: number
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level: number
          focus_level: number
          id?: string
          mood_score: number
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number
          focus_level?: number
          id?: string
          mood_score?: number
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          neurodivergent_type:
            | Database["public"]["Enums"]["neurodivergent_type"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          neurodivergent_type?:
            | Database["public"]["Enums"]["neurodivergent_type"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          neurodivergent_type?:
            | Database["public"]["Enums"]["neurodivergent_type"]
            | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_dismissed: boolean | null
          original_reminder_id: string | null
          remind_at: string
          snooze_duration_minutes: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_dismissed?: boolean | null
          original_reminder_id?: string | null
          remind_at: string
          snooze_duration_minutes?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_dismissed?: boolean | null
          original_reminder_id?: string | null
          remind_at?: string
          snooze_duration_minutes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_original_reminder_id_fkey"
            columns: ["original_reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_mappings: {
        Row: {
          created_at: string | null
          external_id: string
          id: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_synced_at: string | null
          mindmesh_task_id: string | null
          sync_direction: Database["public"]["Enums"]["sync_direction"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          external_id: string
          id?: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          last_synced_at?: string | null
          mindmesh_task_id?: string | null
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          external_id?: string
          id?: string
          integration_type?: Database["public"]["Enums"]["integration_type"]
          last_synced_at?: string | null
          mindmesh_task_id?: string | null
          sync_direction?: Database["public"]["Enums"]["sync_direction"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_mappings_mindmesh_task_id_fkey"
            columns: ["mindmesh_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_mappings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          complexity: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          task_order: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          complexity?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          task_order?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          complexity?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          task_order?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          integration_data: Json | null
          integration_type: Database["public"]["Enums"]["integration_type"]
          is_active: boolean | null
          last_sync_at: string | null
          refresh_token: string | null
          sync_rules: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_data?: Json | null
          integration_type: Database["public"]["Enums"]["integration_type"]
          is_active?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_rules?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          integration_data?: Json | null
          integration_type?: Database["public"]["Enums"]["integration_type"]
          is_active?: boolean | null
          last_sync_at?: string | null
          refresh_token?: string | null
          sync_rules?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      integration_type: "google_calendar"
      neurodivergent_type: "none" | "adhd" | "autism" | "anxiety" | "multiple"
      sync_direction: "import" | "export" | "bidirectional"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      integration_type: ["google_calendar"],
      neurodivergent_type: ["none", "adhd", "autism", "anxiety", "multiple"],
      sync_direction: ["import", "export", "bidirectional"],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
