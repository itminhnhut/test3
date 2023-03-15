import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_GET_VIP, API_PORTFOLIO_OVERVIEW, API_PORTFOLIO_ACCOUNT } from 'redux/actions/apis';
import { formatPrice, formatTime, getLoginUrl, walletLinkBuilder } from 'src/redux/actions/utils';
import { Progressbar } from 'components/screens/NewReference/mobile/sections/Info';
import { FEE_TABLE } from 'constants/constants';
import SvgAddCircle from 'components/svg/SvgAddCircle';
import colors from 'styles/colors';
import router from 'next/router';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';

import 'react-loading-skeleton/dist/skeleton.css';
import Skeletor from 'components/common/Skeletor';

const BannerInfo = ({ currency, setCurrency, user, t, isMobile, isDark }) => {
    // Handle for Header tab:
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        FetchApi({
            url: API_PORTFOLIO_OVERVIEW,
            options: {
                method: 'GET'
            },
            params: {
                currency: currency === 'VNDC' ? 72 : 22
            }
        }).then(async ({ data, status }) => {
            if (status === 200) {
                const res = await FetchApi({
                    url: API_GET_VIP,
                    options: {
                        method: 'GET'
                    }
                });
                if (res.data) setUserData({ ...data[0], nami: res.data });
                else setUserData({ ...data[0] });
            } else {
                setUserData(null);
            }
        });
    }, [currency]);

    const level = +userData?.nami?.level || 0;
    const nextLevel = level >= 9 ? 9 : level + 1;

    const handleDepositIconBtn = useCallback(() => {
        if (!user) {
            router.push(getLoginUrl('sso', 'login'));
        } else {
            router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: currency || 'USDT' }));
        }
    }, [currency, user]);

    const renderUserGeneralInfo = () => (
        <div className={`${isMobile ? 'pt-[104px]' : 'ml-8'} flex flex-col items-start justify-center gap-y-2  text-sm md:text-base`}>
            <span className="text-xl md:text-2xl">{user?.name ?? user?.username ?? user?.email ?? t('common:unknown')}</span>
            <div className="flex items-center">
                <span className="text-green-2">VIP {level}</span>
                <div className="w-1 h-1 rounded-full bg-gray-7 mx-2"></div>
                {user?.code}
            </div>
            <div className="flex items-center">
                <span className="mr-2 font-normal text-gray-7">Giao dịch từ:</span>
                {userData?.trading_from ? formatTime(new Date(userData.trading_from * 1000), 'dd/MM/yyyy').toString() : 'Chưa thực hiện giao dịch'}{' '}
                {userData?.trading_exp && `(${Math.round(userData.trading_exp / 3600).toString()} giờ)`}
            </div>
        </div>
    );

    const renderProgressInfo = () => (
        <div className="w-full md:max-w-[548px]">
            <div className={`border-b dark:border-divider-dark h-6 mb-6 ${isMobile ? 'border-divider' : 'border-divider-dark'}`}></div>
            <div className="flex justify-between w-full py-2 md:py-0 text-sm">
                <span className="font-normal text-gray-7">Số dư Nami</span>
                <div className="text-green-2 flex gap-2 leading-[18px] md:text-base">
                    Mua NAMI
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDepositIconBtn();
                        }}
                    >
                        <SvgAddCircle size={13.3} color={colors.teal} className="cursor-pointer" />
                    </button>
                </div>
            </div>
            <div className={`w-full h-2 my-3 flex justify-between items-center rounded-xl ${isMobile ? 'bg-gray-12 dark:bg-dark-2' : 'bg-white'}`}>
                <Progressbar
                    background={isMobile && isDark ? colors.green[2] : colors.green[3]}
                    percent={((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100}
                    height={8}
                    className={'rounded-xl'}
                />
            </div>
            <div className="flex justify-between w-full text-green-3 md:text-green-2 dark:text-green-2 font-normal">
                <span>{`VIP ${level}: ${formatPrice(userData?.nami?.metadata?.namiBalance || 0, 0)} NAMI / ${Math.round(
                    ((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100
                )}%`}</span>
                <span>{`VIP ${nextLevel}: ${formatPrice(FEE_TABLE[nextLevel]?.nami_holding || 0, 0)} NAMI`}</span>
            </div>
        </div>
    );

    return (
        <div>
            {isMobile ? (
                <div>
                    {/* Mobile: banner image */}
                    <div
                        style={{
                            height: 236,
                            backgroundImage: `url(/images/screen/portfolio/banner_mobile.png)`
                        }}
                        className="w-full  px-4 bg-cover bg-center relative"
                    >
                        <div className="h-full pt-[68px] pb-[72px] text-gray-4 font-semibold">
                            <span className="text-3xl leading-[36px]">Futures Portfolio</span>
                            <GroupButtonCurrency currency={currency} setCurrency={setCurrency} />
                        </div>
                    </div>
                    {/* Mobile: Content infor */}
                    <div className="relative px-4 font-semibold">
                        {/* Avatar */}
                        <div className="absolute top-[-24px] w-[104px] h-[104px]">
                            {user?.avatar ? (
                                <img className="w-full h-auto rounded-full" src={user?.avatar} />
                            ) : (
                                <Skeletor circle width={104} height={104} containerClassName="avatar-skeleton" />
                            )}
                        </div>

                        {renderUserGeneralInfo()}

                        {/* Progress div */}
                        {renderProgressInfo()}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        backgroundImage: `url(/images/screen/portfolio/banner_desktop.png)`
                    }}
                    className="w-full bg-dark-6 px-4 md:px-28 bg-cover bg-center relative"
                >
                    <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                        <div className="h-full py-[68px] md:py-20 text-gray-4 font-semibold">
                            <span className="text-[32px] leading-[38px]">Futures Portfolio</span>

                            {/* Avatar div */}
                            <div className="block md:flex mt-12 md:mt-10">
                                <div className="w-[104px] h-[104px] md:w-[120px] md:h-[120px] relative">
                                    {user?.avatar ? (
                                        <img className="w-full h-auto rounded-full" src={user?.avatar} />
                                    ) : (
                                        <Skeletor circle width={120} height={120} containerClassName="avatar-skeleton" />
                                    )}
                                </div>
                                {renderUserGeneralInfo()}
                            </div>

                            {/* Progress div */}
                            {renderProgressInfo()}

                            {/* Group button currency */}
                            <GroupButtonCurrency currency={currency} setCurrency={setCurrency} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const GroupButtonCurrency = ({ className, currency, setCurrency }) => (
    <div className={`flex mt-6 md:mt-[50px] text-sm md:text-base ${className}`}>
        <button
            onClick={() => setCurrency('VNDC')}
            className={`border border-divider-dark rounded-l-md px-4 md:px-9 py-2 md:py-3 ${
                currency === 'VNDC' ? 'font-semibold bg-dark-2 ' : 'text-gray-7 border-r-none'
            }`}
        >
            VNDC
        </button>
        <button
            onClick={() => setCurrency('USDT')}
            className={`border border-divider-dark rounded-r-md px-4 md:px-9 py-2 md:py-3 ${
                currency === 'USDT' ? 'font-semibold bg-dark-2 ' : 'text-gray-7 border-l-none'
            }`}
        >
            USDT
        </button>
    </div>
);

export default BannerInfo;
