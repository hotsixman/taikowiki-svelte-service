<script>
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { getContext, onMount } from "svelte";

    /**@type {import('svelte/store').Writable<{ logined: boolean; nickname: string; UUID: string | null }>}*/
    const user = getContext("user");

    onMount(() => {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", "GTM-PPRX86P3");
    });

    afterNavigate((nav) => {
        window.gtag?.("set", "G-S8TRY8QPYG", {
            user_id: $user.UUID ?? "null",
            uuid: $user.UUID ?? "null",
        });
        window.gtag?.("set", "uuid", {
            uuid: user.UUID ?? "null",
        });
        window.gtag?.("config", "G-S8TRY8QPYG", {
            page_title: document.title,
            page_path: nav.to.url.pathname,
            user_id: $user.UUID ?? "null",
            uuid: $user.UUID ?? "null",
        });
    });
</script>

<svelte:head>
    <meta name="google-adsense-account" content="ca-pub-1629193017650416" />
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-S8TRY8QPYG"
    ></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
    </script>
</svelte:head>
