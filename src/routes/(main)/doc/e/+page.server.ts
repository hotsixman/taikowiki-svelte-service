import { docDBController } from '$lib/module/common/wikidoc/server/dbController.server';
import { error } from '@sveltejs/kit';

export async function load({ locals, url }) {
    const title = url.searchParams.get('title');
    if (title) {
        const docId = await docDBController.getDocIdByTitle(title);
        if (docId !== null){
            return {
                redirect: docId
            }
        }
    }

    if (!locals.userData) {
        throw error(401);
    }
    if (locals.userData.grade < 2) {
        throw error(403);
    }
}