import type { BlogPost, Category } from "@/types";

export const categories: Category[] = [
  { id: '1', name: 'Technology' },
  { id: '2', name: 'Health & Wellness' },
  { id: '3', name: 'Finance' },
  { id: '4', name: 'Lifestyle' },
];

export const posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    content: '<h1>The Future of AI in Web Development</h1><p>Artificial Intelligence is rapidly changing the landscape of web development. From automated coding to intelligent testing, AI tools are becoming indispensable for developers.</p><pre><code class="language-javascript">function helloAI() {\n  console.log("Hello, AI in Web Dev!");\n}</code></pre><p>We will explore the various ways AI is shaping the future and what it means for developers.</p>',
    category: 'Technology',
    createdAt: '2023-10-01',
    status: 'Published',
  },
  {
    id: '2',
    title: '10 Tips for a Healthier Lifestyle',
    content: '<h1>10 Tips for a Healthier Lifestyle</h1><p>Maintaining a healthy lifestyle is crucial for overall well-being. This post will cover ten actionable tips to help you live healthier.</p>',
    category: 'Health & Wellness',
    createdAt: '2023-10-05',
    status: 'Published',
  },
  {
    id: '3',
    title: 'Beginner\'s Guide to Investing',
    content: '<h1>Beginner\'s Guide to Investing</h1><p>Investing can be daunting for beginners. This guide will break down the basics of investing and help you get started on your financial journey.</p>',
    category: 'Finance',
    createdAt: '2023-10-10',
    status: 'Draft',
  },
  {
    id: '4',
    title: 'How to Build a Powerful Editor with Next.js',
    content: '<h1>How to Build a Powerful Editor with Next.js</h1><p>This is a sample post about building an editor.</p>',
    category: 'Technology',
    createdAt: '2023-10-15',
    status: 'Draft',
  },
];
