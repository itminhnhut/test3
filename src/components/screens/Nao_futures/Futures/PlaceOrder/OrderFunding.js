import Modal from 'components/common/ReModal';
import Tooltip from 'components/common/Tooltip';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import Funding from 'components/screens/Futures/Information/Funding';
import useDarkMode from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';

const OrderFunding = ({ symbol }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = React.useState(false);
    const timesync = useSelector((state) => state.utils.timesync);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const context = useContext(AlertContext);

    useEffect(() => {
        const localKey = `notShowFundingWarning:${symbol}`;
        const notShowFundingWarning = localStorage.getItem(localKey);
        if (notShowFundingWarning?.length) {
            if (Number(notShowFundingWarning) >= Date.now()) {
                return;
            } else {
                localStorage.removeItem(localKey);
            }
        }
        const showWarningRate = Math.abs(marketWatch?.[symbol]?.fundingRate * 100) >= 0.5;
        const showWarningTime = (marketWatch?.[symbol]?.fundingTime - Date.now()) / 60000 <= 15;

        const showWarning = showWarningRate && showWarningTime;
        if (showWarning) {
            context.alert?.show(
                'warning',
                t('futures:funding_history_tab:funding_warning'),
                t('futures:funding_history_tab:funding_warning_content'),
                null,
                () => {
                    localStorage.setItem(localKey, (Date.now() + 900000).toString());
                },
                null,
                {
                    hideCloseButton: true,
                    confirmTitle: t('futures:funding_history_tab:funding_warning_accept'),
                    textClassname: '!text-left overflow-y-auto !max-h-[300px] yes-scrollbar',
                    noUseOutside: true
                }
            );
        }
    }, [symbol]);

    useEffect(() => {
        const localKey = `notShowNetworkError`;
        const notShowNetworkError = localStorage.getItem(localKey);
        if (notShowNetworkError?.length) {
            if (Number(notShowNetworkError) >= Date.now()) {
                return;
            } else {
                localStorage.removeItem(localKey);
            }
        }

        const showWarning = true;
        if (showWarning) {
            context.alert?.show(
                'warning',
                t('futures:funding_history_tab:funding_warning'),
                t('futures:funding_history_tab:network_warning_content'),
                null,
                () => {
                    localStorage.setItem(localKey, (Date.now() + 12 * 60 * 60 * 1000).toString());
                },
                null,
                {
                    hideCloseButton: true,
                    confirmTitle: t('futures:funding_history_tab:funding_warning_accept'),
                    textClassname: '!text-left overflow-y-auto !max-h-[300px] yes-scrollbar',
                    noUseOutside: true
                }
            );
        }
    }, []);

    return (
        <>
            {showModal && <ModalFundingRate onClose={() => setShowModal(false)} t={t} symbol={symbol} />}
            <div className="text-xxs space-y-0.5">
                <div className="w-full flex items-center justify-between space-x-2">
                    <span onClick={() => setShowModal(true)} className="text-txtSecondary dark:text-txtSecondary-dark border-b border-darkBlue-5 border-dashed">
                        Funding:
                    </span>
                    <Funding symbol={symbol} />
                </div>
                <div className="w-full flex items-center justify-between space-x-2">
                    <div className="flex items-center" data-tip={t('common:countdown_tooltip')} data-for="tooltip-countdown">
                        <Tooltip
                            id={'tooltip-countdown'}
                            place="top"
                            effect="solid"
                            backgroundColor={colors.darkBlue4}
                            className={`!opacity-100 max-w-[300px] !rounded-lg`}
                            isV3
                            overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
                                const d = document.documentElement;
                                left = Math.min(d.clientWidth - 16 - node.clientWidth, left);
                                top = Math.min(d.clientHeight - node.clientHeight, top);
                                left = Math.max(0, left);
                                top = Math.max(0, top);
                                return { top, left };
                            }}
                        />
                        <span className="text-txtSecondary dark:text-txtSecondary-dark border-b border-darkBlue-5 border-dashed">
                            {t('futures:countdown')}:
                        </span>
                    </div>
                    <Funding.Countdown symbol={symbol} />
                </div>
            </div>
        </>
    );
};

const ModalFundingRate = ({ onClose, t, symbol }) => {
    const router = useRouter();
    const [currentTheme] = useDarkMode();

    const onRedirect = () => {
        router.push(`/${router.locale}/futures/funding-history?theme=${currentTheme}&source=app&symbol=${symbol}`);
        // const uri = `/futures/funding-history?theme=${currentTheme}&source=app&symbol=${symbol}&head=false&title=${t('futures:funding_history')}`;
        // emitWebViewEvent(encodeUrlFromApp(uri));
        // if (onClose) onClose();
    };

    const onDetail = () => {
        // const uri =
        //     router.locale === 'en'
        //         ? `/support/faq/noti-en-announcement/apply-funding-rates-on-nami-futures-and-nao-futures`
        //         : `/vi/support/faq/noti-vi-thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures`;
        // emitWebViewEvent(encodeUrlFromApp(uri + `?theme=${currentTheme}&source=app&head=false&title=Nami FAQ`));
        // if (onClose) onClose();
        const url =
            router.locale === 'en'
                ? '/support/faq/noti-en-announcement/apply-funding-rates-on-nami-futures-and-nao-futures'
                : '/vi/support/faq/noti-vi-thong-bao/ra-mat-co-che-funding-rate-tren-nami-futures-va-nao-futures';
        router.push(url + `?theme=${currentTheme}&source=app&alb=true`);
    };

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}>
            <div className="text-2xl font-semibold text-center">{t('futures:funding_rate')}</div>
            <div className="text-sm pt-4 text-center text-txtSecondary dark:text-txtSecondary-dark">
                {t('futures:funding_rate_des')}{' '}
                <span onClick={onDetail} className="text-teal font-semibold">
                    {t('common:read_more')}
                </span>
            </div>
            <div className="flex items-center space-x-4 pt-8 text-center">
                <div onClick={onClose} className="w-full font-semibold bg-gray-12 dark:bg-dark-2 text-gray-15 dark:text-gray-7 rounded-md px-2 py-3">
                    {t('common:close')}
                </div>
                <div onClick={onRedirect} className="w-full font-semibold bg-bgBtnPrimary text-txtBtnPrimary rounded-md px-2 py-3">
                    {t('futures:funding_history')}
                </div>
            </div>
        </Modal>
    );
};
export default OrderFunding;
