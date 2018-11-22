export interface Article {
    id?: string;
    category_name: string;
    title: string;
    tags: string;
    author_firstname: string;
    author_lastname: string;
    author_thumbnail_url?: string;
    post_date: Date;
    duration: string;
    thumbnail_url?: string;
    summary: string;
    content: string;
    image_url?: string;
}
