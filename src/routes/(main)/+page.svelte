<script lang="ts">
    import PageTitle from "$lib/components/common/PageTitle.svelte";
    import MainBanner from "$lib/components/page/(index)/MainBanner.svelte";
    import MainNotice from "$lib/components/page/(index)/MainNotice.svelte";
    import MainSearch from "$lib/components/page/(index)/MainSearch.svelte";
    import MainShortcut from "$lib/components/page/(index)/MainShortcut.svelte";
    import { Util } from "$lib/module/util";

    let { data } = $props();

    const { Center } = Util.Styled;
</script>

<PageTitle />
<Center>
    <MainSearch />
    <MainShortcut />
    <MainBanner banners={data.mainBanners} />
    <MainNotice notices={data.recentNotices} />
</Center>
