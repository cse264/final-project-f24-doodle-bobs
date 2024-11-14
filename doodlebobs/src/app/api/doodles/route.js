// src/app/api/doodles/route.js

import doodleModel from '@/models/doodleModel';
import { NextResponse } from 'next/server';

export async function GET() { //get route to get all the doodles
    try {
        const doodles = await doodleModel.getAllDoodles();
        return NextResponse.json(doodles);
    } catch (error) {
        console.error('Error in GET /api/doodles:', error);
        return NextResponse.json({ error: 'Failed to fetch doodles' }, { status: 500 });
    }
}
