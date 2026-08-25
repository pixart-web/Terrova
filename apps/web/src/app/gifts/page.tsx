import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial-page'

export const metadata: Metadata = { title: 'Gifts' }
export default function GiftsPage() {
  return (
    <EditorialPage
      eyebrow="Give a place / 04"
      title="An invitation, wrapped as wine."
      introduction="Send one edition or a season of discovery, with a note that arrives in the box."
      note="Gift purchase flows will be implemented with the future commerce provider."
    />
  )
}
