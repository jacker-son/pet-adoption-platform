export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            adoption_applications: {
                Row: {
                    additional_info: string | null
                    applicant_address: string
                    applicant_city: string | null
                    applicant_id: string
                    applicant_name: string
                    applicant_phone: string
                    applicant_province: string | null
                    created_at: string | null
                    experience_details: string | null
                    has_experience: boolean | null
                    has_other_pets: boolean | null
                    id: string
                    living_situation: string | null
                    other_pets_details: string | null
                    pet_id: string
                    publisher_id: string
                    reason: string
                    review_notes: string | null
                    reviewed_at: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    additional_info?: string | null
                    applicant_address: string
                    applicant_city?: string | null
                    applicant_id: string
                    applicant_name: string
                    applicant_phone: string
                    applicant_province?: string | null
                    created_at?: string | null
                    experience_details?: string | null
                    has_experience?: boolean | null
                    has_other_pets?: boolean | null
                    id?: string
                    living_situation?: string | null
                    other_pets_details?: string | null
                    pet_id: string
                    publisher_id: string
                    reason: string
                    review_notes?: string | null
                    reviewed_at?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    additional_info?: string | null
                    applicant_address?: string
                    applicant_city?: string | null
                    applicant_id?: string
                    applicant_name?: string
                    applicant_phone?: string
                    applicant_province?: string | null
                    created_at?: string | null
                    experience_details?: string | null
                    has_experience?: boolean | null
                    has_other_pets?: boolean | null
                    id?: string
                    living_situation?: string | null
                    other_pets_details?: string | null
                    pet_id?: string
                    publisher_id?: string
                    reason?: string
                    review_notes?: string | null
                    reviewed_at?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
            }
            favorites: {
                Row: {
                    created_at: string | null
                    id: string
                    pet_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    pet_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    pet_id?: string
                    user_id?: string
                }
            }
            messages: {
                Row: {
                    application_id: string | null
                    content: string
                    created_at: string | null
                    id: string
                    read: boolean | null
                    recipient_id: string
                    sender_id: string
                    subject: string | null
                }
                Insert: {
                    application_id?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    read?: boolean | null
                    recipient_id: string
                    sender_id: string
                    subject?: string | null
                }
                Update: {
                    application_id?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    read?: boolean | null
                    recipient_id?: string
                    sender_id?: string
                    subject?: string | null
                }
            }
            pet_images: {
                Row: {
                    created_at: string | null
                    display_order: number | null
                    id: string
                    image_url: string
                    pet_id: string
                }
                Insert: {
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    image_url: string
                    pet_id: string
                }
                Update: {
                    created_at?: string | null
                    display_order?: number | null
                    id?: string
                    image_url?: string
                    pet_id?: string
                }
            }
            pets: {
                Row: {
                    adoption_requirements: string | null
                    age_months: number | null
                    age_years: number | null
                    breed: string | null
                    color: string | null
                    created_at: string | null
                    description: string | null
                    gender: string | null
                    health_status: string | null
                    id: string
                    location_city: string | null
                    location_province: string | null
                    main_image_url: string | null
                    name: string
                    publisher_id: string
                    size: string | null
                    species: string
                    status: string | null
                    sterilized: boolean | null
                    updated_at: string | null
                    vaccination_status: string | null
                }
                Insert: {
                    adoption_requirements?: string | null
                    age_months?: number | null
                    age_years?: number | null
                    breed?: string | null
                    color?: string | null
                    created_at?: string | null
                    description?: string | null
                    gender?: string | null
                    health_status?: string | null
                    id?: string
                    location_city?: string | null
                    location_province?: string | null
                    main_image_url?: string | null
                    name: string
                    publisher_id: string
                    size?: string | null
                    species: string
                    status?: string | null
                    sterilized?: boolean | null
                    updated_at?: string | null
                    vaccination_status?: string | null
                }
                Update: {
                    adoption_requirements?: string | null
                    age_months?: number | null
                    age_years?: number | null
                    breed?: string | null
                    color?: string | null
                    created_at?: string | null
                    description?: string | null
                    gender?: string | null
                    health_status?: string | null
                    id?: string
                    location_city?: string | null
                    location_province?: string | null
                    main_image_url?: string | null
                    name?: string
                    publisher_id?: string
                    size?: string | null
                    species?: string
                    status?: string | null
                    sterilized?: boolean | null
                    updated_at?: string | null
                    vaccination_status?: string | null
                }
            }
            users_profile: {
                Row: {
                    address: string | null
                    avatar_url: string | null
                    bio: string | null
                    city: string | null
                    created_at: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    province: string | null
                    role: string | null
                    updated_at: string | null
                    username: string | null
                }
                Insert: {
                    address?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    province?: string | null
                    role?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
                Update: {
                    address?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    city?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    province?: string | null
                    role?: string | null
                    updated_at?: string | null
                    username?: string | null
                }
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

// Convenience types
export type Pet = Database['public']['Tables']['pets']['Row']
export type PetInsert = Database['public']['Tables']['pets']['Insert']
export type PetUpdate = Database['public']['Tables']['pets']['Update']

export type PetImage = Database['public']['Tables']['pet_images']['Row']
export type PetImageInsert = Database['public']['Tables']['pet_images']['Insert']

export type UserProfile = Database['public']['Tables']['users_profile']['Row']
export type UserProfileInsert = Database['public']['Tables']['users_profile']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['users_profile']['Update']

export type Application = Database['public']['Tables']['adoption_applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['adoption_applications']['Insert']
export type ApplicationUpdate = Database['public']['Tables']['adoption_applications']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

// Extended types with relations
export type PetWithImages = Pet & {
    pet_images?: PetImage[]
    publisher?: UserProfile
}

export type ApplicationWithDetails = Application & {
    pet?: Pet
    applicant?: UserProfile
    publisher?: UserProfile
}
