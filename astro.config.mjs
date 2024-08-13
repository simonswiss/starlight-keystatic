import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import starlight from '@astrojs/starlight'
import keystaticAstro from '@keystatic/astro'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'astro-auto-import'
import { defineConfig } from 'astro/config'
import { sidebarData } from './src/data/sidebar-data'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    starlight({
      title: 'Keystatic & Starlight',
      customCss: ['./src/styles/tailwind.css'],
      social: {
        github: 'https://github.com/withastro/starlight'
      },
      /*
      The server needs to be manually restarted whenever
      the sidebarData below is changed, since nothing
      on this file is changing.
       Is there a way to "watch" a specific file for
      change and trigger a server restart?
    */
      sidebar: sidebarData
    }),
    keystaticAstro(),
    react(),
    AutoImport({
      imports: [
        {
          '@astrojs/starlight/components': ['Card', 'CardGrid']
        }
      ]
    }),
    sitemap()
  ],
  output: 'hybrid'
})
