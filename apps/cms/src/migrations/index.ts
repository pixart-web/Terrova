import * as migration_20260902_134239_initial_release_candidate from './20260902_134239_initial_release_candidate'
import * as migration_20260914_120000_portuguese_regions_grapes from './20260914_120000_portuguese_regions_grapes'

export const migrations = [
  {
    up: migration_20260902_134239_initial_release_candidate.up,
    down: migration_20260902_134239_initial_release_candidate.down,
    name: '20260902_134239_initial_release_candidate',
  },
  {
    up: migration_20260914_120000_portuguese_regions_grapes.up,
    down: migration_20260914_120000_portuguese_regions_grapes.down,
    name: '20260914_120000_portuguese_regions_grapes',
  },
]
