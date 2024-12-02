// src/app/api/doodles/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import { NextResponse } from 'next/server';

// Get route to get all the doodles (with the newest first)
export async function GET() { 
    try {
        const doodles = await doodleModel.getAllDoodles();
        return NextResponse.json(doodles);
    } catch (error) {
        console.error('Error in GET /api/doodles:', error);
        return NextResponse.json({ error: 'Failed to fetch doodles' }, { status: 500 });
    }
}

// POST route to create a new doodle
export async function POST(req) {
    try {
        // Parse request body
        const { title, imageData, userId } = await req.json();

        // Validate title, imageData, and userId
        if (!title || !imageData || !userId) {
            return NextResponse.json(
                { error: 'Title, image data, and user ID are required' },
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

        // Store Imgur link in database with associated userId
        const imgurLink = imgurResponse.data.data.link;
        const newDoodle = await doodleModel.createDoodle(title, imgurLink, userId);

        // Return the created doodle
        return NextResponse.json(newDoodle, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/create:', error);
        return NextResponse.json(
            { error: 'Failed to create doodle', details: error.message },
            { status: 500 }
        );
    }
}

//delete route only for admins
export async function DELETE(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const doodleId = searchParams.get('id'); // Get the `id` from query params
    const userId = searchParams.get('user_id'); // Get the `user_id` from query params

    if (!doodleId) {
        return NextResponse.json(
            { error: 'Doodle ID is required' },
            { status: 400 }
        );
    }

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
        );
    }

    try {
        // Check if the user is admin
        if (userId === '1') {
            // Admin can delete any doodle
            const wasDeleted = await doodleModel.deleteDoodleById(doodleId);

            if (wasDeleted) {
                return NextResponse.json(
                    { message: 'Doodle deleted successfully by admin' },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { error: 'Doodle not found' },
                    { status: 404 }
                );
            }
        }

        // For non-admin users, ensure they own the doodle
        const doodle = await doodleModel.getDoodleById(doodleId);

        if (!doodle) {
            return NextResponse.json(
                { error: 'Doodle not found' },
                { status: 404 }
            );
        }

        if (doodle.user_id !== parseInt(userId)) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this doodle' },
                { status: 403 }
            );
        }

        // Proceed to delete the doodle for authorized user
        const wasDeleted = await doodleModel.deleteDoodleById(doodleId);

        if (wasDeleted) {
            return NextResponse.json(
                { message: 'Doodle deleted successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Doodle not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error in DELETE /api/doodles:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
