export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Angular and Spartan UI',
    slug: 'getting-started-angular-spartan-ui',
    excerpt: 'Learn how to set up a modern Angular project with Spartan UI, the shadcn/ui-inspired component library for Angular.',
    content: `
      <p>Spartan UI brings the popular shadcn/ui approach to Angular. Instead of installing a traditional component library, you get unstyled, accessible primitives that you style with Tailwind CSS.</p>
      <h2>Why Spartan UI?</h2>
      <p>Traditional component libraries come with opinionated styles that are hard to customize. Spartan UI takes a different approach — it provides headless components (called "brain") that handle all the accessibility and behavior, while you control the styling through Tailwind CSS classes (called "helm").</p>
      <h2>Setting Up</h2>
      <p>First, create a new Angular project and install the required packages. You'll need <code>@spartan-ng/brain</code> for the headless primitives and Tailwind CSS for styling.</p>
      <p>The beauty of this approach is that every component is fully customizable. You own the code, you own the styles, and you can modify anything without fighting against a library's design decisions.</p>
    `,
    author: 'Coder Secret',
    date: '2026-04-01',
    readTime: '5 min read',
    tags: ['Angular', 'Spartan UI', 'Tutorial'],
    coverImage: '',
  },
  {
    id: '2',
    title: 'Tailwind CSS v4: What\'s New for Angular Developers',
    slug: 'tailwind-css-v4-angular',
    excerpt: 'Explore the latest features in Tailwind CSS v4 and how they improve the Angular development experience.',
    content: `
      <p>Tailwind CSS v4 introduces a brand-new engine built from the ground up with performance and developer experience in mind.</p>
      <h2>CSS-First Configuration</h2>
      <p>Gone is the <code>tailwind.config.js</code> file. In v4, everything is configured directly in CSS using <code>@theme</code> directives. This means faster builds and a more intuitive setup.</p>
      <h2>Automatic Content Detection</h2>
      <p>Tailwind v4 automatically detects your content files — no more configuring content paths manually. It just works.</p>
      <h2>New @theme Directive</h2>
      <p>The new <code>@theme</code> directive replaces the old config file approach, allowing you to define your design tokens right in CSS where they belong.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-28',
    readTime: '4 min read',
    tags: ['Tailwind CSS', 'Angular', 'CSS'],
    coverImage: '',
  },
  {
    id: '3',
    title: 'Building Accessible Components in Angular',
    slug: 'accessible-components-angular',
    excerpt: 'A deep dive into creating fully accessible UI components using Angular and the WAI-ARIA specification.',
    content: `
      <p>Web accessibility is not optional — it's a fundamental requirement for building inclusive web applications. In this post, we'll explore how to build accessible components in Angular.</p>
      <h2>Understanding ARIA</h2>
      <p>WAI-ARIA (Web Accessibility Initiative – Accessible Rich Internet Applications) provides attributes that define ways to make web content more accessible to people with disabilities.</p>
      <h2>Keyboard Navigation</h2>
      <p>Every interactive element must be keyboard accessible. This means proper focus management, keyboard shortcuts, and logical tab order throughout your application.</p>
      <h2>Using Spartan Brain</h2>
      <p>Spartan UI's brain primitives handle accessibility out of the box. They manage ARIA attributes, keyboard interactions, and focus trapping so you don't have to implement these patterns manually.</p>
    `,
    author: 'Coder Secret',
    date: '2026-03-25',
    readTime: '6 min read',
    tags: ['Accessibility', 'Angular', 'Best Practices'],
    coverImage: '',
  },
];
