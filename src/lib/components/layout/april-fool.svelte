<script lang="ts">
    import { getLang } from "$lib/module/common/i18n/i18n";
    import { onDestroy, onMount } from "svelte";

    let useRotate = $state(
        typeof window === "undefined"
            ? true
            : window.localStorage.getItem("useRotate")
              ? window.localStorage.getItem("useRotate") === "false"
                  ? false
                  : true
              : true,
    );
    let speed = $state(1.01);
    let interval = $state<any>();
    let lang = getLang();

    onMount(() => {
        if (useRotate) {
            if ($lang === "ko") {
                alert("무슨 일이 생기면 화면을 두 번 클릭 또는 터치하세요!");
            } else {
                alert(
                    "If something happens, double-click or touch the screen!",
                );
            }
            interval = setInterval(() => {
                if (speed < 10000000) {
                    speed **= 1.002;
                }
            }, 1);
            document.body.addEventListener(
                "dblclick",
                () => {
                    stopRotate();
                },
                { once: true },
            );
        }
    });
    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });

    let styleText = $derived(`<style>@keyframes rotation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}body {animation: rotation ${1000000 / speed}s linear infinite;}</style>`);

    function stopRotate() {
        useRotate = false;
        window.localStorage.setItem("useRotate", "false");
        if (interval) {
            clearInterval(interval);
        }
    }
</script>

{#if useRotate}
    {#key styleText}
        {@html styleText}
    {/key}
{/if}
