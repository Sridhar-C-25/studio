'use server';

/**
 * @fileOverview Evaluates the effectiveness of a blog post based on a preview.
 *
 * - evaluateBlogEffectiveness - A function that handles the blog post evaluation process.
 * - EvaluateBlogEffectivenessInput - The input type for the evaluateBlogEffectiveness function.
 * - EvaluateBlogEffectivenessOutput - The return type for the evaluateBlogEffectiveness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateBlogEffectivenessInputSchema = z.object({
  blogContent: z
    .string()
    .describe('The complete HTML content of the blog post to evaluate.'),
});
export type EvaluateBlogEffectivenessInput = z.infer<
  typeof EvaluateBlogEffectivenessInputSchema
>;

const EvaluateBlogEffectivenessOutputSchema = z.object({
  seoScore: z
    .number()
    .describe(
      'A score from 0 to 100 representing the SEO effectiveness of the blog post.'
    ),
  suggestions: z
    .array(z.string())
    .describe(
      'A list of suggestions to improve the SEO and impact of the blog post.'
    ),
  overallAssessment: z
    .string()
    .describe('An overall assessment of the blog posts effectiveness.'),
});
export type EvaluateBlogEffectivenessOutput = z.infer<
  typeof EvaluateBlogEffectivenessOutputSchema
>;

export async function evaluateBlogEffectiveness(
  input: EvaluateBlogEffectivenessInput
): Promise<EvaluateBlogEffectivenessOutput> {
  return evaluateBlogEffectivenessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateBlogEffectivenessPrompt',
  input: {schema: EvaluateBlogEffectivenessInputSchema},
  output: {schema: EvaluateBlogEffectivenessOutputSchema},
  prompt: `You are an expert SEO consultant.

You will evaluate the effectiveness of a blog post based on its content.

Analyze the provided HTML content for SEO best practices, readability, and overall impact.

Provide an SEO score from 0 to 100, a list of specific suggestions for improvement, and an overall assessment of the blog post's effectiveness.

Blog Content:

{{{blogContent}}}

Ensure that the suggestions are actionable and directly related to improving the blog post's performance.
`,
});

const evaluateBlogEffectivenessFlow = ai.defineFlow(
  {
    name: 'evaluateBlogEffectivenessFlow',
    inputSchema: EvaluateBlogEffectivenessInputSchema,
    outputSchema: EvaluateBlogEffectivenessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
