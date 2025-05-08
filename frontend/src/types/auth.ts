export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    gardening_zone: string | null;
    zipcode: string | null;
    latitude: number | null;
    longitude: number | null;
    last_frost_date: string | null;
    first_frost_date: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    username: string;
    full_name: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
} 