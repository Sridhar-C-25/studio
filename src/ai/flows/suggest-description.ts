'use server';

/**
 * @fileOverview Provides AI-powered suggestions for blog post meta descriptions.
 *
 * - suggestDescription - A function that suggests a meta description for a given blog post.
 * - SuggestDescriptionInput - The input type for the suggestDescription function.
 * - SuggestDescriptionOutput - The return type for the suggestDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  blogContent: z.string().describe('The content of the blog post.'),
});
export type SuggestDescriptionInput = z.infer<typeof SuggestDescriptionInputSchema>;

const SuggestDescriptionOutputSchema = z.object({
  description: z.string().describe('A suggested meta description for the blog post.'),
});
export type SuggestDescriptionOutput = z.infer<typeof SuggestDescriptionOutputSchema>;

export async function suggestDescription(input: SuggestDescriptionInput): Promise<SuggestDescriptionOutput> {
  return suggestDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDescriptionPrompt',
  input: {schema: SuggestDescriptionInputSchema},
  output: {schema: SuggestDescriptionOutputSchema},
  prompt: `You are an expert SEO copywriter. Given the following blog post title and content, generate a compelling, SEO-optimized meta description. The description should be a maximum of 160 characters.

Blog Title: {{title}}
Blog Content: {{{blogContent}}}

Meta Description:`,
});

const suggestDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestDescriptionFlow',
    inputSchema: SuggestDescriptionInputSchema,
    outputSchema: SuggestDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
