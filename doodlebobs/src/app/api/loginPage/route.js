// src/app/api/loginPage/route.js
import doodleModel from '@/models/doodleModel';
import { NextResponse } from 'next/server';

// Route to handle user login
export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Attempt to log in the user
        const user = await doodleModel.login(username, password);
        return NextResponse.json({ user_id: user.user_id, username: user.username }, { status: 200 });
    } catch (error) {
        if (error.message === 'Invalid username or password') {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }
        console.error('Error in POST /api/loginPage:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
