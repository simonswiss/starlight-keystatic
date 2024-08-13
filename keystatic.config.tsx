import { collection, config, fields, singleton } from '@keystatic/core'
import { repeating, wrapper } from '@keystatic/core/content-components'

import type { docsSchema } from '@astrojs/starlight/schema'
import type { z } from 'zod'

// Dodgy but works...
import { Icons } from 'node_modules/@astrojs/starlight/components/Icons'

const iconsList = Object.keys(Icons).map((icon) => ({
  label: icon,
  value: icon
}))

type StarlightSchema = z.input<ReturnType<ReturnType<typeof docsSchema>>>

type Hero = StarlightSchema['hero']

export default config({
  storage: {
    kind: 'local'
  },
  ui: {
    brand: {
      name: 'Starlight'
    }
  },
  collections: {
    docs: collection({
      label: 'Docs',
      path: 'src/content/docs/**',
      slugField: 'title',
      format: {
        contentField: 'content'
      },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        template: fields.select({
          label: 'Template',
          options: [
            { label: 'Doc', value: 'doc' },
            { label: 'Splash', value: 'splash' }
          ],
          defaultValue: 'doc'
        }),
        hero: fields.object(
          {
            title: fields.text({ label: 'Title' }),
            tagline: fields.text({ label: 'Tagline' }),
            image: fields.object({
              file: fields.image({
                label: 'Image',
                directory: 'src/assets',
                publicPath: '@assets'
              })
            }),
            actions: fields.array(
              fields.object({
                text: fields.text({ label: 'Text' }),
                link: fields.text({ label: 'Link' }),
                icon: fields.select({
                  label: 'Icon',
                  options: iconsList,
                  defaultValue: iconsList[0].value
                }),
                variant: fields.select({
                  label: 'Variant',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Minimal', value: 'minimal' }
                  ],
                  defaultValue: 'minimal'
                })
              }),
              {
                label: 'Actions',
                itemLabel: (data) => data.fields.text.value
              }
            )
          },
          { label: 'Hero' }
        ),
        content: fields.markdoc({
          label: 'Content',
          components: {
            CardGrid: repeating({
              label: 'Card Grid',
              children: ['Card'],
              schema: {
                stagger: fields.checkbox({
                  label: 'Stagger',
                  description: 'Check to stagger the cards'
                })
              }
            }),
            Card: wrapper({
              label: 'Card',
              schema: {
                title: fields.text({ label: 'Title' }),
                icon: fields.select({
                  label: 'Icon',
                  options: iconsList,
                  defaultValue: iconsList[0].value
                })
              }
            })
          }
        })
      }
    })
  },
  singletons: {
    sidebar: singleton({
      label: 'Sidebar',
      path: 'src/data/sidebar',
      format: {
        data: 'json'
      },
      schema: {
        sections: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            kind: fields.conditional(
              fields.select({
                label: 'Kind',
                options: [
                  { label: 'Items', value: 'items' },
                  { label: 'Autogenerate', value: 'autogenerate' }
                ],
                defaultValue: 'items'
              }),
              {
                items: fields.array(
                  fields.object({
                    label: fields.text({ label: 'Label' }),
                    link: fields.text({ label: 'Link' })
                  }),
                  {
                    label: 'Items',
                    itemLabel: (data) => data.fields.label.value
                  }
                ),
                autogenerate: fields.object({
                  directory: fields.text({ label: 'Directory' })
                })
              }
            )
          }),
          { label: 'Links', itemLabel: (data) => data.fields.label.value }
        )
      }
    })
  }
})
