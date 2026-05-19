import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/crucible/admin', '/the-crucible/dashboard', '/login'],
        },
        sitemap: 'https://www.canvasclasses.in/sitemap.xml',
    };
}
