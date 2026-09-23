import { Booking } from '../types';

export interface BookingCreationResponse {
  success: boolean;
  booking?: Booking;
  message?: string;
  error?: string;
}

export async function fetchBookingsFromDatabase(params?: {
  userId?: string;
  ownerId?: string;
}): Promise<Booking[]> {
  try {
    const q = new URLSearchParams();
    if (params?.userId) q.set('userId', params.userId);
    if (params?.ownerId) q.set('ownerId', params.ownerId);

    const res = await fetch(`/api/bookings?${q.toString()}`);
    if (res.ok) {
      const data = await res.json();
      return data.bookings || [];
    }
  } catch (err) {
    console.error('Error fetching bookings from database:', err);
  }
  return [];
}

export async function createBookingInDatabase(bookingData: Partial<Booking>): Promise<BookingCreationResponse> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error saving booking to database',
    };
  }
}

export async function updateBookingStatusInDatabase(
  bookingId: string,
  status: string,
  paymentStatus?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update booking status' };
  }
}

export async function checkInQrToken(token: string): Promise<{
  success: boolean;
  booking?: Booking;
  message: string;
}> {
  try {
    const res = await fetch('/api/bookings/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'QR Verification failed' };
  }
}
