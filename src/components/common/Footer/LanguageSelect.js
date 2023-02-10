import React, { useRef } from 'react';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import SvgIcon from 'src/components/svg';
import colors from 'styles/colors';
import DropdownContainer from '../DropdownContainer';
import Select from '../input/Select';
import { useClickAway, useToggle } from 'react-use';

const LanguageSelect = ({ t, language }) => {
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
        <div className="flex items-center relative">
            <div className="text-txtSecondary-dark">{t('navbar:menu.lang')}</div>
           
            {/* <LanguageSetting /> */}
            <div onClick={toggleOpen} className="ml-3  font-semibold">{language === LANGUAGE_TAG.EN ? 'English' : 'Tiếng Việt'} </div>
            <SvgIcon name="chevron_down" size={15} className="chevron__down !ml-1" color={colors.grey4} />
            {isOpen && <div ref={ref} className="absolute bg-white dark:bg-bgTabInactive-dark py-2 border border-t-0 dark:border-divider-dark !min-w-[216px] top-full right-4 rounded-xl  ">
                {Object.values(LANGUAGE_TAG).map((lang) => (
                    <button
                        key={lang}
                        disabled={lang === currentLocale}
                        onClick={() => onChangeLang(lang)}
                        className=" w-full cursor-pointer items-center text-textPrimary px-4 flex justify-between dark:hover:bg-hover first:mb-3 disabled:cursor-default"
                    >
                        {(lang === LANGUAGE_TAG.EN && 'English') || (lang === LANGUAGE_TAG.VI && 'Tiếng Việt')}
                        {/* {currentLocale === lang && <CheckCircleIcon color={colors.grey4} size={16} />} */}
                    </button>
                ))}
            </div>}
        </div>
    );
};

export default LanguageSelect;
