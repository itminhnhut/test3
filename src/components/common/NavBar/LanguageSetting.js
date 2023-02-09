import React, { useRef } from 'react';
import SvgGlobe from 'components/svg/Globe';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useClickAway, useHoverDirty, useToggle } from 'react-use';
import colors from 'styles/colors';

const LanguageSetting = () => {
    const [isOpen, toggleOpen] = useToggle(false);

    const ref = useRef(null);

    // const isHovering = useHoverDirty(ref);
    const [currentLocale, onChangeLang] = useLanguage();

    useClickAway(ref, () => {
        if (isOpen) {
            toggleOpen();
        }
    });

    return (
        <div className="mal-navbar__hamburger__spacing flex items-center h-full" onClick={toggleOpen}>
            <a href="#" className="mal-navbar__svg_dominant">
                <SvgGlobe size={20} />
            </a>

            {isOpen && <div ref={ref} className="absolute bg-white dark:bg-bgTabInactive-dark py-2 border border-t-0 dark:border-divider-dark !min-w-[216px] top-full right-4 rounded-b-xl  ">
                {Object.values(LANGUAGE_TAG).map((lang) => (
                    <button
                        key={lang}
                        disabled={lang === currentLocale}
                        onClick={() => onChangeLang(lang)}
                        className="py-3 w-full cursor-pointer items-center text-textPrimary px-4 flex justify-between dark:hover:bg-hover first:mb-3 disabled:cursor-default"
                    >
                        {(lang === LANGUAGE_TAG.EN && 'English') || (lang === LANGUAGE_TAG.VI && 'Tiếng Việt')}
                        {currentLocale === lang && <CheckCircleIcon color={colors.grey4} size={16} />}
                    </button>
                ))}
            </div>}
        </div>
    );
};

export default LanguageSetting;
