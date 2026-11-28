import MembershipCard from '@/components/membership/MembershipCard'
import { Metadata } from 'next'
import { requireUser } from '@/lib/auth/requireUser'

export const metadata: Metadata = {
  title: 'Membership & Rewards | Coffeo',
  description: 'View your Coffeo membership status and QR code',
}

export default async function MembershipPage() {
  await requireUser('/membership')
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-brown mb-2">Membership Rewards</h1>
        <p className="text-brand-muted">
          Use your digital pass in-store to collect stamps and get discounts.
        </p>
      </div>

      <MembershipCard />
    </div>
  )
}
