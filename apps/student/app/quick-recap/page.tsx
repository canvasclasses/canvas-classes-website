import { redirect } from 'next/navigation';

// Redirect old URL to new SEO-optimized URL
export default function QuickRecapPage() {
    redirect('/one-shot-lectures');
}
