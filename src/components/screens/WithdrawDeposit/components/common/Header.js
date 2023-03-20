import React from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useRouter } from 'next/router';
import { SIDE } from 'redux/reducers/withdrawDeposit';
const Header = () => {
    const router = useRouter();
    const side = router?.query?.side;
    const isSideBuy = side === SIDE.BUY;
    return (
        <div className="t-common-v2 flex justify-between mb-12">
            <span>{isSideBuy ? 'Nạp' : 'Rút'} qua DTKD</span>

            <ButtonV2
                onClick={() => {
                    router.push(`?side=${isSideBuy ? 'SELL' : 'BUY'}`);
                }}
                className="max-w-[162px]"
            >
                {isSideBuy ? 'Nạp' : 'Rút'} crypto
            </ButtonV2>
        </div>
    );
};

export default Header;
