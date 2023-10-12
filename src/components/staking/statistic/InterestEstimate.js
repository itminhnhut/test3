import React, { useCallback, memo, useMemo, useState } from 'react';
import { HideIcon, SeeIcon } from 'components/svg/SvgIcon';
import Image from 'next/image';
import { formatBalance, getDayInterestPercent, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { SECRET_STRING } from 'utils';
import { APY_PERCENT, STAKING_RANGE } from 'constants/staking';
import { getApyByDay } from '../APYInterestChart';
import Tooltip from 'components/common/Tooltip';
import Card from './Card';

const ALLOW_WALLETS = ['SPOT', 'FUTURES', 'NAO_FUTURES', 'PARTNERS'];

const InterestEstimate = ({ assetId }) => {
    const { t } = useTranslation();

    const [isHideBalance, setIsHideBalance] = useState(false);

    const allWallet = useSelector((state) => state.wallet) || null;

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];

    const asset = useMemo(() => {
        return assetConfigs.find((asset) => asset.id === assetId);
    }, [assetConfigs, assetId]);

    const userTotalBalance = ALLOW_WALLETS.reduce((totalBalance, walletType) => (totalBalance += allWallet?.[walletType]?.[asset?.id]?.value ?? 0), 0);

    const renderAvailableBalance = useCallback(
        () => (
            <Card>
                <Tooltip place="top" className={`max-w-[360px] !px-6 !py-3`} effect="solid" isV3 id="balance_description">
                    <div className="max-w-[300px] text-sm z-50">{t('staking:statics.interest.balance_description')}</div>
                </Tooltip>
                <div className="text-txtSecondary dark:text-txtSecondary-dark flex items-center space-x-3 mb-6 md:mb-[50px] md:text-base text-sm">
                    <div className="nami-underline-dotted" data-tip="" data-for="balance_description">
                        {t('staking:statics.interest.balance')}
                    </div>

                    <div className="w-6 h-6 flex items-center cursor-pointer" onClick={() => setIsHideBalance((prev) => !prev)}>
                        {isHideBalance ? <HideIcon size={24} /> : <SeeIcon size={24} />}
                    </div>
                </div>
                <div className="flex flex-wrap items-end justify-between">
                    <div className="flex md:mb-0 mb-6 items-center space-x-6">
                        <div className="min-w-[48px] min-h-[48px] w-12 h-12 md:w-16 md:h-16  flex-1 flex items-center justify-center rounded-full bg-gray-13 dark:bg-dark-2">
                            <div className=" w-6 h-6 md:w-9 flex items-center justify-center md:h-9">
                                <Image src={getS3Url('/images/staking/ic_staking.png')} width={36} height={36} />
                            </div>
                        </div>
                        <div className="space-y-1 ">
                            <div className="text-xl md:text-4xl break-words font-semibold">
                                {isHideBalance ? SECRET_STRING : formatBalance(userTotalBalance, asset?.assetDigit)} {asset?.assetCode}
                            </div>
                            <div className="md:text-base text-sm">
                                {t('staking:statics.interest.apy_interest')}{' '}
                                <span className="text-green-3 dark:text-green-2 font-semibold">{APY_PERCENT[asset?.assetCode]}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <Link className="w-full" href={`${PATHS.WITHDRAW_DEPOSIT.DEFAULT}?side=BUY&assetId=${asset?.assetCode || 'VNDC'}`}>
                            <ButtonV2 className="md:w-[120px] !text-sm md:!text-base">{t('staking:statics.interest.deposit_now')}</ButtonV2>
                        </Link>
                    </div>
                </div>
            </Card>
        ),
        [isHideBalance, asset, userTotalBalance]
    );

    const renderInterestCard = useCallback(
        ({ numberOfDays, title1, title2, type = 'dayInterestPercent' }) => {
            const allowAmount = Math.min(+userTotalBalance, STAKING_RANGE[asset?.id]?.max);
            const dayInterestPercent = getDayInterestPercent(APY_PERCENT[asset?.assetCode]);
            return (
                <Card className="md:!px-8 !py-6">
                    <div className="mb-2 md:mb-4 flex items-center justify-between">
                        <span className="text-txtSecondary text-sm md:text-base dark:text-txtSecondary-dark">{title1}</span>
                        <span className="text-green-3 dark:text-green-2 font-semibold ml-2 md:text-lg">
                            {type === 'dayInterestPercent' ? dayInterestPercent : type === 'yearInterestPercent' ? APY_PERCENT[asset?.assetCode] : ''}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-txtSecondary text-sm md:text-base dark:text-txtSecondary-dark">{title2}</span>
                        <div className="flex items-center md:text-lg font-semibold ">
                            <span>
                                {isHideBalance
                                    ? SECRET_STRING
                                    : formatBalance(
                                          getApyByDay({
                                              allowAmount,
                                              amount: userTotalBalance,
                                              numberOfDays: numberOfDays,
                                              percentPerDay: dayInterestPercent
                                          })?.interestAmount,
                                          asset?.assetDigit
                                      )}
                            </span>

                            <span className="ml-1">{asset?.assetCode}</span>
                        </div>
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
                    title1: t('staking:statics.interest.daily_interest_rate'),
                    title2: t('staking:statics.interest.daily_interest')
                })}
            </div>
            <div className="w-full md:w-1/2 p-3">
                {renderInterestCard({
                    numberOfDays: 365,
                    type: 'yearInterestPercent',
                    title1: t('staking:statics.interest.annual_interest_rate'),
                    title2: t('staking:statics.interest.annual_interest')
                })}
            </div>
        </div>
    );
};

export default memo(InterestEstimate);
