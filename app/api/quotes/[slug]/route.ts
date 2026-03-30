import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data: record, error } = await supabase
        .from('quotations')
        .select('itinerary')
        .eq('slug', slug)
        .single();
    
    if (error || !record) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    return NextResponse.json(record.itinerary);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Database operation failed', message: error.message },
      { status: 500 }
    );
  }
}
