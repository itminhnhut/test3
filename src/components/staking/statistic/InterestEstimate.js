import React, { useMemo, useState } from 'react';
import { HideIcon, SeeIcon } from 'components/svg/SvgIcon';
import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

const InterestEstimate = ({ assetId }) => {
    const [isHideBalance, setIsHideBalance] = useState(false);
    const assetBalance = useSelector((state) => state.wallet?.SPOT) || [];

    return (
        <div className="rounded-xl p-8 bg-bgContainer dark:bg-bgContainer-dark">
            <div className="text-txtSecondary dark:text-txtSecondary-dark flex items-center space-x-3 mb-[50px]">
                <div>Tài sản khả dụng</div>
                <div className="w-6 h-6 flex items-center" onClick={() => setIsHideBalance((prev) => !prev)}>
                    {isHideBalance ? <HideIcon size={24} /> : <SeeIcon size={24} />}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="p-[14px] rounded-full">
                        <Image src={getS3Url('/images/staking/ic_staking.png')} width={36} height={36} />
                    </div>
                    <div>{assetBalance?.[+assetId]?.value} VNDC</div>
                </div>
            </div>
        </div>
    );
};

export default InterestEstimate;
