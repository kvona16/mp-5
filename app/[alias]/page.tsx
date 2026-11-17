// app/[alias]/page.tsx
import { redirect, notFound } from 'next/navigation';
import getCollection from '@/db';
import { Suspense } from "react";

//database name to store shortened URL mappings
const URLS_COLLECTION = 'urls';

interface PageProps {
    params: Promise<{ alias: string }>;
}

async function AliasRedirect({ params }: PageProps): Promise<null> {
    const { alias } = await params;

    //see if database has a match
    try {
        const collection = await getCollection(URLS_COLLECTION);
        const record = await collection.findOne({ alias });

        //show 404 if no match exists or URL is found
        if (!record || !record.url) {
            notFound();
        }

        redirect(record.url);
    } catch (error: unknown) {
        // Check if it's a standard error message match
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            throw error;
        }

        // Check the redirect using Record<string, unknown>
        const errObj = error as Record<string, unknown>;
        if (errObj && typeof errObj.digest === 'string' && errObj.digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        // If it's a database or other error, show the 404 page
        notFound();
    }
}

//gets the dynamic alias segment from the URL
export default function RedirectPage({ params }: PageProps) {
    return (
        <Suspense fallback={<p>Redirecting...</p>}>
            <AliasRedirect params={params} />
        </Suspense>
    );
}