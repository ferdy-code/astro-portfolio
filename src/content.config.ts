import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    status: z.string(),
    github: z.url().optional(),
    gradient: z.string(),
    order: z.number().default(99),
  }),
});

const experience = defineCollection({
  loader: file("./src/content/experience.json"),
  schema: z.object({
    role: z.string(),
    company: z.string().optional(),
    period: z.string().optional(),
    location: z.string().optional(),
    description: z.string(),
  }),
});

const skills = defineCollection({
  loader: file("./src/content/skills.json"),
  schema: z.object({
    category: z.string(),
    icon: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        meta: z.enum(["primary", "growing"]),
        years: z.number().optional(),
      })
    ),
  }),
});

export const collections = { projects, experience, skills };
