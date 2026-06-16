import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/chat.ts'],
	format: ['esm', 'cjs'],
	dts: true,
  clean: false,
	sourcemap: true,
})
