// src/app/api/userPage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Get all doodles for a specific user by user_id
export async function GET(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const userId = searchParams.get('user_id'); // Get the `user_id` from query params

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const doodles = await doodleModel.getAllDoodlesMadeSpecific(userId);

        const formattedDoodles = doodles.map((doodle) => ({
            doodle_id: doodle.doodle_id,
            title: doodle.title,
            imgur_link: doodle.imgur_link,
        }));

        return NextResponse.json(formattedDoodles, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/userPage:', error);
        return NextResponse.json({ error: 'Failed to fetch user doodles' }, { status: 500 });
    }
}

// DELETE route to delete a doodle
export async function DELETE(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const doodleId = searchParams.get('id'); // Get the `id` from query params

    // Validate required parameters
    if (!doodleId) {
        return NextResponse.json({ error: 'Doodle ID is required' }, { status: 400 });
    }

    try {
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

/*

// Delete route for users to delete their own drawings
export async function DELETE(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const doodleId = searchParams.get('id'); // Get the `id` from query params

    // Validate required parameters
    if (!doodleId) {
        return NextResponse.json({ error: 'Doodle ID is required' }, { status: 400 });
    }

    try {
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
        console.error('Error in DELETE /api/userPage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} */