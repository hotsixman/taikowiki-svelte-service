import { Song } from '$lib/module/song/song.server';
import { User } from "$lib/module/user";
import '$lib/module/user/user.server';
import { Doc } from "$lib/module/doc/doc.server";
import { error, redirect } from '@sveltejs/kit';
import { queryBuilder, runQuery, Where } from '@yowza/db-handler';

const { parseDBData, renderer } = Doc;
const { DBController, prepareParagraphs, setWikiLinkAvailable } = Doc.Server;

export async function load({ params, locals }) {
    const columns: (keyof Doc.DB.DocDBData)[] = ['id', 'contentTree', 'editedTime', 'editableGrade', 'editorUUID', 'id', 'isDeleted', 'renderedContentTree', 'songNo', 'title', 'redirectTo', 'type'] as const;
    type DocData = Pick<Doc.DB.DocDBData, (typeof columns)[number]> & { editor: string } & { contentTree: Doc.Data.ContentTree };

    try {
        const docData = await runQuery(async (run) => {
            // db View Data 가져오기
            const docData = await (async () => {
                const query = queryBuilder.select('docs', columns).where(Where.Compare('title', '=', params.title)).build();
                const result = await run(query);
                if (result[0]) {
                    return parseDBData(result[0]);
                }
                else {
                    return null;
                }
            })()
            if (!docData) {
                throw error(404);
            }
            const editor = docData.editorUUID ? (await User.Server.DBController.getNickname.getCallback(docData.editorUUID)(run)) ?? docData.editorUUID : docData.editorIp;

            // 삭제되었으면 삭제되었다고 표기하기
            if (docData.isDeleted) {
                return { ...docData, editor };
            }

            // 리다이렉트면 리다이렉트 시키기
            if (docData.type === "redirect") {
                if (!docData.redirectTo) {
                    return {
                        ...docData,
                        isDeleted: true,
                        editor
                    }
                }
                const redirectDocTitle = await DBController.getDocTitleById.getCallback(docData.redirectTo)(run);
                if (redirectDocTitle) {
                    throw redirect(302, `/doc/r/${encodeURIComponent(redirectDocTitle)}?from=${encodeURIComponent(docData.title)}`)
                }
                else {
                    return {
                        ...docData,
                        isDeleted: true,
                        editor
                    }
                }
            }

            if (docData.type === "song") {
                // 곡 문서이고 해당 곡 번호를 가진 곡이 존재하면 리다이렉트
                if (docData.songNo && await Song.Server.DBController.songExistsBySongNo.getCallback(docData.songNo)(run)) {
                    throw redirect(302, `/song/${docData.songNo}?from=${encodeURIComponent(docData.title)}`)
                }
            }

            const preparedContent: Doc.Data.ContentTree = {
                content: await renderer.prepareView(docData.renderedContentTree?.content as string, async (dom) => { await setWikiLinkAvailable(dom, run) }),
                subParagraphs: await prepareParagraphs(docData.renderedContentTree?.subParagraphs as Doc.Data.DocParagraph[], run)
            };
            return {
                ...docData,
                editor,
                contentTree: preparedContent
            }
        });

        return {
            docData,
            canEditable: locals.userData ? locals.userData.grade >= docData.editableGrade : false
        }
    }
    catch (err) {
        throw err;
    }
}