import React, { useRef } from 'react';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import SvgIcon from 'src/components/svg';
import colors from 'styles/colors';
import { THEME_MODE } from 'hooks/useDarkMode';
import { CheckCircleIcon } from '../../svg/SvgIcon';

const LanguageSelect = ({ t, language, currentTheme }) => {
    const ref = useRef(null);

    const [currentLocale, onChangeLang] = useLanguage();

    return (
        <div ref={ref} className="flex group items-center relative">
            <div className="text-gray-1 dark:text-txtSecondary-dark">{t('navbar:menu.lang')}</div>

            <div className="flex items-center ml-3">
                <div className="font-semibold">{language === LANGUAGE_TAG.EN ? 'English' : 'Tiếng Việt'} </div>
                <SvgIcon
                    name="chevron_down"
                    size={16}
                    className="group-hover:rotate-[360deg]"
                    color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue}
                />
            </div>

            <div className="absolute group-hover:block hidden bg-white dark:bg-bgTabInactive-dark py-2 border border-t-0 dark:border-divider-dark !min-w-[216px] top-full right-0 rounded-xl  ">
                {Object.values(LANGUAGE_TAG).map((lang) => (
                    <button
                        key={lang}
                        disabled={lang === currentLocale}
                        onClick={() => onChangeLang(lang)}
                        className=" w-full cursor-pointer items-center text-textPrimary px-4 flex justify-between dark:hover:bg-hover-dark hover:bg-hover first:mb-3 disabled:cursor-default"
                    >
                        {(lang === LANGUAGE_TAG.EN && 'English') || (lang === LANGUAGE_TAG.VI && 'Tiếng Việt')}
                        {currentLocale === lang && <CheckCircleIcon color={colors.gray[4]} size={16} />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelect;
