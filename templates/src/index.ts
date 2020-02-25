/* eslint @typescript-eslint/explicit-function-return-type: 0 */
/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Global } from "@dizmo/types";
declare const global: Global;
import { Dizmo } from "@dizmo/types";
declare const dizmo: Dizmo;

global.showBack = () => {
    dizmo.showBack();
};
global.showFront = () => {
    dizmo.showFront();
};

global.i18n((error: any, t: (key: string) => string | object) => {
    const cell = document.getElementsByClassName("table-cell")[0];
    cell.textContent = t("#front/greeting") as string;
    const done = document.getElementById("done") as HTMLElement;
    done.textContent = t("#back/done") as string;
});

document.addEventListener("dizmoready", () => {
    const done = document.getElementById("done") as HTMLElement;
    done.onclick = () => dizmo.showFront();
}, {
    once: true,
});
