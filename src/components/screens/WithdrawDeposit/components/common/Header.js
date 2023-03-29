import React from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { ArrowForwardIcon } from 'components/svg/SvgIcon';
import { SIDE } from 'redux/reducers/withdrawDeposit';
const Header = () => {
    const router = useRouter();
    const { side, assetId } = router?.query;
    const { t } = useTranslation();
    return (
        <div className="t-common-v2 flex justify-between mb-12">
            <span>{t(`dw_partner:${side?.toLowerCase()}_title`)}</span>

            <ButtonV2
                onClick={() => {
                    side === SIDE.SELL ? router.push(PATHS.WALLET.EXCHANGE.DEPOSIT) : router.push(PATHS.WALLET.EXCHANGE.WITHDRAW);
                }}
                className="max-w-[162px] capitalize items-center"
            >
                <div className="flex items-center">{t(`common:${side?.toLowerCase()}`)} crypto</div>
                <ArrowForwardIcon color="currentColor" size={16} />
            </ButtonV2>
        </div>
    );
};

export default Header;
