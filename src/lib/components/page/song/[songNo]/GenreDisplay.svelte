<script lang="ts">
    import { Song } from "$lib/module/song";
    import { Util } from "$lib/module/util";
    import { getI18N, getLang } from "$lib/module/i18n";
    import { getIsMobile } from "$lib/module/layout/isMobile";

    interface Props {
        genres: Song.Genre[];
    }

    let { genres }: Props = $props();

    const isMobile = getIsMobile();
    const lang = getLang();
    let i18n = $derived(getI18N("/song/[songNo]", $lang));
</script>

<div class="container">
    {#each genres as genre}
        <a
            class="item"
            style={`background-color:${Util.Color.genre[genre]};`}
            data-isMobile={$isMobile}
            href={`/song?genre=${genre}`}
        >
            {#if !$isMobile}
                {i18n.genres[genre]}
            {/if}
        </a>
    {/each}
</div>

<style>
    .container {
        display: flex;
        column-gap: 10px;
    }

    .item {
        padding-inline: 5px;

        border-radius: 5px;

        font-weight: bold;

        display: flex;
        justify-content: center;
        align-items: center;

        color: white;
        text-decoration: none;
    }

    .item[data-isMobile="true"] {
        width: 40px;
        height: 8px;
    }
</style>
