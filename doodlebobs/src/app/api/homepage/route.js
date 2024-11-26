// src/app/api/homepage/route.js

import doodleModel from '@/models/doodleModel';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
// import { flushSync } from 'react-dom';

// GET /homepage route
export async function POST() {
    try {
        let sessionkey = (Math.floor(Math.random() * (99999999 - 0 + 1)) + 1).toString();
        while (sessionkey === (process.env.ADMIN_SESSION_KEY)) {
            sessionkey = (Math.floor(Math.random() * (99999999 - 0 + 1)) + 1).toString();
        }
        const envPath = path.resolve(process.cwd(), '.env');

        fs.appendFileSync(envPath, `\nSession_KEY=${sessionkey}\n`)
        // Fetch all doodles for the homepage
        const doodles = await doodleModel.getAllDoodles();

        // Respond with the data
        return NextResponse.json(doodles, `sessionkey: = ${sessionkey}`, { status: 200 });
    } catch (error) {
        console.error('Error in GET /homepage:', error);

        // Respond with an error if something goes wrong
        return NextResponse.json({ error: 'Failed to load homepage' }, { status: 500 });
    }
}

