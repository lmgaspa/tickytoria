import { createI18n } from 'vue-i18n';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('locale') || 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        'pt-BR': ptBR,
        'en-US': enUS,
        'es-ES': esES
    }
});
export default i18n;
