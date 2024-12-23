import { gamecenterDBController } from '$lib/module/common/gamecenter/gamecenter.server.js';
import { error } from '@sveltejs/kit';

export async function POST({request, url}){
    const requestData = await request.json();
    const order = requestData.order;

    if(typeof(order) !== "number"){
        throw error(400);
    }

    await gamecenterDBController.approveRequest(order, url.origin);

    return new Response();
}