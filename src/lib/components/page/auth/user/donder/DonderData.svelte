<script lang="ts">
    import type { UserDonderData } from "$lib/module/common/user/types";
    import dayjs from "dayjs";
    import utc from 'dayjs/plugin/utc';
    import timezone from 'dayjs/plugin/timezone'
    import { getTheme } from "$lib/module/layout/theme";
    import { getI18N, getLang } from "$lib/module/common/i18n/i18n";

    dayjs.extend(utc);
    dayjs.extend(timezone);

    export let donderData: UserDonderData;

    export let Container: ConstructorOfATypedSvelteComponent;

    const [theme] = getTheme();
    const timeZone = dayjs.tz.guess();
    const lang = getLang();
    $: i18n = getI18N('/auth/user/donder', $lang);
</script>

<Container>
    <img src={donderData.donder.myDon} alt={i18n.myDon}/>
    <table data-theme={$theme}>
        <tr>
            <td class="taikonumber">
                {donderData.donder.taikoNumber}
            </td>
        </tr>
        <tr>
            <td>
                {donderData.donder.nickname}
            </td>
        </tr>
    </table>
    <div class="last-update">
        {i18n.lastUpdate}: {dayjs(donderData.lastUpdate).tz(timeZone).format("YYYY-MM-DD HH:mm:ss")}
    </div>
</Container>

<style>
    table{
        width: 100%;

        border: 1px solid black;
        border-radius: 6px;
    }

    img{
        width: 100%;
        max-width: 200px;
    }

    td{
        text-align: center;
        padding: 0;
        transform: translateY(-2px);
    }
    tr:nth-child(1) td{
        padding-bottom: 1px;
        border-bottom: 1px solid black;
    }

    table[data-theme="dark"], table[data-theme="dark"] td{
        border-color: #818181;
    }

    .taikonumber{
        font-size: 13px;
    }

    .last-update{
        font-size: 13px;
    }
</style>