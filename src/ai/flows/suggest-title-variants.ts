'use server';

/**
 * @fileOverview Provides AI-powered suggestions for blog post title variants.
 *
 * - suggestTitleVariants - A function that suggests alternative titles for a given blog post.
 * - SuggestTitleVariantsInput - The input type for the suggestTitleVariants function.
 * - SuggestTitleVariantsOutput - The return type for the suggestTitleVariants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTitleVariantsInputSchema = z.object({
  blogContent: z.string().describe('The content of the blog post.'),
  numVariants: z.number().default(3).describe('The number of title variants to generate.'),
});
export type SuggestTitleVariantsInput = z.infer<typeof SuggestTitleVariantsInputSchema>;

const SuggestTitleVariantsOutputSchema = z.object({
  titleVariants: z.array(z.string()).describe('An array of suggested title variants.'),
});
export type SuggestTitleVariantsOutput = z.infer<typeof SuggestTitleVariantsOutputSchema>;

export async function suggestTitleVariants(input: SuggestTitleVariantsInput): Promise<SuggestTitleVariantsOutput> {
  return suggestTitleVariantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTitleVariantsPrompt',
  input: {schema: SuggestTitleVariantsInputSchema},
  output: {schema: SuggestTitleVariantsOutputSchema},
  prompt: `You are an expert blog title generator. Given the following blog content, generate {{numVariants}} alternative titles that are compelling and SEO-optimized.\n\nBlog Content: {{{blogContent}}}\n\nTitle Variants:`,
});

const suggestTitleVariantsFlow = ai.defineFlow(
  {
    name: 'suggestTitleVariantsFlow',
    inputSchema: SuggestTitleVariantsInputSchema,
    outputSchema: SuggestTitleVariantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
