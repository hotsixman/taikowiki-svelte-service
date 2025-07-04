import { sequence } from "@sveltejs/kit/hooks";
import auth, { providers } from '@sveltekit-board/oauth'

import { config } from 'dotenv';
import { Hooks } from "$lib/module/hooks";

config();

const provider = {
    github: new providers.Github({
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
    }),
    kakao: new providers.Kakao({
        clientId: process.env.KAKAO_CLIENT_ID ?? "",
        clientSecret: process.env.KAKAO_CLIENT_SECRET ?? ""
    }),
    line: new providers.Line({
        clientId: process.env.LINE_CLIENT_ID ?? "",
        clientSecret: process.env.LINE_CLIENT_SECRET ?? ""
    }, ['profile'])
}

const authHandle = auth(Object.values(provider), {
    key: process.env.AUTH_KEY ?? '',
    maxAge: 3600 * 24 * 7,
    autoRefreshMaxAge: true,
    withCredentials: true,
    useSubdomain: true,
    absoluteMaxAge: 3600 * 24 * 30
})

const checkPermission = Hooks.checkPermissions([
    {
        path: '/admin/api',
        level: 9,
        rule: 'startsWith',
    },
    {
        path: '/admin',
        level: 9,
        rule: 'startsWith',
        redirectPath: '/auth/login'
    },
    {
        path: '/auth/user',
        level: 1,
        rule: 'startsWith',
        redirectPath: '/auth/login'
    }
])

const cors = Hooks.allowOrigin("https://donderhiroba.jp", "/", { credentials: true });
const apiCors = Hooks.allowOrigin("*", "/api/v1", { credentials: true });

Array.prototype.toSorted = function (compareFn?: any) {
    return [...this].sort(compareFn);
}

export const handle = sequence(Hooks.checkIp, cors, apiCors, authHandle, Hooks.getUserData, checkPermission, Hooks.setAssetsCacheControl, Hooks.dynamicHtmlLang, Hooks.docRedirect);