import Global from './dizmo/types/global';
declare const global: Global;
import Bundle from './dizmo/types/bundle';
declare const bundle: Bundle;
import Dizmo from './dizmo/types/dizmo';
declare const dizmo: Dizmo;

import { trace } from '@dizmo/functions';
import { I18N } from './i18n';

@trace
export class App {
    public constructor() {
        this.globals();
        this.events();
    }
    private async globals() {
        global.showBack = () => {
            dizmo.showBack();
        };
        global.showFront = () => {
            dizmo.showFront();
        };
        global.T = await I18N.init();
    }
    private events() {
        document.getElementById('done')
            .onclick = this.onClick.bind(this);
    }
    private onClick(ev: MouseEvent) {
        dizmo.showFront();
    }
}

document.addEventListener('dizmoready', () => {
    global.TRACE = bundle.privateStorage.getProperty('TRACE', {
        fallback: false
    });
    global.APP = new App();
}, {
    once: true
});

export default App;
