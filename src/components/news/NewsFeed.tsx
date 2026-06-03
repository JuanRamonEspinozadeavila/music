"use client";

import { NewsItem } from "@/lib/getNews";

interface Props {
  news: NewsItem[];
}

export function NewsFeed({ news }: Props) {
  if (!news.length) return null;

  return (
    <section className="uk-margin-large-top">
      <div className="conexionrock-section-heading">
        <div>
          <p className="conexionrock-eyebrow uk-margin-remove">
            DESTACADO EN CONEXIÓN ROCK
          </p>

          <h2 className="conexionrock-section-title uk-margin-remove">
          Noticias y cobertura
          </h2>
        </div>
      </div>

      <div className="conexionrock-news-grid">
        {news.map((item) => (
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
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}