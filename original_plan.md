ACT AS: Senior Frontend Architect & Creative Developer. GOAL: Build "Kobie's Blog" using Vite + React.

1. TECHNICAL CONSTRAINTS (STRICT)
Stack: React (Vite) + TypeScript.

Styling: Tailwind CSS + clsx + tailwind-merge.

Animations: framer-motion is REQUIRED.

Icons: lucide-react (if needed).

Data Strategy: The app must use a strict mockPosts structure that mirrors the WordPress REST API response schema (so I can swap it for a fetch() call later).

2. DESIGN SYSTEM: "THE DIGITAL JOURNAL"
Aesthetic: "Paperly-Art-Textured." Tactile, analog, and organic.

Color Palette (Add these to Tailwind Config):

paper: #F2F0E9 (Warm, grainy off-white/beige).

ink: #232323 (Soft black, like printed text).

olive-green: #5F6F52 (Rich, organic earthy green).

border-color: #D1D1C7 (Subtle stone color).

Typography:

Headings: Playfair Display (Serif).

Body: Inter (Sans-Serif).

Metadata: Courier Prime (Mono) for that typewriter feel.

Implementation: Since this is Vite, please provide the <link> tags to put in index.html to load these fonts from Google Fonts.

Visual Textures:

Noise: Create a reusable class or global style for a static noise overlay.

Borders: Thin, precise 1px borders.

3. DATA STRUCTURE (WORDPRESS MIRROR)
The mock data MUST use this structure:

TypeScript

{
  id: number;
  date: string; // ISO 8601
  title: { rendered: string }; // HTML string
  excerpt: { rendered: string }; // HTML string
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}
4. REQUIRED DELIVERABLES (FILE BY FILE)
File 1: tailwind.config.js

configure the custom colors (paper, olive-green, etc.) and fonts.

File 2: src/lib/utils.ts

cn(...) helper.

formatDate(dateString) helper.

getFeaturedImage(post) helper.

File 3: src/App.tsx

Hero Section:

H1: "Kobie's Blog" (Text-7xl Serif, text-ink).

Sub: "A digital archive." (Mono font, text-olive-green).

Use framer-motion for a staggered reveal.

Grid Section:

Map through mockPosts.

Render a BlogCard for each.

File 4: src/components/BlogCard.tsx

Design:

Border: 1px solid border-color.

Hover: Image turns from grayscale to color, or card lifts slightly.

Typography: Date in Mono (text-olive-green), Title in Serif.

Important: Use dangerouslySetInnerHTML for content.

File 5: index.css

Add the global @apply bg-paper text-ink;

Add the CSS for the noise texture overlay.

EXECUTION: Write the code for these files. Ensure the "Paper" aesthetic is achieved via CSS.