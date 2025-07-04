<script lang="ts">
    import { Gamecenter } from "$lib/module/gamecenter";
    import { getI18N, getLang } from "$lib/module/i18n";
    import { getTheme } from "$lib/module/layout/theme";
    import type { Writable } from "svelte/store";
    import GamecenterInfo from "./GamecenterInfo.svelte";
    //@ts-expect-error
    import escape from "regex-escape";
    import { getContext } from "svelte";

    interface Props {
        map: kakao.maps.Map;
        gamecenterMarkers: Record<
            number,
            {
                marker: kakao.maps.Marker;
                iwOpened: boolean;
                iw: kakao.maps.InfoWindow;
            }
        >;
        gamecenterDatas: Gamecenter.Gamecenter[];
        favorites: Writable<number[]>;
        distanceMap: Map<Gamecenter.Gamecenter, number>;
    }

    let {
        map,
        gamecenterMarkers,
        gamecenterDatas = $bindable(),
        favorites,
        distanceMap,
    }: Props = $props();

    //거리순 정렬
    if (distanceMap.size > 0) {
        gamecenterDatas = gamecenterDatas.toSorted((a, b) => {
            const distanceA = distanceMap.get(a);
            const distanceB = distanceMap.get(b);

            if (distanceA === undefined) {
                return 1;
            }
            if (distanceB === undefined) {
                return -1;
            }

            return distanceA - distanceB;
        });
    }

    let filteredGamecenterDatas = $state([...gamecenterDatas]);
    //키워드 검색
    let searchKeyword = $state("");
    let region: "null" | (typeof Gamecenter.CONST.GAMECENTERREGION)[number] = $state("null");
    let amenities: (typeof Gamecenter.CONST.AMENITY)[number][] = $state([]);
    let input: HTMLInputElement | undefined = $state();
    $effect.pre(() => {
        {
            let filteredTemp = gamecenterDatas.filter((data) => {
                return new RegExp(
                    searchKeyword
                        .split(" ")
                        .map((e) => escape(e))
                        .join("(.*?)"),
                ).test(data.name);
            });

            if (region !== "null") {
                filteredTemp = filteredTemp.filter(
                    (data) => data.region === region,
                );
            }

            if (amenities.length > 0) {
                filteredTemp = filteredTemp.filter((data) => {
                    return amenities.every((amenity) => {
                        return data.amenity[amenity] === true;
                    });
                });
            }

            filteredGamecenterDatas = filteredTemp;
        }
    });

    //테마
    const [theme] = getTheme();

    //언어
    const lang = getLang();
    let i18n = $derived(getI18N("/gamecenter", $lang));

    //모바일 사이드
    const mobileAsideOpened = getContext(
        "mobileAsideOpened",
    ) as Writable<boolean>;
</script>

{#snippet searchInput()}
    <input
        class="keyword-input"
        type="text"
        bind:this={input}
        bind:value={searchKeyword}
        placeholder={i18n.keyword}
        data-theme={$theme}
    />
{/snippet}
{#snippet searchRegionOption()}
    <div class="option-container">
        <div class="option-name" data-theme={$theme}>{i18n.region}</div>
        <select bind:value={region} style="height: 20px;">
            <option value="null">{i18n.all}</option>
            {#each Gamecenter.CONST.GAMECENTERREGION as region}
                <option value={region}>{region}</option>
            {/each}
        </select>
    </div>
{/snippet}
{#snippet searchAmenityOption()}
    <div class="option-container">
        <div class="option-name" data-theme={$theme}>
            {i18n.amenityText}
        </div>
        <div class="amenity-container">
            {#each Gamecenter.CONST.AMENITY as amenity}
                <label
                    class="amenity"
                    class:selected={amenities.includes(amenity)}
                >
                    <input
                        type="checkbox"
                        bind:group={amenities}
                        value={amenity}
                    />
                    <span>{i18n.amenity[amenity]}</span>
                </label>
            {/each}
        </div>
    </div>
{/snippet}

<div class="container">
    <div class="search-container" data-theme={$theme}>
        {@render searchInput()}
        <!--옵션-->
        {@render searchRegionOption()}
        {@render searchAmenityOption()}
    </div>
    <!--오락실 정보-->
    <div class="info-container">
        {#each filteredGamecenterDatas as gamecenterData, index}
            <GamecenterInfo
                bind:gamecenterData={filteredGamecenterDatas[index]}
                {favorites}
                distance={distanceMap.get(gamecenterData)}
                clickHandle={() => {
                    const marker = gamecenterMarkers[gamecenterData.order];
                    if (!marker) return;

                    Object.values(gamecenterMarkers).forEach((e) => {
                        e.iwOpened = false;
                        e.iw.close();
                    });

                    marker.iwOpened = true;
                    marker.iw.open(map, marker.marker);

                    map.setCenter(marker.marker.getPosition());

                    $mobileAsideOpened = false;
                }}
            />
        {/each}
    </div>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    .search-container {
        display: flex;
        flex-direction: column;
        row-gap: 8px;

        position: sticky;

        padding-top: 3px;
        top: 0px;

        background-color: white;

        z-index: 1;
    }
    .search-container[data-theme="dark"] {
        background-color: #282828;
    }

    .keyword-input {
        border: 0;
        height: 18px;

        background-color: rgb(229, 229, 229);
    }
    .keyword-input[data-theme="dark"] {
        background-color: black;
        color: white;
    }

    .option-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        min-height: 25px;

        margin-top: 1px;
        margin-bottom: 1px;
    }
    .option-name {
        font-size: 14px;
        color: rgb(82, 82, 82);
        word-break: keep-all;

        margin-right: 5px;
    }
    .option-name[data-theme="dark"] {
        color: rgb(205, 205, 205);
    }

    .amenity-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        column-gap: 2px;
        row-gap: 2px;
    }
    .amenity {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid gray;
        border-radius: 5px;

        padding-inline: 3px;

        cursor: pointer;

        opacity: 0.4;
    }
    .amenity.selected {
        opacity: 1;
    }
    .amenity > input {
        display: none;
    }
    .amenity > span {
        transform: translateY(-1px);
        font-size: 14px;
    }

    .info-container {
        width: 100%;

        margin-top: 7px;

        display: flex;
        flex-direction: column;

        row-gap: 5px;
    }
</style>
