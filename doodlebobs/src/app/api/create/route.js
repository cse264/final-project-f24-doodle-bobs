// src/app/api/create/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import { NextResponse } from 'next/server';


// GEt route to create a new doodle using a drawing
export async function GET() { 
    try {
        
        return NextResponse.json(" ");
        
    } catch (error) {
        console.error('Error in GET /api/create:', error);
        return NextResponse.json({ error: 'Failed to fetch create doodles' }, { status: 500 });
    }
}

