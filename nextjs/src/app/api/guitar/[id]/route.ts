import { NextRequest, NextResponse } from 'next/server';
import { guitarModel } from '@/lib/models/guitar.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guitar = await guitarModel.findById(params.id);
    if (!guitar) {
      return NextResponse.json({ error: 'Guitar not found' }, { status: 404 });
    }
    return NextResponse.json(guitar);
  } catch (error) {
    console.error('Failed to fetch guitar:', error);
    return NextResponse.json({ error: 'Failed to fetch guitar' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const guitar = await guitarModel.update(params.id, body);
    if (!guitar) {
      return NextResponse.json({ error: 'Guitar not found' }, { status: 404 });
    }
    return NextResponse.json(guitar);
  } catch (error) {
    console.error('Failed to update guitar:', error);
    return NextResponse.json({ error: 'Failed to update guitar' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guitar = await guitarModel.delete(params.id);
    if (!guitar) {
      return NextResponse.json({ error: 'Guitar not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Guitar deleted successfully' });
  } catch (error) {
    console.error('Failed to delete guitar:', error);
    return NextResponse.json({ error: 'Failed to delete guitar' }, { status: 500 });
  }
}