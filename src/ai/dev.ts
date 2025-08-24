import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-title-variants.ts';
import '@/ai/flows/evaluate-blog-effectiveness.ts';
import '@/ai/flows/suggest-related-keywords.ts';
import '@/ai/flows/suggest-description.ts';
