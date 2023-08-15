import CheckBox from 'components/common/CheckBox';
import Button from 'components/common/V2/ButtonV2/Button';
import Spinner from 'components/svg/Spinner';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';
import { LOCAL_STORAGE_KEY } from 'redux/actions/const';

const INITIAL_CHECKED_STATUS = false;

const InsurancePurchaseButton = ({ isPurchaseAble, onBuyInsurance }) => {
    const { t } = useTranslation();
    const [showAlert, setShowAlert] = useState(false);
    const [checked, setChecked] = useState(INITIAL_CHECKED_STATUS);
    const [loadingBuyInsurance, setLoadingBuyInsurance] = useState(false);

    const onBuyInsuranceHandler = async () => {
        setLoadingBuyInsurance(true);
        try {
            await onBuyInsurance();
        } catch (error) {
            console.log('onBuyInsuranceHandler error:', error);
        } finally {
            setLoadingBuyInsurance(false);
        }
    };

    const [buyInsuranceAlertChecked, setBuyInsuranceAlertChecked] = useLocalStorage(LOCAL_STORAGE_KEY.PURCHASE_INSURANCE_ALERT, INITIAL_CHECKED_STATUS);
    return (
        <>
            <Button
                className="w-fit !text-sm !h-9 px-4 py-3 whitespace-nowrap"
                disabled={!isPurchaseAble || loadingBuyInsurance}
                onClick={async () => {
                    if (!isPurchaseAble) return;
                    if (!buyInsuranceAlertChecked) {
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
                title="Mua hợp đồng bảo hiểm vị thế"
                message="Là gợi ý chiến lược quản trị rủi ro cho các vị thế Futures đang được kích hoạt tại Nami Exchange. Ở chế độ này không cho phép bạn chọn cặp giao dịch khác để mua hợp đồng bảo hiểm, và không cho chọn mua hợp đồng Bull hoặc Bear Xem thêm"
            >
                <div className="mt-10 w-full">
                    <CheckBox
                        active={checked}
                        onChange={() => {
                            setChecked(!checked);
                            setBuyInsuranceAlertChecked(!checked);
                        }}
                        boxContainerClassName="!w-6 !h-6"
                        labelClassName="text-base text-txtPrimary dark:text-txtPrimary-dark"
                        label="Không hiện lại thông tin này"
                    />
                    <Button
                        disabled={loadingBuyInsurance}
                        onClick={async () => {
                            await onBuyInsuranceHandler();
                            setShowAlert(false);
                        }}
                        className="mt-6"
                    >
                        {t('futures:insurance.buy_insurance')} {loadingBuyInsurance && <Spinner />}
                    </Button>
                </div>
            </AlertModalV2>
        </>
    );
};

export default InsurancePurchaseButton;
