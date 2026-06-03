"use client";

interface EventItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}

interface Props {
  events: EventItem[];
}

export function EventFeed({ events }: Props) {
  if (!events.length) return null;

  return (
    <div className="conexionrock-news-grid">
      {events.slice(0, 5).map((item) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="conexionrock-news-card"
        >
          <img
            src={item.image}
            alt={item.title}
            className="conexionrock-news-image"
          />

          <div className="conexionrock-news-content">
            <h3>{item.title}</h3>

            <p>{item.excerpt}</p>
          </div>
        </a>
      ))}
    </div>
  );
}