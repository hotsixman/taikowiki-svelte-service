import { daniDBController } from "$lib/module/common/dani/dani.server";
import { songDBController } from "$lib/module/common/song/song.server";
import type { SongDataPickedForDani } from "$lib/module/common/dani/types";
import { error } from "@sveltejs/kit";
import { DAN } from "$lib/module/common/song/const.js";

export async function load({ params }) {
    const daniData = await daniDBController.getByVersion(params.version);

    if (daniData === null) {
        throw error(404);
    }

    daniData.data.sort((a, b) => {
        const aIndex = DAN.indexOf(a as any);
        const bIndex = DAN.indexOf(b as any);

        return bIndex - aIndex;
    });

    const songNos = new Set<string>(
        daniData.data.flatMap((dani) => dani.songs.map((song) => song.songNo ?? ""))
    );
    songNos.delete("");

    const songDatas = (await songDBController.getSongsColumnsBySongNo(
        [...songNos],
        ["songNo", "genre", "title", "courses"]
    )) as SongDataPickedForDani[];

    return {
        daniData,
        songDatas,
    };
}
