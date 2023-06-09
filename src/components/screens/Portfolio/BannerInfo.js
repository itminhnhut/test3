import React from 'react';
import { useState, useEffect } from 'react';
import FetchApi from 'utils/fetch-api';
import { API_GET_VIP } from 'redux/actions/apis';
import { formatTime, getS3Url } from 'src/redux/actions/utils';
import { FUTURES_PRODUCT } from 'constants/constants';
import colors from 'styles/colors';

import 'react-loading-skeleton/dist/skeleton.css';
import Skeletor from 'components/common/Skeletor';
import TextCopyable from '../Account/TextCopyable';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import { FutureNaoIcon } from 'components/svg/SvgIcon';
import Image from 'next/image';
import { isNumber } from 'lodash';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const BannerInfo = ({ user, t, isMobile, typeProduct, setTypeProduct, firstTimeTrade, loadingOverview }) => {
    // Handle for Header tab:
    const [vipLevel, setVipLevel] = useState(0);

    const getVip = async () => {
        try {
            const { data } = await FetchApi({
                url: API_GET_VIP
            });

            setVipLevel(data?.level || 0);
        } catch (error) {
            console.log(`Can't get user vip level: ${error}`);
            setVipLevel(0);
        }
    };

    useEffect(() => {
        getVip();
    }, []);

    const duringHours = Math.floor((new Date() - new Date(firstTimeTrade)) / (1000 * 86400));
    const renderUserGeneralInfo = () => (
        <div className={`${isMobile ? 'pt-[76px]' : 'ml-8'} flex flex-col items-start justify-center gap-y-2 text-sm md:text-base`}>
            <span className="text-xl md:text-2xl">{user?.name ?? user?.username ?? user?.email ?? t('common:unknown')}</span>
            <div className="flex items-center">
                {isNumber(vipLevel) ? (
                    <span className="text-green-2">VIP {vipLevel}</span>
                ) : (
                    <Skeletor width={50} baseColor={colors.darkBlue3} highlightColor={colors.darkBlue4} />
                )}

                <div className="w-1 h-1 rounded-full bg-gray-7 mx-2"></div>
                <TextCopyable text={user?.code} copyIconColor="#fff" />
            </div>
            <div className="flex items-center">
                <span className="mr-2 font-normal text-gray-7">{t('portfolio:trading_from')}</span>
                {loadingOverview ? (
                    <Skeletor width={170} height={17} baseColor={colors.darkBlue3} highlightColor={colors.darkBlue4} />
                ) : (
                    <div className="flex">
                        {firstTimeTrade ? formatTime(firstTimeTrade, 'dd/MM/yyyy').toString() + ' ' : '-'}
                        {firstTimeTrade && `(${duringHours} ${duringHours > 1 ? t('common:global_label.days') : t('common:day')})`}
                    </div>
                )}
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
                            backgroundImage: `url(${getS3Url(`/images/screen/portfolio/banner_mobile.png`)})`
                        }}
                        className="w-full  px-4 bg-cover bg-center relative"
                    >
                        <div className="h-full pt-[68px] pb-[72px] text-gray-4 font-semibold">
                            <span className="text-3xl leading-[36px]">{t('navbar:menu.user.futures_portfolio')}</span>
                            {/* <GroupButtonCurrency currency={currency} setCurrency={setCurrency} /> */}
                        </div>
                    </div>
                    {/* Mobile: Content infor */}
                    <div className="relative px-4 font-semibold">
                        {/* Avatar */}
                        <div className="absolute -translate-y-1/2 w-[104px] h-[104px]">
                            {user?.avatar ? (
                                <div className="flex relative items-center">
                                    <Image
                                        width="104"
                                        height="104"
                                        objectFit="fill"
                                        className="rounded-full"
                                        src={user?.avatar || '/images/default_avatar.png'}
                                    />
                                </div>
                            ) : (
                                <Skeletor circle width={120} height={120} containerClassName="avatar-skeleton" />
                            )}
                        </div>

                        {renderUserGeneralInfo()}
                    </div>
                    <Tabs tab={typeProduct} className="gap-x-6 border-b border-divider dark:border-divider-dark mt-8">
                        {Object.keys(FUTURES_PRODUCT).map((key) => (
                            <TabItem
                                isActive={FUTURES_PRODUCT[key].id === typeProduct}
                                key={FUTURES_PRODUCT[key].id}
                                className="w-1/2 px-0 first:ml-4 last:mr-4 flex items-center gap-x-2 !text-sm justify-center"
                                value={FUTURES_PRODUCT[key].id}
                                onClick={(isClick) => isClick && setTypeProduct(FUTURES_PRODUCT[key].id)}
                            >
                                {key === 'NAMI' ? <SvgWalletFutures size={16} /> : <FutureNaoIcon size={16} />}
                                {FUTURES_PRODUCT[key].name}
                            </TabItem>
                        ))}
                    </Tabs>
                </div>
            ) : (
                <div
                    style={{
                        backgroundImage: `url(${getS3Url(`/images/screen/portfolio/banner_desktop.png`)})`
                    }}
                    className="w-full bg-black-800 px-4 md:px-28 bg-cover bg-center"
                >
                    <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                        <div className="h-full pt-20 pb-[174px] text-gray-4 font-semibold relative">
                            <span className="text-[32px] leading-[38px]">{t('navbar:menu.user.futures_portfolio')}</span>

                            {/* Avatar div */}
                            <div className="block md:flex mt-20">
                                {/* <div className="w-[104px] h-[104px] md:w-[120px] md:h-[120px] relative"> */}
                                {user?.avatar ? (
                                    <div className="flex relative items-center">
                                        <Image
                                            width="120"
                                            height="120"
                                            objectFit="fill"
                                            className="rounded-full"
                                            src={user?.avatar || '/images/default_avatar.png'}
                                        />
                                        {/* <img src={user?.avatar || '/images/default_avatar.png'} className="h-full w-20 h-20 rounded-full object-fit" /> */}
                                    </div>
                                ) : (
                                    <Skeletor circle width={120} height={120} containerClassName="avatar-skeleton" />
                                )}
                                {/* </div> */}
                                {renderUserGeneralInfo()}
                            </div>

                            {/* Group button currency */}
                            <GroupButtonProduct className="mt-12" typeProduct={typeProduct} setTypeProduct={setTypeProduct} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const GroupButtonProduct = ({ className, typeProduct, setTypeProduct }) => {
    return (
        <div className={`flex items-center justify-start gap-x-3 ${className}`}>
            <button
                onClick={() => setTypeProduct(FUTURES_PRODUCT.NAMI.id)}
                className={`border rounded-[800px] px-5 py-3 flex items-center justify-center gap-x-2 transition-all ease-in-out duration-75 ${
                    typeProduct === FUTURES_PRODUCT.NAMI.id ? 'font-semibold bg-teal-blur border-teal text-teal' : 'border-divider-dark'
                }`}
            >
                <SvgWalletFutures size={20} />
                {FUTURES_PRODUCT.NAMI.name}
            </button>
            <button
                onClick={() => setTypeProduct(FUTURES_PRODUCT.NAO.id)}
                className={`border rounded-[800px] px-5 py-3 flex items-center justify-center gap-x-2 transition-all ease-in-out duration-75 ${
                    typeProduct === FUTURES_PRODUCT.NAO.id ? 'font-semibold bg-teal-blur border-teal text-teal' : 'border-divider-dark'
                }`}
            >
                <FutureNaoIcon />
                {FUTURES_PRODUCT.NAO.name}
            </button>
        </div>
    );
};

export default BannerInfo;

// const renderProgressInfo = () => (
//     <div className="w-full md:max-w-[548px]">
//         <div className={`border-b dark:border-divider-dark h-6 mb-6 ${isMobile ? 'border-divider' : 'border-divider-dark'}`}></div>
//         <div className="flex justify-between w-full py-2 md:py-0 text-sm">
//             <span className="font-normal text-gray-7">Số dư Nami</span>
//             <div className="text-green-2 flex gap-2 leading-[18px] md:text-base">
//                 Mua NAMI
//                 <button
//                     onClick={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         handleDepositIconBtn();
//                     }}
//                 >
//                     <SvgAddCircle size={13.3} color={colors.teal} className="cursor-pointer" />
//                 </button>
//             </div>
//         </div>
//         <div className={`w-full h-2 my-3 flex justify-between items-center rounded-xl ${isMobile ? 'bg-gray-12 dark:bg-dark-2' : 'bg-white'}`}>
//             <Progressbar
//                 background={isMobile && isDark ? colors.green[2] : colors.green[3]}
//                 percent={((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100}
//                 height={8}
//                 className={'rounded-xl'}
//             />
//         </div>
//         <div className="flex justify-between w-full text-green-3 md:text-green-2 dark:text-green-2 font-normal">
//             <span>{`VIP ${vipLevel}: ${formatPrice(userData?.nami?.metadata?.namiBalance || 0, 0)} NAMI / ${Math.round(
//                 ((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100
//             )}%`}</span>
//             <span>{`VIP ${nextLevel}: ${formatPrice(FEE_TABLE[nextLevel]?.nami_holding || 0, 0)} NAMI`}</span>
//         </div>
//     </div>
// );
