import { useWindowSize } from 'utils/customHooks';
import { memo, useCallback, useState } from 'react';

import PocketFooter from 'src/components/common/Footer/PocketFooter';
import useApp from 'hooks/useApp';
import { useSelector } from 'react-redux';
import { getS3Url } from 'redux/actions/utils';
import SocialsLink from './SocialsLink';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Image from 'next/image';

import LanguageSelect from './LanguageSelect';
import { useTranslation } from 'next-i18next';

const Footer = memo(() => {
    // * Initial State
    const [state, set] = useState({
        active: {}
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const { user: auth } = useSelector((state) => state.auth) || null;
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common']);

    // * Use Hooks
    const { width } = useWindowSize();
    const isApp = useApp();
    const [currentTheme] = useDarkMode();

    const MobileCopyright = useCallback(
        () => (
            <div className="px-4">
                <div className="flex justify-between items-center mb-8">
                    <div className="">
                        <Image
                            // src={getS3Url('/images/logo/nami-logo-v2.png')}
                            src={getS3Url(`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`)}
                            width={113}
                            height={36}
                            alt="Nami Exchange"
                        />
                    </div>
                    <LanguageSelect t={t} language={language} currentTheme={currentTheme} />
                </div>
                <div style={{ fontSize: 12 }} className="font-medium text-gray-1 dark:text-gray-2">
                    Copyright © 2020 Nami Corporation. All rights reserved.
                </div>
            </div>
        ),
        [t, language, currentTheme]
    );

    const DesktopNotAuthSocial = useCallback(
        () => (
            <>
                <div className="flex justify-between items-center mb-6">
                    <div className="">
                        {/*  */}
                        <Image
                            // src={getS3Url('/images/logo/nami-logo-v2.png')}
                            src={getS3Url(`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`)}
                            width={251}
                            height={80}
                            alt="Nami Exchange"
                        />
                    </div>
                    <SocialsLink language={language} />
                    <LanguageSelect t={t} language={language} currentTheme={currentTheme} />
                </div>
                <hr className="border-divider dark:border-divider-dark mb-6" />
                <div className="font-medium text-gray-2 mt-6 text-center text-sm">Copyright © 2020 Nami Corporation. All rights reserved.</div>
            </>
        ),
        [t, language, currentTheme]
    );
    
    if (isApp) return null;
    return (
        <section className="mal-footer border-t border-divider dark:border-divider-dark">
            <div className={`${width >= 1200 ? 'mal-footer___desktop ' : ''}  mal-footer__wrapper  mal-container`}>
                <PocketFooter currentTheme={currentTheme} t={t} language={language} auth={auth} width={width} active={state.active} parentState={setState} />
                {!auth ? (
                    <div>
                        <hr className="border-divider dark:border-divider-dark mb-6" />

                        {width >= 1200 ? <DesktopNotAuthSocial /> : <MobileCopyright />}
                    </div>
                ) : (
                    <>
                        <hr className="border-divider dark:border-divider-dark" />
                        {width > 1200 ? (
                            <>
                                <div className="flex justify-between items-center mt-10 mb-6">
                                    <div className="font-medium text-gray-1 dark:text-txtSecondary-dark text-sm text-center">
                                        Copyright © 2020 Nami Corporation. All rights reserved.
                                    </div>
                                    <LanguageSelect t={t} language={language} currentTheme={currentTheme} />
                                </div>{' '}
                            </>
                        ) : (
                            <div className="mt-6">
                                <MobileCopyright />
                            </div>
                        )}
                    </>
                )}
                {/* {width < 1200 && (
                    <div style={{ fontSize: 12 }} className="font-medium text-gray-2 mt-6">
                        Copyright © 2020 Nami Corporation. All rights reserved.
                    </div>
                )} */}
            </div>
        </section>
    );
});

export default Footer;
