import type { Template } from '@rendervid/core';

export interface TemplateEntry {
  id: string;
  category: string;
  slug: string;
  template: Template;
}

export interface CategoryGroup {
  category: string;
  entries: TemplateEntry[];
}

const modules = import.meta.glob<{ default: Template }>(
  '../../../examples/**/template.json',
  { eager: true },
);

const entries: TemplateEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    // path looks like ../../../examples/getting-started/01-hello-world/template.json
    const parts = path.replace('../../../examples/', '').replace('/template.json', '').split('/');
    const category = parts[0];
    const slug = parts.slice(1).join('/') || parts[0];
    const template = mod.default ?? (mod as unknown as Template);
    const id = `${category}/${slug}`;
    return { id, category, slug, template };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

export const allTemplates: TemplateEntry[] = entries;

export const categories: CategoryGroup[] = entries.reduce<CategoryGroup[]>((acc, entry) => {
  let group = acc.find((g) => g.category === entry.category);
  if (!group) {
    group = { category: entry.category, entries: [] };
    acc.push(group);
  }
  group.entries.push(entry);
  return acc;
}, []);

export function getTemplate(id: string): TemplateEntry | undefined {
  return entries.find((e) => e.id === id);
}
