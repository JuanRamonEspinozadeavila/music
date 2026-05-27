SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict b7WkgyuyMMUvfSJbNdn3x7aIH6SB5Gcsd3mQfh7oZaAymv3mOKUPRkO8TD8WJxH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cdos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cdos" ("id", "name", "active", "created_at") VALUES
	('0766e1cf-0e88-4e7f-b85f-c5286863ca57', 'CDO Aguascalientes', true, '2026-05-18 16:25:57.071613+00'),
	('87a9289c-7ee1-4410-8b30-349fbd058863', 'CDO Celaya', true, '2026-05-18 16:25:57.071613+00'),
	('df1c72a9-04e2-4c4c-977d-7aa174568524', 'CDO Coacalco', true, '2026-05-18 16:25:57.071613+00'),
	('4de73354-6347-4b09-a54d-fe212ba239c4', 'CDO Ganaderos', true, '2026-05-18 16:25:57.071613+00'),
	('36c4dd2d-334e-47e2-9136-2d4f42a25440', 'CDO Guadalajara', true, '2026-05-18 16:25:57.071613+00'),
	('a97421d0-2205-4f56-91bc-2c45d25d4d93', 'CDO Ladoga', true, '2026-05-18 16:25:57.071613+00'),
	('a03f9a59-6413-4268-b4c6-4adc3002cd5d', 'CDO Pantitlan', true, '2026-05-18 16:25:57.071613+00'),
	('46b9d5f8-cbab-49d8-b094-be3638423d63', 'CDO Puebla', true, '2026-05-18 16:25:57.071613+00'),
	('d597b244-ff8a-4281-9635-6f6fd801cc64', 'CDO Querétaro', true, '2026-05-18 16:25:57.071613+00'),
	('df2a2137-d864-48fd-981c-0dfc77f9c668', 'CDO Texcoco', true, '2026-05-18 16:25:57.071613+00'),
	('36cef6af-0bce-4fc6-89a8-64cb2bb7c4f7', 'CDO Toluca', true, '2026-05-18 16:25:57.071613+00'),
	('accc302e-1683-459a-b2f3-7ab0e672cecb', 'Corporativo Santa Fe ', true, '2026-05-18 16:25:57.071613+00');


