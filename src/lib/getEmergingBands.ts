export interface EmergingBand {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

export async function getEmergingBands(): Promise<EmergingBand[]> {
  try {
    const response = await fetch(
      "https://conexionrock.com/wp-json/wp/v2/posts?categories=3&_embed&per_page=5",
      {
        next: { revalidate: 1800 },
      }
    );

    const posts = await response.json();

    return posts.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt:
        post.excerpt?.rendered
          ?.replace(/<[^>]*>/g, "")
          ?.trim() || "",
      link: post.link,
      image:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/logo_radio.png",
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}