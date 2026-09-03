import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  globalIgnores([
    '.next/**',
    'next-env.d.ts',
    'src/payload-types.ts',
    'src/payload-generated-schema.ts',
    'src/migrations/**',
    'src/app/(payload)/admin/importMap.js',
  ]),
])
