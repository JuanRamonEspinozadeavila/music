export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  link: string;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      "https://conexionrock.com/wp-json/wp/v2/posts?_embed&per_page=5",
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error("Error loading news");
    }

    const posts = await response.json();

    return posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered || "",
      excerpt:
        post.excerpt?.rendered
          ?.replace(/<[^>]*>/g, "")
          ?.substring(0, 120) + "...",
      image:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/logo_radio.png",
      date: post.date,
      link: post.link,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}