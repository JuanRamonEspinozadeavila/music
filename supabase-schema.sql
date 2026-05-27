


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (
    id,
    email,
    display_name
  )
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cdos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cdos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "song_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "media_id" "uuid"
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."media_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "artist" "text",
    "description" "text",
    "type" "text" NOT NULL,
    "cdo" "text",
    "audio_url" "text" NOT NULL,
    "cover_url" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_weekly_featured" boolean DEFAULT false,
    "weekly_order" integer DEFAULT 0,
    "is_featured_content" boolean DEFAULT false,
    "featured_order" integer DEFAULT 0,
    "featured_link" "text",
    CONSTRAINT "media_items_type_check" CHECK (("type" = ANY (ARRAY['song'::"text", 'podcast'::"text"])))
);


ALTER TABLE "public"."media_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."playlist_songs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "playlist_id" "uuid",
    "song_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."playlist_songs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."playlists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "cover_url" "text",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."playlists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "display_name" "text",
    "avatar_url" "text",
    "role" "text" DEFAULT 'user'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "cdo" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."songs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "artist" "text" NOT NULL,
    "album" "text",
    "cover_url" "text",
    "audio_url" "text" NOT NULL,
    "duration" integer,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."songs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sponsors_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "link_url" "text",
    "label" "text" DEFAULT 'Patrocinador'::"text",
    "is_active" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sponsors_events" OWNER TO "postgres";


ALTER TABLE ONLY "public"."cdos"
    ADD CONSTRAINT "cdos_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."cdos"
    ADD CONSTRAINT "cdos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_song_id_key" UNIQUE ("user_id", "song_id");



ALTER TABLE ONLY "public"."media_items"
    ADD CONSTRAINT "media_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_playlist_id_song_id_key" UNIQUE ("playlist_id", "song_id");



ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sponsors_events"
    ADD CONSTRAINT "sponsors_events_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "favorites_user_media_unique" ON "public"."favorites" USING "btree" ("user_id", "media_id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media_items"
    ADD CONSTRAINT "media_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."playlist_songs"
    ADD CONSTRAINT "playlist_songs_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."songs"
    ADD CONSTRAINT "songs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Anyone can read cdos" ON "public"."cdos" FOR SELECT USING (true);



CREATE POLICY "Authenticated can delete sponsors events" ON "public"."sponsors_events" FOR DELETE TO "authenticated" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated can insert sponsors events" ON "public"."sponsors_events" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated can update sponsors events" ON "public"."sponsors_events" FOR UPDATE TO "authenticated" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Authenticated users can insert playlists" ON "public"."playlists" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can insert songs" ON "public"."songs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can read cdos" ON "public"."cdos" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Public can read active sponsors events" ON "public"."sponsors_events" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Users can delete own favorites" ON "public"."favorites" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own playlists" ON "public"."playlists" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own songs" ON "public"."songs" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own favorites" ON "public"."favorites" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can read own favorites" ON "public"."favorites" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can update own playlists" ON "public"."playlists" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own songs" ON "public"."songs" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."cdos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playlist_songs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playlists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "read media items" ON "public"."media_items" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."songs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sponsors_events" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."cdos" TO "anon";
GRANT ALL ON TABLE "public"."cdos" TO "authenticated";
GRANT ALL ON TABLE "public"."cdos" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."media_items" TO "anon";
GRANT ALL ON TABLE "public"."media_items" TO "authenticated";
GRANT ALL ON TABLE "public"."media_items" TO "service_role";



GRANT ALL ON TABLE "public"."playlist_songs" TO "anon";
GRANT ALL ON TABLE "public"."playlist_songs" TO "authenticated";
GRANT ALL ON TABLE "public"."playlist_songs" TO "service_role";



GRANT ALL ON TABLE "public"."playlists" TO "anon";
GRANT ALL ON TABLE "public"."playlists" TO "authenticated";
GRANT ALL ON TABLE "public"."playlists" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."songs" TO "anon";
GRANT ALL ON TABLE "public"."songs" TO "authenticated";
GRANT ALL ON TABLE "public"."songs" TO "service_role";



GRANT ALL ON TABLE "public"."sponsors_events" TO "anon";
GRANT ALL ON TABLE "public"."sponsors_events" TO "authenticated";
GRANT ALL ON TABLE "public"."sponsors_events" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







