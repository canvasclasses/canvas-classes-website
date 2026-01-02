# Canvas Classes Website Remodel

This project is a modern, responsive redesign of the Canvas Classes educational platform, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
app/
├── components/         # Reusable UI components (Navbar, Sections, etc.)
├── lectures/           # Detailed Video Lectures page
├── quick-recap/        # Quick Recap videos module
├── top-50-concepts/    # Top 50 Concepts module with PDF viewer
├── 2-minute-chemistry/ # Short-form video module
├── ncert-solutions/    # NCERT Solutions main & detail pages
├── lib/                # Data fetching utilities and types
└── api/                # API Routes for handling data requests
```

## 🛠️ Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## ✨ Key Features

-   **Dynamic Content**: All video and question data is fetched from structured data files (CSVs) or internal APIs.
-   **Dark Mode UI**: Consistent premium dark theme across all new modules.
-   **Interactive Elements**: Hover effects, animated counters, and smooth page transitions.
-   **NCERT Integration**: Full solution viewing with support for image rendering and video links.
