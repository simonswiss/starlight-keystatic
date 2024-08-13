import type { StarlightUserConfig } from '@astrojs/starlight/types'

import data from './sidebar.json'
type StarlightSidebar = StarlightUserConfig['sidebar']

export const sidebarData = data.sections.map((section) => {
  const transformedSection = { label: section.label }

  if (section.kind.discriminant === 'items') {
    Object.assign(transformedSection, {
      items: section.kind.value.map((item: { label: any; link: any }) => ({ label: item.label, link: item.link }))
    })
  }

  if (section.kind.discriminant === 'autogenerate') {
    Object.assign(transformedSection, { autogenerate: section.kind.value })
  }

  return transformedSection
}) as StarlightSidebar
