// app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import getCollection from '@/db';

//database name to store shortened URL mappings
const URLS_COLLECTION = 'urls';

//handles POST requests to create the shortened URL
export async function POST(request: Request) {
    try {
        const { url, alias } = await request.json();

        //fails if either required field is missing
        if (!url || !alias) {
            return NextResponse.json(
                { error: 'Both URL and alias are required.' },
                { status: 400 }
            );
        }

        // validate that the string is a correctly formatted URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format. Please include http:// or https://' },
                { status: 400 }
            );
        }

        //connect to the database connection
        const collection = await getCollection(URLS_COLLECTION);

        // check if already taken
        const existing = await collection.findOne({ alias });
        if (existing) {
            return NextResponse.json(
                { error: 'This alias is already taken. Please choose another.' },
                { status: 409 }
            );
        }

        // insert the new link mapping
        await collection.insertOne({
            alias,
            url,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, alias }, { status: 201 });
    } catch (error) {
        console.error('Error shortening URL:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}