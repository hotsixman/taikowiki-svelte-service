<script lang="ts" context="module">
    async function save(data: DiffchartData) {
        const response = await diffchartRequestor.save(data)
        if(response.status === 'success'){
            alert("저장 성공");
        }
        else{
            alert("저장 에러");
        }
    }

    async function remove(level:number, type:string){
        const response = await diffchartRequestor.remove({
            level, type
        })
        if(response.status === 'success'){
            alert("삭제 성공");
            location.reload()
        }
        else{
            alert("삭제 에러");
        }
    }
</script>

<script lang="ts">
    import DIffchartEditor from "$lib/components/common/diffchart/DIffchart-Editor.svelte";
    import { diffchartRequestor } from "$lib/module/common/diffchart/diffchart.client";
    import { type DiffchartData } from "$lib/module/common/diffchart/types";
    export let diffchartData: DiffchartData;

    $: diffchartData.name = `${diffchartData.level} level ${diffchartData.type}`;

    let opened = false;
</script>

<tr>
    <td>
        <div class="layer">
            <select bind:value={diffchartData.type}>
                <option value={"clear"}>clear</option>
                <option value={"fullcombo"}>fullcombo</option>
                <option value={"donderfullcombo"}>donderfullcombo</option>
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
            on:click={() => {
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
            on:click={async () => {
                save(diffchartData);
            }}
            >저장하기
        </button>

        <button
            on:click={async () => {
                remove(diffchartData.level, diffchartData.type);
            }}
            >삭제
        </button>
    </td>
</tr>
{#if opened}
    <tr>
        <td colspan="3" style="border: 3px solid red;">
            <DIffchartEditor bind:diffchart={diffchartData.data} />
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
</style>
