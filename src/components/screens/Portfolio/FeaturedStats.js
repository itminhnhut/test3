import React, { useRef } from 'react';
import { useState, useEffect, useCallback } from 'react';
import PriceChangePercent from 'components/common/PriceChangePercent';
import colors from 'styles/colors';
import Tooltip from 'components/common/Tooltip';
import { formatNanNumber, formatTime } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import classNames from 'classnames';
import HeaderTooltip from './HeaderTooltip';
import { API_FUTURES_STATISTIC_DW, API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { ShareIcon, SaveAltIcon, FacebookIcon, TwitterIcon, TelegramIcon, RedditIcon, LinkedInIcon, DiscordIcon } from 'components/svg/SvgIcon';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import styled from 'styled-components';
import ModalV2 from 'components/common/V2/ModalV2';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import CheckBox from 'components/common/CheckBox';
import DomToImage from 'dom-to-image';
import ModalLoading from 'components/common/ModalLoading';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { FUTURES_PRODUCT } from 'constants/constants';
import { useTranslation } from 'next-i18next';

const FeaturedStats = ({ className, isMobile, dataOverview, loadingOverview, typeProduct, typeCurrency, timeFilter, firstTimeTrade }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [usdRate, setUsdRate] = useState();
    const [openModalShare, setOpenModalShare] = useState(null);
    useEffect(() => {
        FetchApi({
            url: API_GET_REFERENCE_CURRENCY,
            params: { base: 'VNDC,USDT', quote: 'USD' }
        })
            .then(({ data = [] }) => {
                const baseCurrency = typeCurrency === ALLOWED_ASSET_ID.VNDC ? 'VNDC' : 'USDT';
                setUsdRate(data.find((obj) => obj.base === baseCurrency)?.price);
            })
            .catch((err) => console.error(err));
    }, [typeCurrency]);

    const isVnd = typeCurrency === ALLOWED_ASSET_ID.VNDC;

    const [dataDw, setDataDw] = useState({ totalWithdraw: null, totalDeposit: null });
    const [loadingDataDW, setLoadingDataDW] = useState(false);
    const fetchDataDW = async () => {
        try {
            setLoadingDataDW(true);

            const { data } = await FetchApi({
                url: API_FUTURES_STATISTIC_DW,
                params: {
                    currency: typeCurrency,
                    product: typeProduct,
                    from: timeFilter?.startDate,
                    to: timeFilter?.endDate
                }
            });

            setDataDw(data);
        } catch (error) {
        } finally {
            setLoadingDataDW(false);
        }
    };

    useEffect(() => {
        if (!timeFilter?.endDate) return;

        fetchDataDW();
    }, [typeProduct, typeCurrency, timeFilter]);

    const renderSumVolumns = useCallback(() => {
        const totalVolume = dataOverview?.totalVolume?.value;
        const swapValue = '$' + formatNanNumber(totalVolume * usdRate, 4);
        return (
            <div className={isMobile ? 'p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'pt-4'}>
                <span>{t('transaction-history:modal_detail.volume')}</span>
                <div className="text-base md:text-2xl font-semibold text-gray-15 dark:text-gray-4 mt-2 md:mt-4">
                    {loadingOverview ? (
                        <Skeletor width={isMobile ? 80 : 150} height={20} />
                    ) : (
                        formatNanNumber(totalVolume, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)
                    )}
                </div>
                <div className="mt-1 md:mt-2">{loadingOverview ? <Skeletor width={isMobile ? 60 : 150} height={12} /> : swapValue}</div>
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview, usdRate]);

    const renderSumPnl = useCallback(() => {
        const totalPnl = dataOverview?.totalPnl?.value;
        const sign = totalPnl > 0 ? '+ ' : '';

        return (
            <div
                className={
                    isMobile
                        ? 'p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4'
                        : 'pb-[15px] border-b border-divider dark:border-divider-dark'
                }
            >
                <span>{t('portfolio:pnl')}</span>
                <div
                    className={classNames('text-base md:text-2xl font-semibold mt-2 md:mt-4 text-gray-15 dark:text-gray-4', {
                        '!text-green-3 !dark:text-green-2': totalPnl > 0,
                        '!text-red-2 !dark:text-red': totalPnl < 0
                    })}
                >
                    {loadingOverview ? <Skeletor width={isMobile ? 80 : 150} height={20} /> : `${sign}${formatNanNumber(totalPnl, isVnd ? 0 : 4)}`}
                </div>
                {loadingOverview ? (
                    <Skeletor width={isMobile ? 60 : 150} height={12} />
                ) : totalPnl === 0 ? (
                    <div className="mt-1 md:mt-2">0%</div>
                ) : (
                    <PriceChangePercent
                        priceChangePercent={totalPnl / dataOverview?.totalMargin?.value}
                        className="!justify-start text-xs leading-[16px] md:text-base mt-1 md:mt-2"
                    />
                )}
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview]);

    const renderOtherSummary = useCallback(() => {
        const totalMargin = dataOverview?.totalMargin?.value;
        const swapValue = '$' + formatNanNumber(totalMargin * usdRate, 4);
        const avgLeverage = formatNanNumber(dataOverview?.avgLeverage?.value, 0);

        return (
            <div className={isMobile ? 'mt-4 p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'flex flex-col gap-y-4'}>
                <div className="flex items-center justify-between">
                    <span>{t('futures:margin')}</span>
                    {loadingOverview ? (
                        <Skeletor className="!my-0.5" width={isMobile ? 150 : 200} height={16} />
                    ) : (
                        <div className="text-right">
                            <span className="txtPri-1">{formatNanNumber(totalMargin, isVnd ? 0 : 4)}</span>
                            <span className="txtSecond-2">{` (${swapValue})`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span>{t('portfolio:position')}</span>
                    {loadingOverview ? (
                        <Skeletor width={isMobile ? 150 : 200} height={16} className="!my-0.5" />
                    ) : (
                        <div className="text-right">
                            <span className="txtPri-1">{dataOverview?.totalPositions?.value}</span>
                            <span className="txtSecond-2">{` (${dataOverview?.countLongPositions?.doc_count || 0} ${t('common:buy')} - ${
                                dataOverview?.countShortPositions?.doc_count || 0
                            } ${t('common:sell')})`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span>{t('portfolio:avg_leverage')}</span>
                    {loadingOverview ? (
                        <Skeletor width={isMobile ? 30 : 50} height={16} className="!my-0.5" />
                    ) : (
                        <span className="txtPri-1">{avgLeverage ? `${avgLeverage}X` : '-'}</span>
                    )}
                </div>
                {/* Tổng giá trị nạp */}
                <div className="flex items-center justify-between">
                    <span>{t('portfolio:total_deposit')}</span>
                    {loadingDataDW ? (
                        <Skeletor width={isMobile ? 100 : 150} height={16} />
                    ) : (
                        <span className="txtPri-1">{formatNanNumber(dataDw.totalDeposit?.total?.value, isVnd ? 0 : 4)}</span>
                    )}
                </div>
                {/* Tổng giá trị rút */}
                <div className="flex items-center justify-between">
                    <span>{t('portfolio:total_withdraw')}</span>
                    {loadingDataDW ? (
                        <Skeletor width={isMobile ? 120 : 150} height={16} />
                    ) : (
                        <span className="txtPri-1">{formatNanNumber(dataDw.totalWithdraw?.total?.value, isVnd ? 0 : 4)}</span>
                    )}
                </div>
                {/* Tỷ lệ % thắng */}
                <div className="flex items-center justify-between">
                    <span className={language === 'vi' ? '' : 'capitalize'}>{t('portfolio:win_rate')}</span>
                    {loadingOverview ? (
                        <Skeletor width={isMobile ? 70 : 100} height={16} />
                    ) : (
                        <span className="txtPri-1">{formatNanNumber(dataOverview?.winRate?.value, 2)}%</span>
                    )}
                </div>
            </div>
        );
    });

    return (
        <div className={className}>
            <Tooltip id={'key_statistic'} place="top" className="max-w-[520px]" />
            {isMobile ? (
                <div>
                    <div className="flex items-center justify-between">
                        <HeaderTooltip
                            isMobile={isMobile}
                            title={t('portfolio:key_metrics')}
                            tooltipContent={t('portfolio:key_metrics_tooltip')}
                            tooltipId={'key_metrics_tooltip'}
                        />
                        <TextButton onClick={() => setOpenModalShare(true)} className="w-auto !py-[3px] text-sm">
                            <ShareIcon size={16} className="cursor-pointer" color={'currentColor'} />
                            <span className="ml-2">{t('common:share')}</span>
                        </TextButton>
                    </div>
                    <div className="mt-6">
                        <div className="mt-6 text-gray-1 dark:text-gray-7">
                            <div className="grid grid-cols-2 gap-x-3">
                                {renderSumVolumns()}
                                {renderSumPnl()}
                            </div>
                            {renderOtherSummary()}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <HeaderTooltip
                            isMobile={isMobile}
                            title={t('portfolio:key_metrics')}
                            tooltipContent={t('portfolio:key_metrics_tooltip')}
                            tooltipId={'key_metrics_tooltip'}
                        />
                        <TextButton onClick={() => setOpenModalShare(true)} className="w-auto !py-[3px]">
                            <ShareIcon size={16} className="cursor-pointer" color={'currentColor'} />
                            <span className="ml-2">{t('common:share')}</span>
                        </TextButton>
                    </div>
                    <div className="flex items-stretch w-full gap-x-8 text-gray-1 dark:text-gray-7 mt-8">
                        <CardFill className={'flex-auto'}>
                            {renderSumPnl()}
                            {renderSumVolumns()}
                        </CardFill>
                        <CardFill className={'flex-auto'}>{renderOtherSummary()}</CardFill>
                    </div>
                    {/* <div className=" text-gray-1 dark:text-gray-7 mt-8 rounded-xl flex px-6 py-3 bg-gray-13 dark:bg-dark-4">
                        {renderSumVolumns()}
                        <div className="vertical-divider"></div>
                        {renderSumPnl()}
                        <div className="vertical-divider"></div>
                        {renderOtherSummary()}
                    </div> */}
                </>
            )}
            <ModalShare
                isMobile={isMobile}
                isVisible={openModalShare}
                onBackdropCb={() => setOpenModalShare(null)}
                totalPnl={dataOverview?.totalPnl?.value}
                totalMargin={dataOverview?.totalMargin?.value}
                // totalPnl={123}
                // totalMargin={100000}
                typeCurrency={typeCurrency}
                timeFilter={timeFilter}
                firstTimeTrade={firstTimeTrade}
                t={t}
                winRate={dataOverview?.winRate?.value}
                typeProduct={typeProduct}
            />
        </div>
    );
};

const CardFill = styled.div.attrs(({ key, className, onClick }) => ({
    className: `bg-gray-13 dark:bg-dark-4 rounded-xl p-6 ${className}`,
    key: key,
    onClick: onClick
}))``;

const ModalShare = ({ isVisible, onBackdropCb, totalPnl, totalMargin, typeCurrency, timeFilter, firstTimeTrade, t, isMobile, winRate, typeProduct }) => {
    const content = useRef();
    const negative = totalPnl < 0;
    const refCode = useSelector((state) => state.auth?.user?.code_refer);
    const [isShowTotalPnl, setIsShowTotalPnl] = useState(true);
    const [isShowRate, setIsShowRate] = useState(false);
    const [loading, setLoading] = useState(false);

    const list = [
        { name: t('common:save'), icon: <SaveAltIcon size={28} />, event: 'save' },
        { name: 'Facebook', icon: <FacebookIcon size={28} />, event: 'facebook' },
        { name: 'Twitter', icon: <TwitterIcon size={28} />, event: 'twitter' },
        { name: 'Telegram', icon: <TelegramIcon size={28} />, event: 'telegram' },
        { name: 'Reddit', icon: <RedditIcon size={28} />, event: 'reddit' },
        { name: 'LinkedIn', icon: <LinkedInIcon size={28} />, event: 'linkedIn' },
        { name: 'Discord', icon: <DiscordIcon size={28} />, event: 'linkedIn' }
    ];

    const saveFile = (file, name) => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const onDownLoad = async () => {
        try {
            setLoading(true);
            const scale = 2;
            const option = {
                height: content.current.offsetHeight * scale,
                width: content.current.offsetWidth * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: content.current.offsetWidth + 'px',
                    height: content.current.offsetHeight + 'px'
                }
            };
            await DomToImage.toBlob(content.current, option).then((blob) => {
                return saveFile(new File([blob], `${refCode}.png`, { type: 'image/png' }), `${refCode}.png`);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ModalLoading isVisible={loading} onBackdropCb={() => setLoading(false)} />
            <ModalV2
                loading={loading}
                isVisible={isVisible}
                // isVisible={true}
                onBackdropCb={onBackdropCb}
                className={`${!isMobile && '!max-w-[488px]' }!min-w-[488px] !dark:bg-dark-4`}
                wrapClassName={!isMobile && 'dark:!bg-dark-4'}
                isMobile={isMobile}
                divOtherWorld={
                    isMobile && (
                        <ImageShare
                            className="mx-auto mt-[60px] mb-[18px]"
                            content={content}
                            negative={negative}
                            totalPnl={totalPnl}
                            totalMargin={totalMargin}
                            typeCurrency={typeCurrency}
                            isShowTotalPnl={isShowTotalPnl}
                            isShowRate={isShowRate}
                            timeFilter={timeFilter}
                            firstTimeTrade={firstTimeTrade}
                            t={t}
                            refCode={refCode}
                            winRate={winRate}
                            typeProduct={typeProduct}
                        />
                    )
                }
            >
                {isMobile ? (
                    <div className="w-full text-gray-15 dark:text-gray-4 text-base">
                        <div className="text-xl font-semibold">{t('portfolio:option_info_to_share')}</div>
                        <div className="flex items-center mt-6">
                            <CheckBox
                                className="mr-12"
                                boxContainerClassName="w-4 h-4"
                                labelClassName="tracking-normal text-gray-15 dark:text-gray-4"
                                label={t('portfolio:cumulative_pnl', { asset: typeCurrency === 72 ? "VNDC" : "USDT" })}
                                onChange={() => setIsShowTotalPnl((prev) => !prev)}
                                active={isShowTotalPnl}
                                sizeCheckIcon={12}
                            />
                            <CheckBox
                                boxContainerClassName="w-4 h-4"
                                labelClassName="tracking-normal text-gray-15 dark:text-gray-4"
                                label={t('portfolio:win_rate')}
                                onChange={() => setIsShowRate((prev) => !prev)}
                                active={isShowRate}
                                sizeCheckIcon={12}
                            />
                        </div>
                        <ButtonV2 className="mt-8" onClick={onDownLoad}>
                            {t('common:save')}
                        </ButtonV2>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <ImageShare
                            className="w-full"
                            content={content}
                            negative={negative}
                            totalPnl={totalPnl}
                            totalMargin={totalMargin}
                            typeCurrency={typeCurrency}
                            isShowTotalPnl={isShowTotalPnl}
                            isShowRate={isShowRate}
                            timeFilter={timeFilter}
                            firstTimeTrade={firstTimeTrade}
                            t={t}
                            refCode={refCode}
                            winRate={winRate}
                            typeProduct={typeProduct}
                        />
                        <div className="w-full text-gray-15 dark:text-gray-4 mt-6">
                            <div className="text-2xl font-semibold">{t('portfolio:option_info_to_share')}</div>
                            <div className="flex items-center mt-4">
                                <CheckBox
                                    className="mr-12"
                                    boxContainerClassName="w-5 h-5"
                                    labelClassName="tracking-normal text-gray-15 dark:text-gray-4"
                                    label={t('portfolio:cumulative_pnl', { asset: typeCurrency === 72 ? "VNDC" : "USDT" })}
                                    onChange={() => setIsShowTotalPnl((prev) => !prev)}
                                    active={isShowTotalPnl}
                                    sizeCheckIcon={20}
                                />
                                <CheckBox
                                    boxContainerClassName="w-5 h-5"
                                    labelClassName="tracking-normal text-gray-15 dark:text-gray-4"
                                    label={t('portfolio:win_rate')}
                                    onChange={() => setIsShowRate((prev) => !prev)}
                                    active={isShowRate}
                                    sizeCheckIcon={20}
                                />
                            </div>
                            <ButtonV2 className="mt-10" onClick={onDownLoad}>
                                {t('common:save')}
                            </ButtonV2>

                            {/* <div className="mt-10 text-2xl font-semibold">{t('common:luckydraw.share')}</div>
                            <div className="flex items-center justify-start flex-wrap gap-4 mt-6">
                                {list.map((item, key) => (
                                    <div
                                        onClick={() => handleShareAction(item.event)}
                                        key={key}
                                        className="first:cursor-pointer flex flex-col items-center min-w-[58px]"
                                    >
                                        <CardFill className="!p-2 !rounded-md">{item.icon}</CardFill>
                                        <span className="mt-2 text-xs text-txtSecondary dark:text-txtSecondary-dark">{item.name}</span>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </div>
                )}
            </ModalV2>
        </>
    );
};

const ImageShare = ({
    className,
    content,
    negative,
    totalPnl,
    totalMargin,
    typeCurrency,
    isShowTotalPnl,
    isShowRate,
    timeFilter,
    firstTimeTrade,
    t,
    refCode,
    winRate,
    typeProduct
}) => {
    return (
        <div ref={content} className={`min-w-[342px] max-w-[342px] bg-dark border border-divider-dark relative ${className}`}>
            <div
                className="bg-center bg-cover h-[182px] "
                style={{
                    backgroundImage:
                        process.env.NODE_ENV === 'development'
                            ? `url('/images/screen/portfolio/share_${negative ? 'loss' : 'profit'}.png')`
                            : `url(${`https://nami.exchange/images/portfolio/share_${negative ? 'loss' : 'profit'}.png`})`
                }}
            ></div>
            <div className="flex flex-col items-center text-gray-7 text-xs gap-y-2">
                <div className="mt-2.5 text-gray-4 font-semibold text-lg">
                    {t('portfolio:pnl_statistic_on_product', {
                        product: Object.entries(FUTURES_PRODUCT).find(([key, value]) => value.id === typeProduct)?.[1]?.name
                    })}
                </div>
                <div>{t('portfolio:cumulative_roe')}</div>
                <div className={`text-5xl ${negative ? 'text-red-2' : 'text-teal'} font-semibold`}>
                    {!negative && '+'}
                    {formatNanNumber((totalPnl * 100) / totalMargin, 2)}%
                </div>
                <div className={`h-11 w-full flex items-center justify-center transition-all duration-75`}>
                    {/* <div className={`${!isShowTotalPnl ? 'hidden' : isShowRate ? 'w-1/2 !items-end' : ' w-full '} flex justify-center items-center flex-col`}> */}
                        <div className={`${!isShowTotalPnl && 'hidden'} flex flex-col items-center justify-center`}>
                            <div>{t('portfolio:cumulative_pnl', { asset: typeCurrency === 72 ? "VNDC" : "USDT" })}</div>
                            <div className="text-gray-4 text-sm font-semibold">
                                {!negative && '+'}
                                {formatNanNumber(totalPnl, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)}
                            </div>
                        </div>
                    {/* </div> */}
                    {isShowRate && isShowTotalPnl && <div className={`border-divider-dark border-l-[1px] h-9 mx-6`}></div>}
                    {/* <div className={`${!isShowRate ? 'hidden' : isShowTotalPnl ? 'w-1/2 !items-start' : ' w-full '} flex justify-center items-center flex-col`}> */}
                        <div className={`${!isShowRate && 'hidden'} flex flex-col items-center justify-center`}>
                            <div>{t('portfolio:win_rate')}</div>
                            <div className="text-gray-4 text-sm font-semibold">{formatNanNumber(winRate, 2)}%</div>
                        </div>
                    {/* </div> */}
                </div>

                <div className="mt-8 mb-[92px]">{`${formatTime(timeFilter?.startDate ? timeFilter.startDate : firstTimeTrade, 'dd/MM/yyyy')} - ${formatTime(
                    timeFilter?.endDate ? timeFilter.endDate : new Date(),
                    'dd/MM/yyyy'
                )}`}</div>

                <div
                    className="absolute bottom-0 left-0 px-4 py-3 flex justify-between items-center w-full"
                    style={{
                        backgroundImage: 'linear-gradient(to bottom, #071713 28%, #091b16 75%, #132e27 100%)'
                    }}
                >
                    <div className="bg-cover w-[114px] h-9 bg-no-repeat" style={{ backgroundImage: 'url(https://nami.exchange/images/nami-logo-v3.png)' }} />
                    <div className="flex items-center space-x-3">
                        <div className="flex flex-col text-white">
                            <span className="text-xs">{t('futures:share:ref_id')}</span>
                            <span className="text-sm font-semibold">{refCode}</span>
                        </div>
                        <div className="p-1 bg-white rounded-[3px]">
                            <QRCode value={`https://nami.exchange/ref/${refCode}`} size={47} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedStats;
