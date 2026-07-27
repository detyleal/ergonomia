import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('respostas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Erro ao buscar dados: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: `Erro interno: ${err.message}` },
      { status: 500 }
    );
  }
}
