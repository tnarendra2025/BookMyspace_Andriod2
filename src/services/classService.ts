export interface InstituteClassItem {
  id: string;
  instituteId: string;
  instituteName: string;
  title: string;
  category: string;
  subject: string;
  batchTiming: string;
  deliveryMode: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  totalSeats: number;
  availableSeats: number;
  monthlyFee: number;
  facultyName: string;
  facultyBio: string;
  facultyExperience: string;
  location: string;
  isTodayOngoing: boolean;
  isUpcomingBatch: boolean;
  enrollmentOpen: boolean;
  imageUrl: string;
  rating: number;
}

export async function fetchClassesFromDatabase(category?: string): Promise<InstituteClassItem[]> {
  try {
    const q = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`/api/classes${q}`);
    if (res.ok) {
      const data = await res.json();
      return data.classes || [];
    }
  } catch (err) {
    console.error('Error fetching classes:', err);
  }
  return [];
}

export async function enrollStudentInClass(payload: {
  classId: string;
  studentName: string;
  studentPhone: string;
  isDemoTrial: boolean;
}): Promise<{
  success: boolean;
  enrollmentRef?: string;
  classDetails?: InstituteClassItem;
  message?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`/api/classes/${payload.classId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit class enrollment' };
  }
}

export async function createClassInDatabase(classData: Partial<InstituteClassItem>): Promise<{
  success: boolean;
  classItem?: InstituteClassItem;
  error?: string;
}> {
  try {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create class' };
  }
}
