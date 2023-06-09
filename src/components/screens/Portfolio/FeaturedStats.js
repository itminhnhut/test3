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
import CollapseV2 from 'components/common/V2/CollapseV2';
import { API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { ShareIcon, SaveAltIcon, MoreHorizIcon, FacebookIcon, TwitterIcon, TelegramIcon, RedditIcon, LinkedInIcon, DiscordIcon } from 'components/svg/SvgIcon';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import MCard from 'components/common/MCard';
import styled from 'styled-components';
import ModalV2 from 'components/common/V2/ModalV2';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import CheckBox from 'components/common/CheckBox';
import DomToImage from 'dom-to-image';
import ModalLoading from 'components/common/ModalLoading';

const FeaturedStats = ({ className, user, t, isMobile, isDark, dataOverview, loadingOverview, typeCurrency, timeFilter, firstTimeTrade }) => {
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

    const renderSumVolumns = useCallback(() => {
        const totalVolume = dataOverview?.totalVolume?.value;
        const swapValue = '$' + formatNanNumber(totalVolume * usdRate, 4);
        return (
            <div className={isMobile ? 'p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'pt-4'}>
                <span>{t('transaction-history:modal_detail.volume')}</span>
                <div className="text-base md:text-2xl font-semibold text-gray-15 dark:text-gray-4 mt-2 md:mt-4">
                    {loadingOverview ? <Skeletor width={150} /> : formatNanNumber(totalVolume, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)}
                </div>
                <div className="mt-1 md:mt-2">{loadingOverview ? <Skeletor width={150} /> : swapValue}</div>
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
                    {loadingOverview ? <Skeletor width={150} /> : `${sign}${formatNanNumber(totalPnl, isVnd ? 0 : 4)}`}
                </div>
                {loadingOverview ? (
                    <Skeletor width={50} />
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
                        <Skeletor width={200} />
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
                        <Skeletor width={200} />
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
                    {loadingOverview ? <Skeletor width={50} /> : <span className="txtPri-1">{avgLeverage ? `${avgLeverage}X` : '-'}</span>}
                </div>
                {/* Tổng giá trị nạp */}
                <div className="flex items-center justify-between">
                    <span>{t('futures:Tổng giá trị nạp')}</span>
                    {loadingOverview ? <Skeletor width={150} /> : <span className="txtPri-1">{formatNanNumber(totalMargin, isVnd ? 0 : 4)}</span>}
                </div>
                {/* Tổng giá trị rút */}
                <div className="flex items-center justify-between">
                    <span>{t('futures:Tổng giá trị rút')}</span>
                    {loadingOverview ? <Skeletor width={150} /> : <span className="txtPri-1">{formatNanNumber(totalMargin, isVnd ? 0 : 4)}</span>}
                </div>
                {/* Tỷ lệ % thắng */}
                <div className="flex items-center justify-between">
                    <span>{t('futures:Tỷ lệ % thắng')}</span>
                    {loadingOverview ? <Skeletor width={100} /> : <span className="txtPri-1">80.90%</span>}
                </div>
            </div>
        );
    });

    return (
        <div className={className}>
            <Tooltip id={'key_statistic'} place="top" className="max-w-[520px]" />
            {isMobile ? (
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={
                        <HeaderTooltip
                            isMobile={isMobile}
                            title={t('portfolio:key_metrics')}
                            tooltipContent={t('portfolio:key_metrics_tooltip')}
                            tooltipId={'key_metrics_tooltip'}
                        />
                    }
                    labelClassname="text-base font-semibold"
                    isDividerBottom={true}
                >
                    <div className="mt-6">
                        <div className="mt-6 text-gray-1 dark:text-gray-7">
                            <div className="grid grid-cols-2 gap-x-3">
                                {renderSumVolumns()}
                                {renderSumPnl()}
                            </div>
                            {renderOtherSummary()}
                        </div>
                    </div>
                </CollapseV2>
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
                            <span className="ml-2">Chia sẻ PNL của tôi</span>
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
                isVisible={openModalShare}
                onBackdropCb={() => setOpenModalShare(null)}
                totalPnl={dataOverview?.totalPnl?.value}
                totalMargin={dataOverview?.totalMargin?.value}
                typeCurrency={typeCurrency}
                timeFilter={timeFilter}
                firstTimeTrade={firstTimeTrade}
                isDark={isDark}
                t={t}
            />
        </div>
    );
};

const CardFill = styled.div.attrs(({ key, className, onClick }) => ({
    className: `bg-gray-13 dark:bg-dark-4 rounded-xl p-6 ${className}`,
    key: key,
    onClick: onClick
}))``;

const ModalShare = ({ isVisible, onBackdropCb, totalPnl, totalMargin, typeCurrency, timeFilter, firstTimeTrade, isDark, t }) => {
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
        { name: 'Discord', icon: <DiscordIcon size={28} />, event: 'linkedIn' },
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
                // loading={loading}
                // isVisible={isVisible}
                isVisible={true}
                onBackdropCb={onBackdropCb}
                className="!max-w-[800px]"
            >
                <div className="flex gap-x-8">
                    <div ref={content} className="w-full min-w-[342px] bg-dark border border-divider-dark relative">
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
                            <div className="mt-0.5 text-gray-4 font-semibold text-lg">Thống kê PNL NAMI Futures</div>
                            <div>Thống kê PNL NAMI Futures</div>
                            <div className="text-5xl text-red-2 font-semibold">
                                {!negative && '+'}
                                {formatNanNumber((totalPnl * 100) / totalMargin, 2)}%
                            </div>
                            <div>Tổng PNL({typeCurrency === ALLOWED_ASSET_ID.VNDC ? 'VND' : 'USD'})</div>
                            <div className="text-gray-4 text-sm font-semibold">
                                {!negative && '+'}
                                {formatNanNumber(totalPnl, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)}
                            </div>
                            <div className="mt-6 mb-[92px]">{`${formatTime(
                                timeFilter?.startDate ? timeFilter.startDate : firstTimeTrade,
                                'dd/MM/yyyy'
                            )} - ${formatTime(timeFilter?.endDate ? timeFilter.endDate : new Date(), 'dd/MM/yyyy')}`}</div>

                            <div
                                className="absolute bottom-0 left-0 px-4 py-3 flex justify-between items-center w-full"
                                style={{
                                    backgroundImage: 'linear-gradient(to bottom, #071713 28%, #091b16 75%, #132e27 100%)'
                                }}
                            >
                                <div
                                    className="bg-cover w-[114px] h-9 bg-no-repeat"
                                    style={{ backgroundImage: 'url(https://nami.exchange/images/nami-logo-v3.png)' }}
                                />
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
                    <div className="w-full text-gray-15 dark:text-gray-4">
                        <div className="text-2xl font-semibold">Thông tin muốn chia sẻ</div>
                        <CheckBox
                            className="mt-6"
                            boxContainerClassName="w-6 h-6"
                            labelClassName="tracking-normal text-base text-gray-15 dark:text-gray-4"
                            label={'Tổng PNL'}
                            onChange={() => setIsShowTotalPnl((prev) => !prev)}
                            active={isShowTotalPnl}
                            sizeCheckIcon={20}
                        />
                        <CheckBox
                            className="mt-6"
                            boxContainerClassName="w-6 h-6"
                            labelClassName="tracking-normal text-base text-gray-15 dark:text-gray-4"
                            label={'Tỷ lệ % thắng'}
                            onChange={() => setIsShowRate((prev) => !prev)}
                            active={isShowRate}
                            sizeCheckIcon={20}
                        />

                        <div className="mt-10 text-2xl font-semibold">Chia sẻ đến</div>
                        <div className="flex flex-nowrap gap-4 mt-6">
                            {/* <div className="pt-6 pb-4 flex items-center justify-around space-x-2"> */}
                            {list.map((item, key) => (
                                <div onClick={async () => await onDownLoad()} key={key} className="flex flex-col items-center space-y-2 cursor-pointer">
                                    <div className="p-2 bg-[#F2F2F5] dark:bg-dark-4 rounded-md max-w-[40px]">
                                        <div className="w-6 h-6 rounded-full overflow-hidden">{item.icon}</div>
                                    </div>
                                    <span className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{item.name}</span>
                                </div>
                            ))}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </ModalV2>
        </>
    );
};

export default FeaturedStats;
