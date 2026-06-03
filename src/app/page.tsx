"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";
import { SongGrid } from "@/components/playlist/SongGrid";
import { usePlayerStore } from "@/store/playerStore";
import { getWeeklyFeatured } from "@/lib/getWeeklyFeatured";
import { Song } from "@/types/song";
import { getNews, NewsItem } from "@/lib/getNews";
import { NewsFeed } from "@/components/news/NewsFeed";
import { getEvents } from "@/lib/getEvents";
import { EventFeed } from "@/components/events/EventFeed";
import {
  getEmergingBands,
  EmergingBand,
} from "@/lib/getEmergingBands";

export default function HomePage() {
  const [name, setName] = useState("Invitado");
  const [email, setEmail] = useState("");
  const [cdo, setCdo] = useState("");
  const [loading, setLoading] = useState(true);
  const [weeklySongs, setWeeklySongs] = useState<Song[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [emergingBands, setEmergingBands] = useState<EmergingBand[]>([]);
  const [featuredBand, setFeaturedBand] = useState<EmergingBand | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
    const [currentBand, setCurrentBand] = useState(0);
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();
const latestNews = await getNews();
setNews(latestNews);

const eventItems = await getEvents();
setEvents(eventItems);
const bands = await getEmergingBands();
setEmergingBands(bands);

      if (!data.user) {
  setName("Invitado");
  setEmail("");
  setCdo("");
  setIsLoggedIn(false);

  const featured = await getWeeklyFeatured();
  setWeeklySongs(featured);

  setLoading(false);
  return;
}

setIsLoggedIn(true);

      setName(displayName);
      setEmail(data.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("cdo")
        .eq("id", data.user.id)
        .single();

      setCdo(profile?.cdo || data.user.user_metadata?.cdo || "");

      const featured = await getWeeklyFeatured();
      setWeeklySongs(featured);

      setLoading(false);
    };

    loadSession();
  }, []);

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Cargando experiencia...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="conexionrock-shell" style={{ display: "flex" }}>
      <Sidebar />

      <section
        style={{
          flex: 1,
          minHeight: "100vh",
          paddingBottom: "120px",
          minWidth: 0,
        }}
      >
        <div className="uk-container uk-container-expand uk-padding">
          <section
            className="conexionrock-home-hero uk-margin-medium-bottom"
            style={{
              backgroundImage: currentSong
                ? `linear-gradient(90deg, rgba(18,18,18,0.96) 0%, rgba(18,18,18,0.82) 48%, rgba(18,18,18,0.45) 100%), url(${currentSong.cover})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="conexionrock-hero-glow" />

            <div className="conexionrock-hero-layout">
             
             
             
              <div className="conexionrock-hero-left">
  <p className="conexionrock-eyebrow uk-margin-small-bottom">
    🔴 EN VIVO
  </p>

  <h1 className="conexionrock-hero-title uk-margin-remove">
    Conexión Rock Radio
  </h1>

  <p className="conexionrock-hero-copy uk-margin-small-top">
    Música independiente, noticias, podcasts, eventos y cobertura de la escena
    musical en un solo lugar.
  </p>

  <div className="conexionrock-user-strip">
    <span>Radio</span>
    <span>Noticias</span>
    <span>Podcasts</span>
    <span>Eventos</span>
  </div>

  <div className="conexionrock-hero-actions conexionrock-hero-actions-bottom">
    <button
      type="button"
      className="conexionrock-pill-button"
      onClick={() => {
        const radio = document.querySelector("audio");
        if (radio) {
          (radio as HTMLAudioElement).play();
        }
      }}
    >
      Escuchar ahora
    </button>

    <a href="/events" className="conexionrock-ghost-button">
      Ver eventos
    </a>
  </div>
  
<div className="conexionrock-news-grid-hero">
  {news.slice(0, 4).map((item) => (
    <a
      key={item.id}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="conexionrock-news-strip-item"
    >
      <img
        src={item.image}
        alt={item.title}
        className="conexionrock-news-strip-image"
      />

      <span>{item.title}</span>
    </a>
  ))}
</div>





</div>





           <aside className="conexionrock-weekly-feature">
          
  {emergingBands.length > 0 && (
    <a
      href={emergingBands[currentBand].link}
      target="_blank"
      rel="noopener noreferrer"
      className="conexionrock-emerging-card"
    >
      <p className="conexionrock-weekly-kicker">
        🎸 MÚSICA NUEVA
      </p>

      <img
        src={emergingBands[currentBand].image}
        alt={emergingBands[currentBand].title}
        className="conexionrock-emerging-image"
      />

      <h3>{emergingBands[currentBand].title}</h3>

      <p>
        {emergingBands[currentBand].excerpt.substring(0, 120)}
      </p>



<div className="conexionrock-slider-controls">
  <button
    onClick={() =>
      setCurrentBand(
        currentBand === 0
          ? emergingBands.length - 1
          : currentBand - 1
      )
    }
  >
    ◀
  </button>

  <span>
    {currentBand + 1} / {emergingBands.length}
  </span>

  <button
    onClick={() =>
      setCurrentBand(
        currentBand === emergingBands.length - 1
          ? 0
          : currentBand + 1
      )
    }
  >
    ▶
  </button>
</div>


    </a>




  )}
</aside>
            </div>









        </section>


<Header />
 




<section className="uk-margin-large-top">
  <div className="conexionrock-section-heading">
    <div>
      <p className="conexionrock-eyebrow uk-margin-remove">
        PRÓXIMOS EVENTOS
      </p>

      <h2 className="conexionrock-section-title uk-margin-remove">
        Agenda y conciertos
      </h2>
      <EventFeed events={events} />
    </div>
  </div>


</section>


<section className="uk-margin-large-top">
  <div className="conexionrock-section-heading">
    <div>
      <p className="conexionrock-eyebrow uk-margin-remove">
        NUEVAS PROPUESTAS
      </p>

      <h2 className="conexionrock-section-title uk-margin-remove">
        Bandas emergentes
      </h2>
    </div>
  </div>

  <SongGrid songs={weeklySongs} />
</section>






<NewsFeed news={news} />

<section className="uk-margin-large-top">
            <div className="conexionrock-section-heading">
              <div>
                <p className="conexionrock-eyebrow uk-margin-remove">
                  NUEVO EN conexionrock
                </p>

                <h2 className="conexionrock-section-title uk-margin-remove">
                  Selección destacada
                </h2>
              </div>

              <a href="/search" className="conexionrock-section-link">
                Ver todo
              </a>
            </div>

            <SongGrid />
          </section>
        </div>
      </section>
    </main>
  );
}