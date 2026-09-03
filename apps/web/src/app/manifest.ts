import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Terrova',
    short_name: 'Terrova',
    description: 'Discover wine beyond the label.',
    start_url: '/',
    display: 'standalone',
    background_color: '#171714',
    theme_color: '#171714',
  }
}
