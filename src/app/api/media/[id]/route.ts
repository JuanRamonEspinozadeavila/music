import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      artist,
      description,
      type,
      cdo,
      is_featured_content,
      featured_order,
      featured_link,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID del contenido." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("media_items")
      .update({
        title,
        artist,
        description,
        type,
        cdo,
        is_featured_content: Boolean(is_featured_content),
        featured_order: Number(featured_order || 0),
        featured_link: featured_link || "",
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Contenido actualizado correctamente.",
      item: data,
    });
  } catch (error) {
    console.error("UPDATE MEDIA ERROR:", error);

    return NextResponse.json(
      { error: "Error inesperado al actualizar." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID del contenido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("media_items")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Contenido eliminado correctamente.",
    });
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);

    return NextResponse.json(
      { error: "Error inesperado al eliminar." },
      { status: 500 }
    );
  }
}