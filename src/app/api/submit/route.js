import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    // Validação básica
    const { trabalha_home_office, regiao_sjdr, nordico, diagrama } = body;

    if (typeof trabalha_home_office !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo "trabalha_home_office" é obrigatório.' },
        { status: 400 }
      );
    }

    if (typeof regiao_sjdr !== 'boolean') {
      return NextResponse.json(
        { error: 'Campo "regiao_sjdr" é obrigatório.' },
        { status: 400 }
      );
    }

    if (!nordico || typeof nordico !== 'object') {
      return NextResponse.json(
        { error: 'Questionário Nórdico é obrigatório.' },
        { status: 400 }
      );
    }

    if (!diagrama || typeof diagrama !== 'object') {
      return NextResponse.json(
        { error: 'Diagrama de Áreas Dolorosas é obrigatório.' },
        { status: 400 }
      );
    }

    // Verificar se todas as 9 regiões do nórdico foram preenchidas
    const nordicoRegions = [
      'pescoco', 'ombros', 'costa_superior', 'cotovelos', 'punhos_maos',
      'costa_inferior', 'quadril_coxas', 'joelhos', 'tornozelos_pes'
    ];
    const nordicoQuestions = ['problema_12m', 'impedido_12m', 'consulta_12m', 'problema_7d'];

    for (const region of nordicoRegions) {
      if (!nordico[region]) {
        return NextResponse.json(
          { error: `Região "${region}" do Questionário Nórdico não foi preenchida.` },
          { status: 400 }
        );
      }
      for (const question of nordicoQuestions) {
        if (typeof nordico[region][question] !== 'boolean') {
          return NextResponse.json(
            { error: `Pergunta "${question}" da região "${region}" não foi respondida.` },
            { status: 400 }
          );
        }
      }
    }

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('respostas')
      .insert([
        {
          trabalha_home_office,
          regiao_sjdr,
          nordico,
          diagrama,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Erro ao salvar: ${error.message} (${error.code})` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Resposta salva com sucesso!', id: data[0]?.id },
      { status: 201 }
    );
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: `Erro interno: ${err.message}` },
      { status: 500 }
    );
  }
}
