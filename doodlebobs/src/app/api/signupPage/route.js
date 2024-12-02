// src/app/api/signupPage/route.js

import doodleModel from '@/models/doodleModel';
import { NextResponse } from 'next/server';

// Route to handle user sign-up
export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Create a new user
        try {
            const newUser = await doodleModel.signup(username, password);
            return NextResponse.json({ user_id: newUser.user_id }, { status: 201 }); // Created
        } catch (error) {
            if (error.message.includes('unique constraint')) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 409 }); // Conflict
            }
            throw error;
        }
    } catch (error) {
        console.error('Error in POST /api/signupPage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
