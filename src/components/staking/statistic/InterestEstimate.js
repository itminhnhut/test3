import React, { useCallback, useMemo, useState } from 'react';
import { HideIcon, SeeIcon } from 'components/svg/SvgIcon';
import Image from 'next/image';
import { formatNumber, getLoginUrl, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PARTNER_WD_TABS, PATHS } from 'constants/paths';
import { SECRET_STRING } from 'utils';
import styled from 'styled-components';

const InterestEstimate = ({ assetId }) => {
    const [isHideBalance, setIsHideBalance] = useState(false);
    const assetBalance = useSelector((state) => state.wallet?.SPOT) || null;
    const auth = useSelector((state) => state.auth?.user);

    const router = useRouter();

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];

    const asset = useMemo(() => {
        return assetConfigs.find((asset) => asset.id === assetId);
    }, [assetConfigs, assetId]);

    const renderAvailableBalance = useCallback(
        () => (
            <Card>
                <div className="text-txtSecondary dark:text-txtSecondary-dark flex items-center space-x-3 mb-[50px]">
                    <div>Tài sản khả dụng</div>
                    <div className="w-6 h-6 flex items-center cursor-pointer" onClick={() => setIsHideBalance((prev) => !prev)}>
                        {isHideBalance ? <HideIcon size={24} /> : <SeeIcon size={24} />}
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="p-[14px] flex items-center justify-center rounded-full bg-gray-12 dark:bg-dark-2">
                            <Image src={getS3Url('/images/staking/ic_staking.png')} width={36} height={36} />
                        </div>
                        <div className="space-y-1 ">
                            <div className="text-4xl font-semibold">
                                {isHideBalance ? SECRET_STRING : formatNumber(assetBalance?.[asset?.id]?.value - assetBalance?.[asset?.id]?.locked_value)}{' '}
                                {asset?.assetCode}
                            </div>
                            <div>
                                Lãi suất: <span className="text-teal font-semibold">12.79%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        {!auth ? (
                            <a
                                href={getLoginUrl('sso', 'login', {
                                    redirect: `${process.env.NEXT_PUBLIC_API_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${
                                        PATHS.WITHDRAW_DEPOSIT.PARTNER
                                    }?side=BUY&assetId=${assetId}`
                                })}
                            >
                                <ButtonV2 className="w-[120px]">Nạp</ButtonV2>
                            </a>
                        ) : (
                            <Link className="w-full" href={`${PATHS.WITHDRAW_DEPOSIT.PARTNER}?side=BUY&assetId=${assetId}`}>
                                <ButtonV2 className="w-[120px]">Nạp</ButtonV2>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>
        ),
        [auth, isHideBalance, asset, assetBalance]
    );

    const renderDayInterestCard = useCallback(() => {
        return (
            <Card>
                <div className="mb-4 text-txtSecondary dark:text-txtSecondary-dark">
                    Lãi suất: <span className="text-teal font-semibold">12.79%</span>
                </div>
                <div className="text-2xl">

                </div>
            </Card>
        );
    }, []);
    return (
        <div className="flex flex-wrap -m-3">
            <div className="w-full p-3">{renderAvailableBalance()}</div>
            <div className="w-1/2 p-3">{renderDayInterestCard()}</div>
        </div>
    );
};

export default InterestEstimate;

export const Card = styled.div.attrs({
    className: 'rounded-xl p-8 bg-gray-12 dark:bg-bgContainer-dark'
})``;
