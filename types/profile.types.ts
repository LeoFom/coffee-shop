export type Profile = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  phone?: string;
};
