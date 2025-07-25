import { Diffchart } from '$lib/module/diffchart/index.js';
import '$lib/module/diffchart/diffchart.server.js';
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
    const level = Number(10);

    if (isNaN(level)) {
        throw error(500);
    }

    const diffChartData = await Diffchart.Server.DBController.getDonderfullcomboByLevel(level);
    const diffChart = diffChartData?.data;
    if (!diffChart) {
        throw error(404);
    }

    /*
    const songNos = diffChart.sections.flatMap((section) => section.songs.map((song) => song.songNo))
    const songSearchResult = await songDBController.getSongsColumnsBySongNo(songNos, ["genre", "songNo", "title", "titleKo", "aliasKo"]) as SongDataPickedForDiffchart[]
    */
    return {
        diffChartData,
        //songs: songSearchResult
    }
}