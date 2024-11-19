// src/app/api/homepage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import { NextResponse } from 'next/server';

// GET /homepage route
export async function GET() {
    try {
        // Fetch all doodles for the homepage
        const doodles = await doodleModel.getAllDoodles(); 
        
        // Respond with the data
        return NextResponse.json(doodles, { status: 200 });
    } catch (error) {
        console.error('Error in GET /homepage:', error);
        
        // Respond with an error if something goes wrong
        return NextResponse.json({ error: 'Failed to load homepage' }, { status: 500 });
    }
}