import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {

  console.log(
    "SERVICE ROLE EXISTS:",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(
    "SERVICE ROLE LENGTH:",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.length
  );



  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as "song" | "podcast";
    const cdo = formData.get("cdo") as string;
    const createdBy = formData.get("createdBy") as string;

    const audioFile = formData.get("audio") as File | null;
    const coverFile = formData.get("cover") as File | null;

    if (!title || !type || !audioFile || !createdBy) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const audioBucket = type === "podcast" ? "podcast" : "songs";

    const safeTitle = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9áéíóúñü\s-]/gi, "")
      .replace(/\s+/g, "-");

    const timestamp = Date.now();

    const audioExt = audioFile.name.split(".").pop() || "mp3";
    const audioPath = `${type}/${timestamp}-${safeTitle}.${audioExt}`;

    const { error: audioError } = await supabaseAdmin.storage
      .from(audioBucket)
      .upload(audioPath, audioFile, {
        contentType: audioFile.type || "audio/mpeg",
        upsert: false,
      });

    if (audioError) {
      return NextResponse.json({ error: audioError.message }, { status: 500 });
    }

    const { data: audioPublic } = supabaseAdmin.storage
      .from(audioBucket)
      .getPublicUrl(audioPath);

    let coverUrl = "";

    if (coverFile) {
      const coverExt = coverFile.name.split(".").pop() || "jpg";
      const coverPath = `${type}/${timestamp}-${safeTitle}.${coverExt}`;

      const { error: coverError } = await supabaseAdmin.storage
        .from("covers")
        .upload(coverPath, coverFile, {
          contentType: coverFile.type || "image/jpeg",
          upsert: false,
        });

      if (coverError) {
        return NextResponse.json(
          { error: coverError.message },
          { status: 500 }
        );
      }

      const { data: coverPublic } = supabaseAdmin.storage
        .from("covers")
        .getPublicUrl(coverPath);

      coverUrl = coverPublic.publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from("media_items")
      .insert({
        title,
        artist,
        description,
        type,
        cdo,
        audio_url: audioPublic.publicUrl,
        cover_url: coverUrl,
        created_by: createdBy,
      })
      .select()
      .single();
    console.log("INSERT DATA:", data);
    console.log("INSERT ERROR:", error);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Archivo subido correctamente.",
      item: data,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Error inesperado al subir el archivo." },
      { status: 500 }
    );
  }
}