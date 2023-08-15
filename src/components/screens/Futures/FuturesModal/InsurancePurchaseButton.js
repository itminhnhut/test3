import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import Spinner from 'components/svg/Spinner';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { Trans, useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { LOCAL_STORAGE_KEY } from 'redux/actions/const';
import Link from 'next/link';

const INITIAL_CHECKED_STATUS = {
    termOfUse: false,
    privatePolicy: false
};

const DETAIL_LINKS = {
    TERM_OF_USE: {
        vi: 'https://docs.namiinsurance.io/v/vietnamese/dieu-khoan/dieu-khoan-su-dung',
        en: 'https://docs.namiinsurance.io/terms-of-service/terms-of-use'
    },
    PRIVATE_POLICY: {
        vi: 'https://docs.namiinsurance.io/v/vietnamese/dieu-khoan/chinh-sach-quyen-rieng-tu',
        en: 'https://docs.namiinsurance.io/terms-of-service/private-policy'
    }
};

const InsurancePurchaseButton = ({ isPurchaseAble, onBuyInsurance }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [checked, setChecked] = useState(INITIAL_CHECKED_STATUS);
    const [loadingBuyInsurance, setLoadingBuyInsurance] = useState(false);
    const [insuranceAlertAccepted, setLSInsuranceAlertAccepted] = useLocalStorage(LOCAL_STORAGE_KEY.ACCEPT_PURCHASE_INSURANCE_ALERT, false);

    const onBuyInsuranceHandler = async () => {
        setLoadingBuyInsurance(true);
        try {
            await onBuyInsurance();
            setLSInsuranceAlertAccepted(true);
        } catch (error) {
        } finally {
            setLoadingBuyInsurance(false);
        }
    };

    const allowAlertBuyInsurance = useMemo(() => Object.keys(checked).reduce((boolean, key) => boolean && checked[key], true), [checked]);

    return (
        <>
            <Button
                className="w-fit !text-sm !h-9 px-4 py-3 whitespace-nowrap"
                disabled={!isPurchaseAble || loadingBuyInsurance}
                onClick={async () => {
                    if (!isPurchaseAble) return;
                    if (!insuranceAlertAccepted) {
                        setShowAlert(true);
                        return;
                    }

                    await onBuyInsuranceHandler();
                }}
            >
                {t('futures:insurance.buy_insurance')} {loadingBuyInsurance && <Spinner />}
            </Button>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type="info"
                title={t('futures:insurance.buy_insurance_alert.title')}
                messageClassName="w-full"
                message={
                    <div className="text-left space-y-4 w-full">
                        <div className="">{t('futures:insurance.buy_insurance_alert.message')}</div>

                        <CheckBox
                            active={checked.termOfUse}
                            onChange={() => {
                                setChecked((prev) => ({ ...prev, termOfUse: !checked.termOfUse }));
                            }}
                            boxContainerClassName="!w-6 !h-6 min-w-[24px] max-w-[24px]"
                            labelClassName="text-base "
                            className="!w-auto"
                            label={
                                <Trans i18nKey="futures:insurance.buy_insurance_alert.insurance_term_of_use">
                                    <div />
                                    <a
                                        target="_blank"
                                        href={DETAIL_LINKS.TERM_OF_USE?.[language]}
                                        className="text-teal font-semibold duration-75 hover:text-teal/75"
                                    />
                                </Trans>
                            }
                        />

                        <CheckBox
                            active={checked.privatePolicy}
                            onChange={() => {
                                setChecked((prev) => ({ ...prev, privatePolicy: !checked.privatePolicy }));
                            }}
                            boxContainerClassName="!w-6 !h-6 min-w-[24px] max-w-[24px]"
                            labelClassName="text-base "
                            className="!w-auto"
                            label={
                                <Trans i18nKey="futures:insurance.buy_insurance_alert.insurance_privacy_policy">
                                    <div className="" />
                                    <a
                                        target="_blank"
                                        href={DETAIL_LINKS.PRIVATE_POLICY?.[language]}
                                        className="text-teal font-semibold duration-75 hover:text-teal/75"
                                    />
                                </Trans>
                            }
                        />
                    </div>
                }
            >
                <div className="mt-10 w-full">
                    <Button
                        disabled={loadingBuyInsurance || !allowAlertBuyInsurance}
                        onClick={async () => {
                            await onBuyInsuranceHandler();
                            setShowAlert(false);
                        }}
                    >
                        {t('futures:insurance.buy_insurance_alert.buy_now')} {loadingBuyInsurance && <Spinner />}
                    </Button>
                </div>
            </AlertModalV2>
        </>
    );
};

export default InsurancePurchaseButton;