--
-- Data for Name: media_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."media_items" ("id", "title", "artist", "description", "type", "cdo", "audio_url", "cover_url", "created_by", "created_at", "is_weekly_featured", "weekly_order", "is_featured_content", "featured_order", "featured_link") VALUES
	('c34df2b2-4180-4d31-bd90-ac32b90984b3', 'El baile del diablo ', '', 'Su majestad imperial El baile del diablo ', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779310288692-el-baile-del-diablo.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779310288692-el-baile-del-diablo.jpg', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-20 20:51:31.10038+00', false, 0, false, 0, NULL),
	('e2f12fa0-80b8-48e0-a302-fe0eaccba82f', 'Impecable', 'Mi amigo invensible', 'una canción de esta banda para (Live on KEXP)', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779314026957-impecable.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779314026957-impecable.jpg', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-20 21:53:48.807139+00', false, 0, false, 0, NULL),
	('611162fc-1904-4cbf-bea2-f7b934420d71', 'Oro', 'Diamante Eléctrico', 'Diamante Eléctrico - Oro (Crudo y Cursi)', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779374629571-oro.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779374629571-oro.avif', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-21 14:43:51.49269+00', false, 0, false, 0, NULL),
	('418f6c19-0133-4dd7-b416-23d3454ab209', 'Lluvia', 'Lng Sht', 'LGN SHT', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779817914040-lluvia.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779817914040-lluvia.webp', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 17:51:56.063359+00', false, 0, false, 0, NULL),
	('4dd58a8f-4193-4a27-883e-e6fd2cf93222', 'Radio Spot', 'Spot Radio Brame', 'Spot Radio Brame', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779740554465-radio-spot.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779740554465-radio-spot.JPEG', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-25 20:22:36.76107+00', false, 0, false, 0, NULL),
	('a9a2eb15-ce9a-4958-8c76-1776228f7604', 'El talento solo es el 20%...', 'Tiene Sentido ', 'Hoy entrevistamos a Lorena Torres, doctora en Ciencias del Deporte y experta en rendimiento deportivo y humano que lleva más de 20 años en la élite deportiva.', 'podcast', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/podcast/podcast/1779808879969-el-talento-solo-es-el-20-el-80-restante-es.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/podcast/1779808879969-el-talento-solo-es-el-20-el-80-restante-es.png', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 15:21:23.6892+00', false, 0, false, 0, NULL),
	('c9b95269-29d7-42dc-aa58-91da0ee58458', 'Se Me Va', 'León Larregui ', 'León Larregui - Se Me Va', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779811088664-se-me-va.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779811088664-se-me-va.png', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 15:58:10.121117+00', false, 0, false, 0, NULL),
	('3399d90a-298f-45d3-825f-db990c3c4b34', 'Acapulco', 'Siddhartha, Emmanuel Horvilleur ', 'Acapulco-Locos', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779810915918-acapulco.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779810915918-acapulco.png', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 15:55:18.267582+00', false, 0, false, 0, NULL),
	('23408a81-72d3-4ad9-aacf-19c4c8a49da3', 'Maquina del Tiempo', 'Mi Amigo Invencible ', 'Bandalos Chinos', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779810710392-maquina-del-tiempo.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779810710392-maquina-del-tiempo.png', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 15:51:52.149502+00', false, 2, false, 0, NULL),
	('25acbde7-3970-438d-942b-d9a0b6294eef', 'SEB', 'Paloma Morphy', 'SEB - song and lyrics by Paloma Morphy', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779807090898-seb.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779807090898-seb.jpg', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-26 14:51:31.510148+00', false, 3, false, 0, NULL),
	('ea03f95d-4096-4bfa-9b44-b4fa57090f80', 'Desayuno continental ', 'mi amigo invensible', 'Desayuno Continental
Mi Amigo Invencible
Dutsiland', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779314300542-desayuno-continental.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779314300542-desayuno-continental.jpg', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-20 21:58:21.878538+00', false, 0, true, 0, ''),
	('176e0539-6967-44bc-b11f-2e58dafd0583', 'El diccionario', 'Sabino y Los Eclipses', '(C) 2026 Sony Music Entertainment México, S.A. de C.V.', 'song', 'Corporativo Santa Fe', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/songs/song/1779373379567-el-diccionario.mp3', 'https://hkkaokgykrfmnvtlnjhz.supabase.co/storage/v1/object/public/covers/song/1779373379567-el-diccionario.jpeg', 'f06443c9-fab7-4eae-a81c-1b7625c83764', '2026-05-21 14:23:01.644158+00', true, 1, false, 0, NULL);


--
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."songs" ("id", "title", "artist", "album", "cover_url", "audio_url", "duration", "user_id", "created_at") VALUES
	('6690e822-327a-4f79-bcd0-99a6b222ec03', 'Night Drive', 'Synthwave', NULL, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', NULL, NULL, '2026-05-18 16:13:02.499245+00');


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."favorites" ("id", "user_id", "song_id", "created_at", "media_id") VALUES
	('aa68b003-15f9-4731-b265-cc32f80fe8ed', 'f06443c9-fab7-4eae-a81c-1b7625c83764', NULL, '2026-05-20 21:49:50.310834+00', 'c34df2b2-4180-4d31-bd90-ac32b90984b3'),
	('8f8b70ea-7152-49b3-894c-ba6e7e7ffb96', 'f06443c9-fab7-4eae-a81c-1b7625c83764', NULL, '2026-05-20 22:02:38.115644+00', 'ea03f95d-4096-4bfa-9b44-b4fa57090f80'),
	('378e18b7-9a63-44e1-b62a-37df350acc08', 'f06443c9-fab7-4eae-a81c-1b7625c83764', NULL, '2026-05-21 14:44:12.477763+00', '611162fc-1904-4cbf-bea2-f7b934420d71'),
	('9781012c-5340-40f6-813e-a69209625fb5', 'f06443c9-fab7-4eae-a81c-1b7625c83764', NULL, '2026-05-25 20:23:08.653549+00', '4dd58a8f-4193-4a27-883e-e6fd2cf93222');


--
-- Data for Name: playlists; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: playlist_songs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "display_name", "avatar_url", "role", "created_at", "cdo") VALUES
	('a412ccca-6f16-4e52-b749-9b4e6d5c154e', 'janeth.salas@brvo.mx', 'janeth.salas', NULL, 'user', '2026-05-25 21:40:16.09305+00', NULL),
	('f1076918-dede-430e-8436-3271368a3ec8', 'diana.vega@grupobrame.com', 'diana.vega', NULL, 'user', '2026-05-26 19:19:10.881085+00', NULL),
	('f06443c9-fab7-4eae-a81c-1b7625c83764', 'idiwjr@gmail.com', 'Ramón', NULL, 'admin', '2026-05-19 20:31:56.579043+00', 'Corporativo Santa Fe '),
	('c6a5c054-e76d-4811-940f-a84f4dce88bc', 'juan.espinoza@grupobrame.com', 'juan.espinoza', NULL, 'user', '2026-05-26 20:22:22.545176+00', NULL),
	('50d3db9b-f0a0-40f0-9a81-66e653aa0290', 'elias.martinez@grupobrame.com', 'elias.martinez', NULL, 'user', '2026-05-27 14:36:44.910751+00', NULL);


--
-- Data for Name: sponsors_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sponsors_events" ("id", "title", "description", "image_url", "link_url", "label", "is_active", "sort_order", "created_at") VALUES
	('6fad0bc9-1500-41c1-b0be-f442fa7d53d3', 'Malinche: El Musical', 'El mejor espectáculo de México a un lado del Monumento a la Revolución.', 'https://applications-media.feverup.com/image/upload/w_720,h_520,c_fill,q_auto,f_auto,g_auto/fever2/plan/photo/6019eea2-0278-11f1-883f-0a1590292ef5.jpg', 'https://feverup.com/m/273924', 'Evento', true, 1, '2026-05-26 18:43:33.373532+00'),
	('0cee9111-95a3-47b2-87c4-02f7b8b2a825', 'Festival Bahidorá', 'TODXS SON BIENVENIDXS', 'data:image/png;base64,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', 'https://www.bahidora.com/', 'Evento', true, 2, '2026-05-26 19:39:38.003204+00');


--
-- PostgreSQL database dump complete
--

-- \unrestrict b7WkgyuyMMUvfSJbNdn3x7aIH6SB5Gcsd3mQfh7oZaAymv3mOKUPRkO8TD8WJxH

RESET ALL;
