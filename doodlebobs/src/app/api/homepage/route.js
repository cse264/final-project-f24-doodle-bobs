// src/app/api/homePage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

//get route to fetch everythingg
export async function GET() {
    try {
        const doodles = await doodleModel.getAllDoodles();

        // Ensure `imgur_link` is included in the response
        const formattedDoodles = doodles.map((doodle) => ({
            id: doodle.doodle_id,
            title: doodle.title,
            imageUrl: doodle.imgur_link, // Use `imgur_link` for the image source
        }));

        return NextResponse.json(formattedDoodles);
    } catch (error) {
        console.error('Error in GET /api/homepage:', error);
        return NextResponse.json({ error: 'Failed to fetch doodles' }, { status: 500 });
    }
}

// DELETE route to delete a doodle
export async function DELETE(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const doodleId = searchParams.get('id'); // Get the `id` from query params
    const userId = searchParams.get('user_id'); // Get the `user_id` from query params

    // Validate required parameters
    if (!doodleId) {
        return NextResponse.json({ error: 'Doodle ID is required' }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Check if the user is an admin
        if (userId !== '1') {
            return NextResponse.json(
                { error: 'Unauthorized: Only admins can delete doodles' },
                { status: 403 }
            );
        }

        // Proceed to delete the doodle
        const wasDeleted = await doodleModel.deleteDoodleById(doodleId);

        if (wasDeleted) {
            return NextResponse.json(
                { message: 'Doodle deleted successfully' },
                { status: 200 }
            );
        } else {
            return NextResponse.json({ error: 'Doodle not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error in DELETE /api/homePage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
