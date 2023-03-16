import React from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const Header = () => {
    return (
        <div className="t-common-v2 flex justify-between mb-12">
            <span>Nạp qua DTKD</span>

            <ButtonV2 onClick={() => {}} className="max-w-[162px]">
                Nạp crypto
            </ButtonV2>
        </div>
    );
};

export default Header;
