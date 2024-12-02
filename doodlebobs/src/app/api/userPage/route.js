// src/app/api/userPage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Get all doodles for a specific user
export async function GET(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const username = searchParams.get('username'); // Get the `username` from query params

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const doodles = await doodleModel.getAllDoodlesMadeSpecific(username);

        const formattedDoodles = doodles.map((doodle) => ({
            id: doodle.doodle_id,
            title: doodle.title,
            imageUrl: doodle.imgur_link,
        }));

        return NextResponse.json(formattedDoodles, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/userPage:', error);
        return NextResponse.json({ error: 'Failed to fetch user doodles' }, { status: 500 });
    }
}

// Delete route for users to delete their own drawings
export async function DELETE(req) {
    const { searchParams } = new URL(req.url); // Parse the URL
    const doodleId = searchParams.get('id'); // Get the `id` from query params
    const userId = parseInt(searchParams.get('user_id'), 10); // Get the `user_id` from query params

    if (!doodleId) {
        return NextResponse.json({ error: 'Doodle ID is required' }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Ensure the user owns the doodle
        const doodle = await doodleModel.getDoodleById(doodleId);

        if (!doodle) {
            return NextResponse.json({ error: 'Doodle not found' }, { status: 404 });
        }

        if (doodle.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized to delete this doodle' }, { status: 403 });
        }

        // Proceed to delete the doodle for authorized user
        const wasDeleted = await doodleModel.deleteDoodleById(doodleId);

        if (wasDeleted) {
            return NextResponse.json({ message: 'Doodle deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Doodle not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error in DELETE /api/userPage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}