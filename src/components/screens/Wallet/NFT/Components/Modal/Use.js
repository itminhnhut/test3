import { useMemo } from 'react';

import { useTranslation, Trans } from 'next-i18next';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

import { IconClose } from 'components/svg/SvgIcon';

const CATEGORY = {
    1: 'Skynamia Badges',
    2: 'WNFT'
};

const Use = ({ isModal, nameNFT, onCloseModal, statusCodeNFT, onUseSubmit, category }) => {
    const { t } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const renderIcon = useMemo(() => {
        return isDark ? <BxsErrorDarkIcon /> : <BxsErrorIcon />;
    }, [isDark]);

    const renderStatusCode = () => {
        return (
            <>
                {renderIcon}
                <section className="dark:text-gray-4 text-gray-15 text-2xl font-semibold mt-6">{t('nft:warning')}</section>
                {category && (
                    <Trans
                        i18nKey={`nft:status_code:${statusCodeNFT}`}
                        components={[<section className="mt-4 text-center text-gray-1 dark:text-gray-7" />]}
                        values={{ type: CATEGORY[category], nameNFT }}
                    />
                )}
                {statusCodeNFT === 1004 ? (
                    <ButtonV2 className="mt-10" onClick={onUseSubmit}>
                        {t('nft:active:title')}
                    </ButtonV2>
                ) : null}
            </>
        );
    };

    return (
        <ModalV2
            isVisible={isModal}
            onBackdropCb={onCloseModal}
            className="!max-w-[488px] bg-[#ffffff] dark:bg-dark-dark border-divider dark:border-divider-dark"
            wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                        onClick={onCloseModal}
                    >
                        <IconClose />
                    </div>
                </div>
            )}
        >
            <main className="flex flex-col justify-center items-center">{renderStatusCode()}</main>
        </ModalV2>
    );
};

const BxsErrorIcon = ({ size = '80' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.666A3.333 3.333 0 0 0 10 70h60c1.17 0 2.254-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.276L42.948 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.334V30h6.666l.004 16.666h-6.67z"
                fill="#FFC632"
            />
        </svg>
    );
};

const BxsErrorDarkIcon = ({ size = '80' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80" fill="none">
            <path
                d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.666A3.333 3.333 0 0 0 10 70h60c1.17 0 2.254-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.276L42.948 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.334V30h6.666l.004 16.666h-6.67z"
                fill="#FFC632"
            />
        </svg>
    );
};

export default Use;
