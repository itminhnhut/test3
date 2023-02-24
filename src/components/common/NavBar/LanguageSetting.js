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
        <div
            //  ref={ref}
            className=" flex items-center h-full group mal-navbar__hamburger__spacing "
            //  onClick={toggleOpen}
        >
            <div className="mal-navbar__svg_dominant cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                <SvgGlobe type={2} size={20} color="currentColor" />
            </div>

            {/* <div onClick={onChangeLang} className="cursor-pointer text-dominant uppercase font-semibold hover:opacity-80 transition-opacity">
                {currentLocale}
            </div> */}

            {/* {isOpen && ( */}
            <div className="absolute hidden group-hover:block mt-[1px] bg-white dark:bg-bgTabInactive-dark py-2 border border-t-0 dark:border-divider-dark !min-w-[216px] top-full right-4 rounded-b-xl  ">
                {Object.values(LANGUAGE_TAG).map((lang) => (
                    <button
                        key={lang}
                        disabled={lang === currentLocale}
                        onClick={() => onChangeLang(lang)}
                        className="py-3 w-full cursor-pointer items-center text-textPrimary px-4 flex justify-between dark:hover:bg-hover-dark hover:bg-hover first:mb-3 disabled:cursor-default"
                    >
                        {(lang === LANGUAGE_TAG.EN && 'English') || (lang === LANGUAGE_TAG.VI && 'Tiếng Việt')}
                        {currentLocale === lang && <CheckCircleIcon color="currentColor" size={16} />}
                    </button>
                ))}
            </div>
            {/* )} */}
        </div>
    );
};

export default LanguageSetting;
