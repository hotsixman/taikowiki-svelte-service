<script lang="ts" module>
    async function save(data: Diffchart.DiffchartData) {
        const response = await Diffchart.Client.request.save(data);
        if (response.status === "success") {
            alert("저장 성공");
        } else {
            alert("저장 에러");
        }
    }

    async function remove(level: number, type: string) {
        const response = await Diffchart.Client.request.remove({
            level,
            type,
        });
        if (response.status === "success") {
            alert("삭제 성공");
            location.reload();
        } else {
            alert("삭제 에러");
        }
    }
</script>

<script lang="ts">
    import { Diffchart } from "$lib/module/diffchart";
    import DiffchartEditor from "../../../common/diffchart/DiffchartEditor.svelte";
    import "$lib/module/diffchart/diffchart.client";

    interface Props {
        diffchartData: Diffchart.DiffchartData;
    }

    let { diffchartData }: Props = $props();

    $effect.pre(() => {
        diffchartData.name = `${diffchartData.level} level ${diffchartData.type}`;
    })

    let opened = $state(false);
    let commentOpened = $state(false);
</script>

<tr>
    <td>
        <div class="layer">
            <select bind:value={diffchartData.type}>
                <option value={"clear"}>clear</option>
                <option value={"fc"}>fullcombo</option>
                <option value={"dfc"}>donderfullcombo</option>
            </select>
        </div>
    </td>
    <td>
        <div class="layer">
            <input
                bind:value={diffchartData.level}
                type="number"
                min="1"
                max="10"
            />
        </div>
    </td>
    <td>
        <button
            onclick={() => {
                opened = !opened;
            }}
        >
            {#if opened}
                접기
            {:else}
                펼치기
            {/if}
        </button>

        <button
            onclick={() => {
                commentOpened = !commentOpened;
            }}
        >
            {#if commentOpened}
                코멘트 접기
            {:else}
                코멘트 펼치기
            {/if}
        </button>

        <button
            onclick={async () => {
                save(diffchartData);
            }}
            >저장하기
        </button>

        <button
            onclick={async () => {
                remove(diffchartData.level, diffchartData.type);
            }}
            >삭제
        </button>
    </td>
</tr>
{#if commentOpened}
    <tr>
        <td> 코멘트 </td>
        <td colspan="2">
            <textarea bind:value={diffchartData.comment}></textarea>
        </td>
    </tr>
{/if}
{#if opened}
    <tr>
        <td colspan="3" style="border: 3px solid red; text-align: unset;">
            <DiffchartEditor bind:diffchart={diffchartData.data} />
        </td>
    </tr>
{/if}

<style>
    td {
        border: 1px solid black;
        text-align: center;
    }

    .layer {
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    textarea {
        width: 100%;
    }
</style>
