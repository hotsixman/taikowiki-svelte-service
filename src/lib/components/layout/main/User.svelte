<script lang="ts">
    import { getTheme } from "$lib/module/layout/theme";
    import UserItem from "./User-Item.svelte";
    import ThemeToggler from "./ThemeToggler.svelte";
    import LanguageItem from "./LanguageItem.svelte";
    import UserInfo from "./User-Info.svelte";
    import { page } from "$app/stores";
    import { getI18N, getLang } from "$lib/module/i18n";
    import { getContext } from "svelte";

    let opened = $state(false);
    function close() {
        opened = false;
    }

    let itemContainer: HTMLDivElement;
    let container: HTMLDivElement;
    let opener: HTMLDivElement;
    $effect(() => {
        if (itemContainer) {
            if (opened) {
                itemContainer.style.display = "flex";
                itemContainer.focus();
            } else {
                itemContainer.style.display = "none";
            }
        }
    });

    const [theme] = getTheme();

    const usingLangParam = getContext("usingLangParam");
    const lang = getLang();
    let i18n = $derived(getI18N($lang).layout.main.user);

    $effect(() => {
        if ($page.url || $page.state) {
            close();
        }
    });
</script>

<div
    class="container"
    onfocusout={(event) => {
        if (
            event.relatedTarget instanceof Node &&
            itemContainer?.contains(event.relatedTarget)
        )
            return;
        if (event.relatedTarget === opener) {
            return;
        }
        opened = false;
    }}
    bind:this={container}
>
    <div
        class="opener"
        bind:this={opener}
        onclick={() => {
            opened = !opened;
        }}
        role="button"
        tabindex="0"
        onkeydown={() => {}}
    >
        <img src="/assets/icon/user.svg" alt="" />
    </div>
    <div
        class="item-container"
        data-theme={$theme}
        role="button"
        tabindex="0"
        bind:this={itemContainer}
    >
        <UserInfo {close} />
        <UserItem separated height="30px">
            {#snippet left()}
                <span>{i18n.theme}</span>
            {/snippet}
            {#snippet right()}
                <ThemeToggler/>
            {/snippet}
        </UserItem>
        {#if !(usingLangParam && $page.data.isBot)}
            <LanguageItem />
        {/if}
    </div>
</div>

<style>
    .container {
        position: relative;
    }
    .opener {
        width: 20px;
        height: 20px;

        cursor: pointer;
    }
    img {
        filter: invert(100%);
    }

    .item-container {
        width: 220px;

        position: absolute;

        right: -9px;
        top: 35px;

        background-color: white;

        box-sizing: border-box;

        box-shadow: 0px 0px 3px rgb(255, 50, 50);

        z-index: 100;

        display: none;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;

        padding-block: 10px;
    }
    .item-container[data-theme="dark"] {
        box-shadow: 0px 0px 3px black;

        background-color: #1c1c1c;
    }
    .item-container:focus {
        outline: 0;
    }
</style>
