import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

const blog = defineCollection({
  name: 'blog',
  directory: 'content/blog',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    content: z.string(),
    image: z.string().optional(),
    author: z.string(),
    avatar: z.string().optional(),
  }),
});

const pages = defineCollection({
  name: 'pages',
  directory: 'content/pages',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    content: z.string(),
  }),
});

export default defineConfig({
  collections: [blog, pages],
});
