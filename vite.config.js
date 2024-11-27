import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'
import Compression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
			vue(),
			vuetify({ autoImport: true }),
			Compression({ algorithm: 'brotliCompress' }),
			viteImagemin({
				gifsicle: { optimizationLevel: 7 },
				optipng: { optimizationLevel: 7 },
				mozjpeg: { quality: 80 },
				svgo: { plugins: [{ name: 'removeViewBox' }] },
			}),
	],
	build: {    
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().split('node_modules/')[1].split('/')[0].toString();
						}
					},
					entryFileNames: 'assets/[name].[hash].js',
					chunkFileNames: 'assets/[name].[hash].js',
					assetFileNames: 'assets/[name].[hash].[ext]',
				}
			},
			minify: 'terser',
			terserOptions: {
					compress: {
					drop_console: true,
					drop_debugger: true, 
					},
			},
			assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif']
	}
})