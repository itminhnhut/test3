import Button from 'components/common/V2/ButtonV2/Button';
import { BxChevronDown, FutureInsurance } from 'components/svg/SvgIcon';
import useInsuranceLoginLink from 'hooks/useInsuranceLoginLink';
import { useTranslation } from 'next-i18next';
import React from 'react';

const InsuranceButton = () => {
    const { t } = useTranslation(['wallet']);
    const { loading, onCreatInsuranceLink } = useInsuranceLoginLink({ params: 'BNBUSDT' });

    return (
        <Button disabled={loading} variants="secondary" className="w-fit px-4 py-3" onClick={onCreatInsuranceLink}>
            <span className="mr-3">
                <FutureInsurance size={24} />
            </span>
            <span className="font-normal !mr-4">{t('wallet:buy_insurance')}</span>
            <BxChevronDown size={24} />
        </Button>
    );
};

export default React.memo(InsuranceButton);
