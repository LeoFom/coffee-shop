'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/features/api/profile/updateProfile';
import type { Profile } from '@/types/profile.types';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
};

const inputClassName =
  'w-full px-4 py-2 rounded-lg border border-brand-brown/20 bg-brand-bg/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-all';

export default function ProfileForm({
  profile,
  email,
}: {
  profile: Profile | null;
  email: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      phone: profile?.phone ?? '',
    },
  });

  useEffect(() => {
    reset({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      phone: profile?.phone ?? '',
    });
  }, [profile, reset]);

  const onCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
    };

    const response = await updateProfile(payload);

    if (!response.ok) {
      toast.error('Could not save profile');
      return;
    }

    const saved = await response.json();
    reset({
      firstName: saved.firstName ?? payload.firstName,
      lastName: saved.lastName ?? payload.lastName,
      phone: saved.phone ?? payload.phone ?? '',
    });
    setIsEditing(false);
    toast.success('Profile updated');
  };

  return (
    <div className="bg-white border border-brand-brown/10 rounded-2xl overflow-hidden">
      <div className="bg-card-sand px-6 py-4 border-b border-brand-brown/10 flex justify-between items-center">
        <div>
          <h2 className="font-serif font-bold text-brand-brown text-xl">Personal Information</h2>
          <p className="text-sm text-brand-muted">Manage your personal details and preferences.</p>
        </div>
        <button
          type="button"
          onClick={isEditing ? onCancel : () => setIsEditing(true)}
          className="text-sm font-medium text-brand-brown bg-brand-brown/10 hover:bg-brand-brown hover:text-white px-4 py-2 rounded-full transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form className="p-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-brand-text">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              disabled={!isEditing}
              defaultValue={profile?.firstName ?? ''}
              className={inputClassName}
              {...register('firstName', {
                required: 'First name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 100, message: 'At most 100 characters' },
              })}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-brand-text">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              disabled={!isEditing}
              defaultValue={profile?.lastName ?? ''}
              className={inputClassName}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 100, message: 'At most 100 characters' },
              })}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-brand-text">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              readOnly
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-brand-text">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              disabled={!isEditing}
              defaultValue={profile?.phone ?? ''}
              className={inputClassName}
              {...register('phone', {
                validate: (value) => {
                  const trimmed = value.trim();
                  if (!trimmed) {
                    return true;
                  }
                  if (trimmed.length < 5 || trimmed.length > 20) {
                    return 'Phone must be 5–20 characters';
                  }
                  return true;
                },
              })}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-brown text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-brown/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
