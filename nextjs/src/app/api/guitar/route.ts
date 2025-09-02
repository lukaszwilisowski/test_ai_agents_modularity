import { NextRequest, NextResponse } from 'next/server';
import { guitarModel } from '@/lib/models/guitar.model';

export async function GET() {
  try {
    const guitars = await guitarModel.findAll();
    return NextResponse.json(guitars);
  } catch (error) {
    console.error('Failed to fetch guitars:', error);
    return NextResponse.json({ error: 'Failed to fetch guitars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const guitar = await guitarModel.create(body);
    return NextResponse.json(guitar);
  } catch (error) {
    console.error('Failed to create guitar:', error);
    return NextResponse.json({ error: 'Failed to create guitar' }, { status: 500 });
  }
}