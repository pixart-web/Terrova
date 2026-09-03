import * as migration_20260902_134239_initial_release_candidate from './20260902_134239_initial_release_candidate'

export const migrations = [
  {
    up: migration_20260902_134239_initial_release_candidate.up,
    down: migration_20260902_134239_initial_release_candidate.down,
    name: '20260902_134239_initial_release_candidate',
  },
]
