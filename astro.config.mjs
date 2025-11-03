// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Main store configuration - runs on default port (4321 or 3000)
export default defineConfig({
	site: 'https://example.com',
	output: 'server',
	//ariuka tenege
	integrations: [mdx(), sitemap(), tailwind(), react()],
	server: {
		port: 3656, 
		host: true
	},
	devToolbar: {
		enabled: false
	}

});
