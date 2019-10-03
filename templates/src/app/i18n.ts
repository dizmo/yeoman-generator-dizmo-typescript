export type TranslationFunction =
    (key?: string, separator?: string | RegExp) => string | object;

declare const i18n: (
    callback?: (error: any, t: TranslationFunction) => void
) => Promise<TranslationFunction> | void;

export class I18N {
    public static init() {
        return new Promise((resolve, reject) => {
            i18n((error: any, t: TranslationFunction): void => {
                if (t && !error) {
                    resolve(this.translate(t));
                } else {
                    reject(error);
                }
            });
        });
    }
    private static translate(t: TranslationFunction): TranslationFunction {
        const cell = document.getElementsByClassName('table-cell')[0];
        cell.textContent = t('#front/greeting') as string;
        const done = document.getElementById('done');
        done.textContent = t('#back/done') as string;
        return t;
    }
}

export default I18N;
