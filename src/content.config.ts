import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    region: z.string(),
    character: z.string(),
    industries: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

export const collections = { locations };
