import * as I18next from 'i18next';

export type TranslationFunction = I18next.TranslationFunction;
export type TranslationOptions = I18next.TranslationOptions;

declare const i18n: (
    callback: (error: any, t: TranslationFunction) => void
) => void;

export class I18N {
    public static init(): Promise<TranslationFunction> {
        return new Promise((resolve, reject) => {
            i18n((error: any, t: TranslationFunction): void => {
                if (t && !error) {
                    resolve(this.translate((
                        key: string, options: TranslationOptions = {}
                    ): string => {
                        if (options.keySeparator === undefined) {
                            options.keySeparator = '/';
                        }
                        return t(key, options);
                    }));
                } else {
                    reject(error);
                }
            });
        });
    }
    private static translate(t: TranslationFunction): TranslationFunction {
        const cell = document.getElementsByClassName('table-cell')[0];
        cell.textContent = t('greeting');
        const done = document.getElementById('done');
        done.textContent = t('done');
        return t;
    }
}

export default I18N;
