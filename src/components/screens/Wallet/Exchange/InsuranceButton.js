import Button from 'components/common/V2/ButtonV2/Button';
import { BxChevronDown, FutureInsurance } from 'components/svg/SvgIcon';
import useInsuranceLoginLink from 'hooks/useInsuranceLoginLink';
import { useTranslation } from 'next-i18next';
import React from 'react';

const InsuranceButton = () => {
    const { t } = useTranslation(['wallet']);
    const { loading, onCreatInsuranceLink } = useInsuranceLoginLink({ params: 'BNBUSDT', targetType: '_blank' });

    return (
        <Button disabled={loading} variants="secondary" className=" w-fit px-4 py-3" onClick={onCreatInsuranceLink}>
            <div className="flex items-center space-x-3">
                <span className="">
                    <FutureInsurance size={24} />
                </span>
                <span className="font-normal text-sm text-txtPrimary dark:text-txtPrimary-dark">{t('wallet:buy_insurance')}</span>
            </div>
            <div className="!ml-4">
                <BxChevronDown size={24} />
            </div>
        </Button>
    );
};

export default React.memo(InsuranceButton);
