import { Song } from '$lib/module/song/song.server';
import { error } from '@sveltejs/kit';

export async function GET({ params, setHeaders }) {
    const { songNo } = params;

    const songData = await Song.Server.DBController.getSongBySongNo(songNo);

    if (!songData) {
        throw error(404);
    }

    setHeaders({
        'Content-Type': 'application/json'
    });

    return new Response(JSON.stringify(songData))
}