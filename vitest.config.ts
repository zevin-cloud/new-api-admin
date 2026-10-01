import { defineConfig } from 'vitest/config'
import path from 'node:path'
const ui=path.resolve('packages/admin-ui/src')
export default defineConfig({resolve:{alias:[{find:'@ui',replacement:ui},{find:'new-api-admin-ui/data-table',replacement:ui+'/components/data-table/index.ts'},{find:'new-api-admin-ui/form',replacement:ui+'/components/ui/form.tsx'},{find:'new-api-admin-ui/utils',replacement:ui+'/utils.ts'},{find:/^new-api-admin-ui\/ui\/(.*)/,replacement:ui+'/components/ui/$1'},{find:'new-api-admin-ui',replacement:ui+'/index.ts'}]},test:{environment:'jsdom',setupFiles:['scripts/test-setup.ts'],include:['packages/*/src/**/__tests__/*.test.{ts,tsx}','apps/*/src/**/__tests__/*.test.{ts,tsx}'],testTimeout:20000,clearMocks:true,restoreMocks:true}})
