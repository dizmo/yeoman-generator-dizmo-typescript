import Global from './dizmo/types/global';
declare const global: Global;
import Bundle from './dizmo/types/bundle';
declare const bundle: Bundle;
import Dizmo from './dizmo/types/dizmo';
declare const dizmo: Dizmo;

import { trace, traceable } from '@dizmo/functions';
import { I18N, TranslationFunction } from './i18n';

@trace
export class App {
    public constructor() {
        this.globals();
        this.events();
    }
    @traceable(false)
    private globals() {
        global.showBack = () => {
            dizmo.showBack();
        };
        global.showFront = () => {
            dizmo.showFront();
        };
    }
    @traceable(false)
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
    I18N.init((t: TranslationFunction) => {
        const cell = document.getElementsByClassName('table-cell')[0];
        cell.textContent = t('greeting');
        const done = document.getElementById('done');
        done.textContent = t('done');

        global.APP = new App();
    });
}, {
    once: true
});

export default App;
