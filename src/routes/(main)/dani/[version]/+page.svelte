<script lang="ts">
    import { page } from "$app/stores";
    import PageTitle from "$lib/components/common/PageTitle.svelte";
    import DaniDisplay from "$lib/components/page/dani/DaniDisplay.svelte";
    import { getI18N, getLang } from "$lib/module/i18n";
    import { Song } from "$lib/module/song";

    const { DAN } = Song.CONST;

    let { data } = $props();

    const { daniData, songDatas } = data;

    const lang = getLang();
    let versionI18n = $derived(getI18N("other", $lang).dani.version);
    let titleI18n = $derived(getI18N("other", $lang).title["/dani"]);

    daniData.data.sort((a, b) => {
        return DAN.indexOf(a.dan) - DAN.indexOf(b.dan);
    });
</script>

<PageTitle
    title={versionI18n[$page.url.pathname.split("/")[2]] + " " + titleI18n}
/>
<div class="container">
    {#each daniData.data as dani}
        <DaniDisplay {dani} {songDatas} />
    {/each}
    {#if daniData.data.length % 2 === 1}
        <div class="dummy"></div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;

        row-gap: 20px;
    }

    .dummy {
        width: 400px;
    }

    @media only screen and (max-width: 1000px) {
        .container {
            flex-direction: column;
            justify-content: center;
        }
    }
</style>
