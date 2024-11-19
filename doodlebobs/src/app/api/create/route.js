// src/app/api/create/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import { NextResponse } from 'next/server';


// GEt route to create a new doodle using a drawing
export async function GET(req) { 
    try {
        console.log("hi")
        const { title, doodle_info } = await req.json(); // Parse request body
        console.log(title)
        if (!title || !doodle_info) {
            return NextResponse.json({ error: 'Title and Imgur link are required' }, { status: 400 });
        }
        const doodle = await doodleModel.createDoodle(title, doodle_info);
        return NextResponse.json(doodle);
    } catch (error) {
        console.error('Error in GET /api/create:', error);
        return NextResponse.json({ error: 'Failed to fetch create doodles' }, { status: 500 });
    }
}

