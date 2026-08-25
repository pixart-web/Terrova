import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial-page'

export const metadata: Metadata = { title: 'Journal' }
export default function JournalPage() {
  return (
    <EditorialPage
      eyebrow="Field notes / 03"
      title="Stories with soil under their nails."
      introduction="Dispatches from cellars, coastlines and tables — edited to deepen the pleasure of the bottle."
      note="The journal content model will expand after the initial collection foundation."
    />
  )
}
