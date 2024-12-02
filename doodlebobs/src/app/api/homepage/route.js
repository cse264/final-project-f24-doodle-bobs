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



