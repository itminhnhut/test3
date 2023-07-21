import { useTranslation } from 'next-i18next';
import { SystemInfoCircleFilled } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useEffect, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { ApiStatus } from 'redux/actions/const';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { useRouter } from 'next/router';
import FetchApi from 'utils/fetch-api';
import { PROCESS_AUTO_SUGGEST, SIDE } from 'redux/reducers/withdrawDeposit';
import { API_GET_ORDER_DETAILS, API_PROCESS_AUTO_SUGGEST_ORDER } from 'redux/actions/apis';
import { formatNumber } from 'utils/reference-utils';
import { isString } from 'lodash';
import toast from 'utils/toast';

const PartnerModalDetailsOrderSuggest = ({ showProcessSuggestPartner, onBackdropCb }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [state, setState] = useState({});
    const [loadingProcessOrder, setLoadingProcessOrder] = useState(false);

    const toastError = (statusError = '') => {
        return toast({
            key: `accept_err_suggest_order_${router?.query?.suggest}`,
            text: t(`dw_partner:error.${statusError.toLowerCase().trim()}`, { displayingId: router?.query?.suggest }),
            type: 'error',
            duration: 5000
        });
    };
    const handleAcceptOrder = async () => {
        const { status, data } = await handleProcessOrder(PROCESS_AUTO_SUGGEST.ACCEPTED);
        if (status === ApiStatus.SUCCESS) {
            onBackdropCb();
            router.push(`/partner-dw/details/${state.displayingId}`);
        } else {
            toastError(status);
        }
    };

    const handleProcessOrder = async (status) => {
        setLoadingProcessOrder(true);
        try {
            return await FetchApi({
                url: API_PROCESS_AUTO_SUGGEST_ORDER,
                options: {
                    method: 'POST'
                },
                params: {
                    displayingId: state.displayingId,
                    status
                }
            });
        } catch (error) {
        } finally {
            setLoadingProcessOrder(false);
        }
    };

    useEffect(() => {
        return () => {
            handleProcessOrder(PROCESS_AUTO_SUGGEST.REJECTED);
        };
    }, []);

    useEffect(() => {
        setLoadingProcessOrder(false);
        if (!showProcessSuggestPartner) return;
        if (isString(showProcessSuggestPartner))
            FetchApi({
                url: API_GET_ORDER_DETAILS,
                options: { method: 'GET' },
                params: {
                    displayingId: showProcessSuggestPartner
                }
            }).then(({ data, status }) => {
                if (status === ApiStatus.SUCCESS) {
                    setState(data);
                } else {
                    toastError(status);
                }
            });
        else {
            setState(showProcessSuggestPartner);
        }
    }, [showProcessSuggestPartner]);

    const handleCloseModal = () => {
        handleProcessOrder(PROCESS_AUTO_SUGGEST.REJECTED);
        onBackdropCb();
    };

    return (
        <>
            <ModalV2
                // loading={loadingProcessOrder}
                isVisible={showProcessSuggestPartner}
                onBackdropCb={handleCloseModal}
                canBlur={false}
                // isVisible={true}
                className="!max-w-[488px]"
                // wrapClassName="p-8 flex flex-col items-center txtSecond-4 "
            >
                <div id={`suggest_order_${state.displayingId}`} className="flex flex-col items-center w-full">
                    <SystemInfoCircleFilled />
                    <h1 className="txtPri-3 mt-6 text-center">{t('dw_partner:partner_suggest_order_title')}</h1>
                    <span className="txtSecond-4 mt-4 mb-10 text-center">{t('dw_partner:partner_suggest_order_subtitle')}</span>
                </div>

                <div className="flex flex-col gap-y-3 w-full txtPri-2 !font-semibold">
                    <div className="flex justify-between">
                        <span className="txtSecond-4">{t('dw_partner:transaction_type')}</span>
                        <span className={state.side === SIDE.BUY ? 'text-green-3 dark:text-green-2' : 'text-red'}>
                            {state.side ? t(`common:${state.side?.toLowerCase()}`) : '_'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="txtSecond-4">{t('common:amount')}</span>
                        <span>
                            {state.baseQty
                                ? `${formatNumber(state.baseQty, state.baseAssetId === 72 ? 0 : 4)} ${state.baseAssetId === 72 ? 'VNDC' : 'USDT'}`
                                : '_'}
                        </span>
                    </div>
                    {state.fee > 0 && (
                        <div className="flex justify-between">
                            <span className="txtSecond-4">{t('dw_partner:fee_received')}</span>
                            <span>{`${formatNumber(state.fee)} VND`}</span>
                        </div>
                    )}
                    {state.transferMetadata?.bankName && (
                        <div className="flex justify-between">
                            <span className="txtSecond-4">{t('dw_partner:bank')}</span>
                            <span className="max-w-[280px] truncate">{state.transferMetadata?.bankName}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="txtSecond-4">{t('dw_partner:user')}</span>
                        <div>
                            <div className="text-right">{state.userMetadata?.name || '_'}</div>
                            <div className="text-right txtSecond-3">{state.userMetadata?.code}</div>
                        </div>
                    </div>
                </div>
                <ButtonV2 loading={loadingProcessOrder} disabled={loadingProcessOrder} className="mt-10" onClick={handleAcceptOrder}>
                    {t('dw_partner:btn_accept')}
                </ButtonV2>
            </ModalV2>
            {/* <AlertModalV2
                isVisible={isFailAccept}
                onClose={() => {
                    setIsFailAccept('');
                    setTimeout(() => {
                        onBackdropCb();
                    }, 200);
                }}
                type="warning"
                title={t('common:failure')}
                message={isFailAccept}
                isButton={false}
            /> */}
        </>
    );
};

export default PartnerModalDetailsOrderSuggest;
