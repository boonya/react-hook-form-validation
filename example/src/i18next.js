import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const LS_LANGUAGE_KEY = 'lng';
export const LS_DEBUG_TRANSLATIONS_KEY = 'translations:debug';

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGES = ['en', 'ru', 'uk'];

export default async function createI18Next(appPrefix, initProps) {
	const BASE_PATH = appPrefix.replace(/^\/?(.*)\/?$/u, '$1');
	const debug = Boolean(localStorage.getItem(LS_DEBUG_TRANSLATIONS_KEY));

	const languageDetector = new LanguageDetector(null, {
		lookupLocalStorage: LS_LANGUAGE_KEY,
	});

	const i18n = i18next.createInstance();
	i18n
		.use(initReactI18next)
		.use(languageDetector)
		.use(HttpApi)
		.init({
			interpolation: {escapeValue: false},
			ns: ['common'],
			defaultNS: 'common',
			backend: {
				loadPath: `/${BASE_PATH}/locales/{{lng}}/{{ns}}.json`,
			},
			supportedLngs: LANGUAGES,
			fallbackLng: debug ? undefined : DEFAULT_LANGUAGE,
			debug,
			...initProps,
		});
	return i18n;
}
