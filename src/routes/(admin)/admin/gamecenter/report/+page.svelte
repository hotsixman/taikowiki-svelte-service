<script lang="ts">
    export let data;
    const { reports } = data;
</script>

<a href="/admin/gamecenter"> 돌아가기 </a>
<table>
    <tr>
        <th> order </th>
        <th> 이름 </th>
        <th> UUID </th>
        <th> ip </th>
        <th> 검토 </th>
    </tr>
    {#each reports as report}
        <tr>
            <td>
                {report.order}
            </td>
            <td>
                {report.data.name}
            </td>
            <td>
                {report.UUID}
            </td>
            <td>
                {report.ip}
            </td>
            <td>
                <a href={`/admin/gamecenter/report/${report.order}`}>
                    검토하기
                </a>
            </td>
        </tr>
    {/each}
</table>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    td {
        border: 1px solid black;
        text-align: center;
    }
</style>
