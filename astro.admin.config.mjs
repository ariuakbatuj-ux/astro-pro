// @ts-check
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// Admin panel configuration - runs on different port
export default defineConfig({
	site: 'http://localhost:4321',
	output: 'server',
	integrations: [mdx(), tailwind(), react()],
	server: {
		port: 4321, // Admin runs on port 4321
		host: true
	},
	devToolbar: {
		enabled: false
	},
	// Admin-only pages
	vite: {
		server: {
			watch: {
				ignored: ['**/public/**']
			}
		}
	}
});
