import { useRouter } from "next/router";

export const LANGUAGE_TAG = {
    VI: "vi",
    EN: "en",
};

const useLanguage = () => {
    const { locale: currentLocale, route, query, push } = useRouter();

    // Language toggle
    const onChangeLang = () => {
        const nextLang =
            currentLocale === LANGUAGE_TAG.VI
                ? LANGUAGE_TAG.EN
                : LANGUAGE_TAG.VI;
        if (route === "/trade/[id]") {
            push(`/trade/${query?.id}`, undefined, { locale: nextLang });
        } else {
            push(route, query, { locale: nextLang });
        }
    };

    return [currentLocale, onChangeLang];
};

export default useLanguage;
