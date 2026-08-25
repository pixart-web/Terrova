import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial-page'

export const metadata: Metadata = { title: 'Boxes' }
export default function BoxesPage() {
  return (
    <EditorialPage
      eyebrow="Membership / 01"
      title="Choose a rhythm, not a routine."
      introduction="Each Terrova edition studies one place through a small constellation of bottles."
      note="Plan catalogue and subscription checkout will connect through the commerce boundary in a later release."
    />
  )
}
