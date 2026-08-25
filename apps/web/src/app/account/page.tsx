import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial-page'

export const metadata: Metadata = { title: 'Account' }
export default function AccountPage() {
  return (
    <EditorialPage
      eyebrow="Your cellar / 05"
      title="Your taste, over time."
      introduction="Membership, deliveries and tasting memory will live here once customer identity is connected."
      note="No customer authentication or payment state is enabled in this foundation release."
    />
  )
}
