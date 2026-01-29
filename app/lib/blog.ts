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

    const post: any = {};

    // Ensure minimal required fields
    post.slug = realSlug;
    post.content = content;
    post.title = data.title || 'Untitled Post';
    post.date = data.date || new Date().toISOString();
    post.excerpt = data.excerpt || '';
    post.author = data.author || 'Canvas Classes';
    post.tags = data.tags || [];
    if (data.image) post.image = data.image;

    return post as Post;
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
