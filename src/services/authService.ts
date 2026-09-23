import { AuthUser, UserRole } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
  otpSent?: boolean;
  expiresInSeconds?: number;
  testOtp?: string; // provided for rapid testing when SMS gateway is in sandbox
}

const TOKEN_STORAGE_KEY = 'bms_auth_session_token';
const USER_STORAGE_KEY = 'bms_active_auth_user';

export async function sendOtpToIdentifier(
  identifier: string,
  purpose: 'login' | 'register' = 'login'
): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, purpose }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error connecting to Auth API' };
  }
}

export async function verifyOtpAndAuthenticate(
  identifier: string,
  otp: string,
  role: UserRole = 'USER',
  fullName?: string
): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp, role, fullName }),
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.user && data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to verify OTP' };
  }
}

export async function registerNewUser(payload: {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.user && data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }
    return data;
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to register user' };
  }
}

export async function fetchAuthenticatedProfile(): Promise<AuthUser | null> {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      const cached = localStorage.getItem(USER_STORAGE_KEY);
      return cached ? JSON.parse(cached) : null;
    }
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (e) {
    console.error('Error fetching auth profile:', e);
  }
  const cached = localStorage.getItem(USER_STORAGE_KEY);
  return cached ? JSON.parse(cached) : null;
}

export function logoutUserSession(): void {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
