import { CinematicHomepage } from '@/components/cinematic-homepage'
import { contentRepository, requestBrand } from '@/lib/content'

export default async function HomePage() {
  const { brand } = await requestBrand()
  const plans = await contentRepository.listPlans(brand.id)
  return <CinematicHomepage plans={plans} />
}
