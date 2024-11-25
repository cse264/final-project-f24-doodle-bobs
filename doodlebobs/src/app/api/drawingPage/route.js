// src/app/api/create/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import { NextResponse } from 'next/server';


// GEt route to get the image
export async function GET() { 
    try {
        return NextResponse.json(" ");
        
    } catch (error) {
        console.error('Error in GET /api/create:', error);
        return NextResponse.json({ error: 'Failed to fetch create doodles' }, { status: 500 });
    }
}


// POST route to create a new doodle
export async function POST(req) {
    try {
        // Parse request body
        const { title, imageData } = await req.json();

        // Validate title and imageData
        if (!title || !imageData) {
            return NextResponse.json(
                { error: 'Title and image data are required' },
                { status: 400 }
            );
        }

        // Clean Base64 string
        const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
        // Validate Base64 string
        const isBase64 = /^[A-Za-z0-9+/=]+$/.test(base64Image.trim());
        if (!isBase64) {
            return NextResponse.json(
                { error: 'Invalid image data format (not Base64)' },
                { status: 400 }
            );
        }

        // Send image to Imgur API
        const imgurResponse = await axios.post(
            'https://api.imgur.com/3/image',
            {
                image: base64Image, // Send clean Base64 string
                type: 'base64',
            },
            {
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!imgurResponse.data || !imgurResponse.data.data || !imgurResponse.data.data.link) {
            throw new Error('Failed to upload image to Imgur');
        }

        // Store Imgur link in database
        const imgurLink = imgurResponse.data.data.link;
        const newDoodle = await doodleModel.createDoodle(title, imgurLink);

        // Return the created doodle
        return NextResponse.json(newDoodle, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/doodles:', error);
        return NextResponse.json(
            { error: 'Failed to create doodle', details: error.message },
            { status: 500 }
        );
    }
}
