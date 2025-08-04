'use server';

/**
 * @fileOverview AI flow to suggest related keywords for a given blog content.
 *
 * - suggestRelatedKeywords - Function to generate related keywords based on blog content.
 * - SuggestRelatedKeywordsInput - Input type for the suggestRelatedKeywords function.
 * - SuggestRelatedKeywordsOutput - Output type for the suggestRelatedKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedKeywordsInputSchema = z.object({
  blogContent: z
    .string()
    .describe('The main content of the blog post for keyword analysis.'),
});
export type SuggestRelatedKeywordsInput = z.infer<typeof SuggestRelatedKeywordsInputSchema>;

const SuggestRelatedKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('An array of keywords related to the provided blog content.'),
});
export type SuggestRelatedKeywordsOutput = z.infer<typeof SuggestRelatedKeywordsOutputSchema>;

export async function suggestRelatedKeywords(
  input: SuggestRelatedKeywordsInput
): Promise<SuggestRelatedKeywordsOutput> {
  return suggestRelatedKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedKeywordsPrompt',
  input: {schema: SuggestRelatedKeywordsInputSchema},
  output: {schema: SuggestRelatedKeywordsOutputSchema},
  prompt: `You are an SEO expert. Based on the content of the blog post provided, suggest a list of keywords that are highly related to the content. These keywords should help improve the search engine optimization of the blog post.

Blog Content: {{{blogContent}}}

Keywords:`,
});

const suggestRelatedKeywordsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedKeywordsFlow',
    inputSchema: SuggestRelatedKeywordsInputSchema,
    outputSchema: SuggestRelatedKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
