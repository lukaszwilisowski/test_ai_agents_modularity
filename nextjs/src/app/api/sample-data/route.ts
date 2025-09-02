import { NextResponse } from 'next/server';
import { guitarModel } from '@/lib/models/guitar.model';

export async function POST() {
  try {
    const guitars = await guitarModel.createSampleData();
    
    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      guitars: guitars.length
    });
  } catch (error) {
    console.error('Failed to create sample data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create sample data'
    }, { status: 500 });
  }
}