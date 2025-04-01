<script lang="ts">
    import { browser } from "$app/environment";
    import { getLang } from "$lib/module/common/i18n/i18n";
    import { onDestroy, onMount } from "svelte";

    let useRotate = $state(localStorage?.useRotate === "false" ? false : true);
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
                } else if (speed > 10000000) {
                    speed = 10000000;
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

    $effect(() => {
        if (browser) {
            if (useRotate) {
                document.body.style.animation = `rotation ${1000000 / speed}s linear infinite`;
            } else {
                document.body.style.animation = "";
            }
        }
    });

    function stopRotate() {
        useRotate = false;
        localStorage.useRotate = "false";
        if (interval) {
            clearInterval(interval);
        }
    }
    function once(fn: any) {
        return function (event: any) {
            //@ts-expect-error
            if (fn) fn.call(this, event);
            fn = null;
        };
    }
    function dbclickify(func: (...args: any[]) => any) {
        let lastClicked: number | null = null;
        return function () {
            if (!lastClicked || Date.now() - lastClicked > 180) {
                lastClicked = Date.now();
            } else {
                //@ts-expect-error
                func.call(this);
                lastClicked = null;
            }
        };
    }
</script>

<svelte:body onclick={once(dbclickify(stopRotate))} />
{@html `
<style>
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    body{
        touch-action: manipulation;
    }
</style>
`}
