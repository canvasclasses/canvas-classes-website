import { ReactNode } from 'react';

export default function BooksAdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050505]">
        {children}
      </body>
    </html>
  );
}
