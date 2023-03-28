import React from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { getAssetName } from 'redux/actions/utils';
const Header = () => {
    const router = useRouter();
    const query = router?.query;
    const { t } = useTranslation();
    return (
        <div className="t-common-v2 flex justify-between mb-12">
            <span>{t(`dw_partner:${query?.side?.toLowerCase()}_title`)}</span>

            <ButtonV2
                onClick={() => {
                    router.push(PATHS.WALLET.EXCHANGE.DEPOSIT);
                }}
                className="max-w-[162px] capitalize"
            >
                {t(`common:${query?.side?.toLowerCase()}`)} crypto
            </ButtonV2>
        </div>
    );
};

export default Header;
