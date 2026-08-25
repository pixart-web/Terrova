import type { Metadata } from 'next'
import { EditorialPage } from '@/components/editorial-page'

export const metadata: Metadata = { title: 'Producers' }
export default function ProducersPage() {
  return (
    <EditorialPage
      eyebrow="People / 02"
      title="Growers before labels."
      introduction="Meet the people whose decisions, patience and parcels give every Terrova edition its voice."
      note="Producer portraits will be published from Payload CMS."
    />
  )
}
