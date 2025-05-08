import { docDBController } from '$lib/module/common/wikidoc/server/dbController.server.js';
import { WikiError } from '$lib/module/common/wikidoc/util.js';
import { error, redirect } from '@sveltejs/kit';
import { getClientAddress } from "$lib/module/common/util.server";

export async function POST(event) {
    throw redirect(308, 'https://file.taiko.wiki/doc/create');

    /*
    const { request, locals } = event;

    if (!locals.userData) {
        throw error(401, JSON.stringify({
            reason: 'NOT_LOGINED'
        }))
    }

    if(locals.userData.grade < 2){
        throw error(403, JSON.stringify({
            reason: 'LOW_GRADE'
        }))
    }

    const requestData = await request.json();

    try{
        await docDBController.create(locals.userData.UUID, getClientAddress(event), requestData.docData);
    }
    catch(err){
        console.log(err);
        if(err instanceof WikiError){
            return new Response(JSON.stringify({reason: err.code}), {status: 400});
        }
        else{
            throw error(500);
        }
    }

    return new Response();
    */
}