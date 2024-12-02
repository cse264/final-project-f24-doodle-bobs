// src/app/api/homepage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
// import { flushSync } from 'react-dom';

/*
export async function POST() {
    try {
        // Generate a session key for internal use (not included in the response)
        let sessionkey = (Math.floor(Math.random() * (99999999 - 0 + 1)) + 1).toString();
        while (sessionkey === process.env.ADMIN_SESSION_KEY) {
            sessionkey = (Math.floor(Math.random() * (99999999 - 0 + 1)) + 1).toString();
        }
        const envPath = path.resolve(process.cwd(), '.env');

        // Append the session key to the environment file (optional, for debugging purposes)
        fs.appendFileSync(envPath, `\nSession_KEY=${sessionkey}\n`);

        // Fetch all doodles for the homepage
        const doodles = await doodleModel.getAllDoodles();

        // Respond with the doodles (without including the session key in the response)
        return NextResponse.json(doodles, { status: 200 });
    } catch (error) {
        console.error('Error in POST /homepage:', error);

        // Respond with an error if something goes wrong
        return NextResponse.json({ error: 'Failed to load homepage' }, { status: 500 });
    }
} */

//get route to fetch everythingg
export async function GET() {
    try {
        // Fetch all doodles with their details
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



