import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, mediaId } = body;

    if (!userId || !mediaId) {
      return NextResponse.json(
        { error: "Faltan userId o mediaId." },
        { status: 400 }
      );
    }

    const { data: existingFavorite, error: findError } = await supabaseAdmin
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        { error: findError.message },
        { status: 500 }
      );
    }

    if (existingFavorite) {
      const { error: deleteError } = await supabaseAdmin
        .from("favorites")
        .delete()
        .eq("id", existingFavorite.id);

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Favorito eliminado.",
      });
    }

    const { error: insertError } = await supabaseAdmin
      .from("favorites")
      .insert({
        user_id: userId,
        media_id: mediaId,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      liked: true,
      message: "Favorito agregado.",
    });
  } catch (error) {
    console.error("FAVORITE API ERROR:", error);

    return NextResponse.json(
      { error: "Error inesperado al actualizar favorito." },
      { status: 500 }
    );
  }
}