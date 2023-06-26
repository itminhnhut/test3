import React, { useCallback, memo, useMemo, useState } from 'react';
import { HideIcon, SeeIcon } from 'components/svg/SvgIcon';
import Image from 'next/image';
import { formatNumber, getDayInterestPercent, getLoginUrl, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { SECRET_STRING } from 'utils';
import styled from 'styled-components';
import { APY_PERCENT, STAKING_RANGE } from 'constants/staking';
import { getApyByDay } from '../APYInterestChart';
import Tooltip from 'components/common/Tooltip';
import Card from './Card';

const InterestEstimate = ({ assetId }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isHideBalance, setIsHideBalance] = useState(false);
    const spotBalance = useSelector((state) => state.wallet?.SPOT) || null;
    const futuresBalance = useSelector((state) => state.wallet?.FUTURES) || null;
    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const asset = useMemo(() => {
        return assetConfigs.find((asset) => asset.id === assetId);
    }, [assetConfigs, assetId]);
    const auth = useSelector((state) => state.auth?.user);

    const userTotalBalance =
        spotBalance?.[asset?.id]?.value -
        spotBalance?.[asset?.id]?.locked_value +
        (futuresBalance?.[asset?.id]?.value - futuresBalance?.[asset?.id]?.locked_value);

    const renderAvailableBalance = useCallback(
        () => (
            <Card>
                <Tooltip place="top" className={`max-w-[360px] !px-6 !py-3`} effect="solid" isV3 id="balance_description">
                    <div className="max-w-[300px] text-sm z-50">{t('staking:statics.interest.balance_description')}</div>
                </Tooltip>
                <div className="text-txtSecondary dark:text-txtSecondary-dark flex items-center space-x-3 mb-[50px]">
                    <div className="nami-underline-dotted" data-tip="" data-for="balance_description">
                        {t('staking:statics.interest.balance')}
                    </div>

                    <div className="w-6 h-6 flex items-center cursor-pointer" onClick={() => setIsHideBalance((prev) => !prev)}>
                        {isHideBalance ? <HideIcon size={24} /> : <SeeIcon size={24} />}
                    </div>
                </div>
                <div className="flex flex-wrap items-end justify-between">
                    <div className="flex md:mb-0 mb-6 items-center space-x-6">
                        <div className="p-[14px] flex-1 flex items-center justify-center rounded-full bg-gray-12 dark:bg-dark-2">
                            <Image src={getS3Url('/images/staking/ic_staking.png')} width={36} height={36} />
                        </div>
                        <div className="space-y-1 ">
                            <div className="text-4xl font-semibold">
                                {isHideBalance ? SECRET_STRING : formatNumber(userTotalBalance, asset?.assetDigit)} {asset?.assetCode}
                            </div>
                            <div>
                                {t('staking:statics.interest.apy_interest')} <span className="text-teal font-semibold">{APY_PERCENT[asset?.assetCode]}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        {!auth ? (
                            <a
                                href={getLoginUrl('sso', 'login', {
                                    redirect: `${process.env.NEXT_PUBLIC_API_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${
                                        PATHS.WITHDRAW_DEPOSIT.PARTNER
                                    }?side=BUY&assetId=${assetId}`
                                })}
                            >
                                <ButtonV2 className="md:w-[120px]">{t('staking:statics.interest.deposit_now')}</ButtonV2>
                            </a>
                        ) : (
                            <Link className="w-full" href={`${PATHS.WITHDRAW_DEPOSIT.PARTNER}?side=BUY&assetId=${assetId}`}>
                                <ButtonV2 className="md:w-[120px]">{t('staking:statics.interest.deposit_now')}</ButtonV2>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>
        ),
        [auth, isHideBalance, asset, userTotalBalance]
    );

    const renderInterestCard = useCallback(
        ({ numberOfDays, title, type = 'dayInterestPercent' }) => {
            const allowAmount = userTotalBalance > STAKING_RANGE[asset?.id]?.max ? STAKING_RANGE[asset?.id]?.max : userTotalBalance;
            const dayInterestPercent = getDayInterestPercent(APY_PERCENT[asset?.assetCode]);
            return (
                <Card>
                    <div className="mb-4 text-txtSecondary dark:text-txtSecondary-dark">
                        {title}
                        <span className="text-teal font-semibold ml-2">
                            {type === 'dayInterestPercent' ? dayInterestPercent : type === 'yearInterestPercent' ? APY_PERCENT[asset?.assetCode] : ''}%
                        </span>
                    </div>
                    <div className="text-2xl font-semibold">
                        {isHideBalance
                            ? SECRET_STRING
                            : formatNumber(
                                  getApyByDay({
                                      allowAmount,
                                      amount: userTotalBalance,
                                      numberOfDays: numberOfDays,
                                      percentPerDay: dayInterestPercent
                                  })?.interestAmount,
                                  asset?.assetDigit
                              )}
                        <span className="ml-1">{asset?.assetCode}</span>
                    </div>
                </Card>
            );
        },
        [asset, userTotalBalance, isHideBalance]
    );
    return (
        <div className="flex flex-wrap -m-3">
            <div className="w-full p-3">{renderAvailableBalance()}</div>
            <div className="w-full md:w-1/2 p-3">
                {renderInterestCard({
                    numberOfDays: 1,
                    type: 'dayInterestPercent',
                    title: t('staking:statics.interest.daily_interest')
                })}
            </div>
            <div className="w-full md:w-1/2 p-3">
                {renderInterestCard({
                    numberOfDays: 365,
                    type: 'yearInterestPercent',
                    title: t('staking:statics.interest.annual_interest')
                })}
            </div>
        </div>
    );
};

export default memo(InterestEstimate);
