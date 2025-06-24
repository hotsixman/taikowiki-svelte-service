import { Dani } from "$lib/module/dani";
import '$lib/module/dani/dani.server'
import { error } from "@sveltejs/kit";

export async function GET({ params, setHeaders }) {
    const { version } = params;

    const daniData = await Dani.Server.DBController.getByVersion(version);

    if (!daniData) {
        throw error(400);
    }

    let { order, ...others } = daniData as Dani.DB & { order: number };

    setHeaders({
        'Content-Type': 'application/json'
    })

    return new Response(JSON.stringify(others))
}