import React from 'react';
import SvgGlobe from 'components/svg/Globe';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';

const LanguageSetting = () => {
    const [currentLocale, onChangeLang] = useLanguage();

    return (
        <div className=" flex items-center group mal-navbar__hamburger__spacing relative">
            <div className="mal-navbar__svg_dominant cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                <SvgGlobe type={2} size={20} color="currentColor" />
            </div>

            <div className="absolute hidden group-hover:block top-full pt-[29px] right-0 ">
                <div className=" mt-[1px] bg-white  dark:bg-bgTabInactive-dark py-2 border border-t-0 dark:border-divider-dark !min-w-[216px] rounded-b-xl  ">
                    {Object.values(LANGUAGE_TAG).map((lang) => (
                        <button
                            key={lang}
                            disabled={lang === currentLocale}
                            onClick={() => onChangeLang(lang)}
                            className="py-3 w-full cursor-pointer items-center text-textPrimary px-4 flex justify-between dark:hover:bg-hover-dark hover:bg-hover first:mb-3 disabled:cursor-default active:bg-bgBtnV2-tonal_pressed dark:active:bg-bgBtnV2-tonal_dark_pressed"
                        >
                            {(lang === LANGUAGE_TAG.EN && 'English') || (lang === LANGUAGE_TAG.VI && 'Tiếng Việt')}
                            {currentLocale === lang && <CheckCircleIcon color="currentColor" size={16} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSetting;
