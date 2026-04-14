const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface Comment {
  id: number;
  complaintId: number;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id?: number;
  title: string;
  description: string;
  category: string;
  location: string;
  mediaUrl: string;
  status: 'submitted' | 'in-progress' | 'resolved';
  upvotes: number;
  commentCount: number;
  createdAt: string;
}

export const fetchRecentComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch(`${API_BASE}/complaints`);
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return await response.json();
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
};

export const upvoteComplaint = async (id: number): Promise<{ upvotes: number }> => {
  const response = await fetch(`${API_BASE}/complaints/${id}/upvote`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to upvote');
  return await response.json();
};

export const fetchComments = async (id: number): Promise<Comment[]> => {
  const response = await fetch(`${API_BASE}/complaints/${id}/comments`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return await response.json();
};

export const addComment = async (id: number, text: string): Promise<Comment> => {
  const response = await fetch(`${API_BASE}/complaints/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
};

export const saveComplaint = async (formData: FormData) => {
  const response = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    // FastAPI returns errors in 'detail' field
    throw new Error(errorData.detail || errorData.error || 'Failed to submit report');
  }

  return await response.json();
};
