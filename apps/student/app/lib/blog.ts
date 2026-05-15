import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export type Post = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    author: string;
    tags: string[];
    image?: string;
    content: string;
};

export function getPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    return fs.readdirSync(postsDirectory);
}

interface FrontMatterData {
    title?: string;
    date?: string;
    excerpt?: string;
    author?: string;
    tags?: string[];
    image?: string;
}

export function getPostBySlug(slug: string, fields: string[] = []): Post {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    // Check if file exists to avoid crashes
    if (!fs.existsSync(fullPath)) {
        return {
            slug: realSlug,
            title: 'Post Not Found',
            date: new Date().toISOString(),
            excerpt: '',
            author: '',
            tags: [],
            content: '# Post Not Found\n\nThe requested blog post could not be found.'
        };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const frontMatterData = data as FrontMatterData;
    const post: Post = {
        slug: realSlug,
        content: content,
        title: frontMatterData.title || 'Untitled Post',
        date: frontMatterData.date || new Date().toISOString(),
        excerpt: frontMatterData.excerpt || '',
        author: frontMatterData.author || 'Canvas Classes',
        tags: frontMatterData.tags || []
    };

    if (frontMatterData.image) {
        post.image = frontMatterData.image;
    }

    return post;
}

export function getAllPosts(): Post[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .filter(slug => slug.endsWith('.mdx'))
        .map((slug) => getPostBySlug(slug))
        // Sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}
