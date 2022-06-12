import React, { useState, useMemo, memo, useRef, useEffect } from 'react';
import Modal from 'components/common/ReModal';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import CheckBox from 'components/common/CheckBox';
import { useTranslation } from 'next-i18next';
import { getProfitVndc, VndcFutureOrderType, renderCellTable } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import classNames from 'classnames';
import styled from 'styled-components'

const { PENDING, ACTIVE, CLOSED } = VndcFutureOrderType.Status
const APP_URL = process.env.APP_URL || 'https://nami.exchange'

export const getShareModalData = ({ order, pairPrice }) => {

    if (!order) return {}

    const profit = getProfitVndc(order, pairPrice?.lastPrice)
    let price = {
        [PENDING]: order?.price,
        [ACTIVE]: order?.open_price,
        [CLOSED]: order?.close_price,
    }[order?.status]

    const status = {
        [PENDING]: 'opening',
        [ACTIVE]: 'opening',
        [CLOSED]: 'closed',
    }[order?.status]


    const isClosePrice = order?.status === CLOSED
    if (isClosePrice) price = order?.open_price
    const _percent = ((isClosePrice ? order?.profit : profit) / order?.margin) * 100;
    return {
        leverage: order?.leverage,
        profit: formatNumber(isClosePrice ? order?.profit : profit, 0, 0, true),
        percent: (_percent > 0 ? '+' : '') + formatNumber(_percent, 2, 0, true) + '%',
        price: formatNumber(price, 8),
        markPrice: formatNumber(pairPrice?.lastPrice, 8),
        closePrice: formatNumber(order?.close_price, 8),
        time: formatTime(order?.created_at),
        quoteAsset: pairPrice?.quoteAsset ?? '',
        bg: _percent > 0 ? 'green' : 'red',
        status
    }
}
const ShareFutureMobile = memo(({ isVisible, onClose, order, pairPrice, isClosePrice }) => {
    const { t } = useTranslation()
    const codeRefer = useSelector((state) => state.auth?.user?.code_refer)
    const [hide, setHide] = useState({
        leverage: false,
        pnl: false,
        price: false,
    })
    const uriReferral = APP_URL + '/referral?ref=' + codeRefer
    const refNodeInfoOrder = useRef(null);
    const [downloading, setDownloading] = useState(false)

    const {
        leverage = '',
        profit = '',
        percent = '',
        price = '',
        markPrice = '',
        closePrice = '',
        time = '',
        quoteAsset = '',
        bg = 'text-teal'
    } = useMemo(() => {
        if (!order) return {}

        const profit = getProfitVndc(order, pairPrice?.lastPrice)
        let price = {
            [PENDING]: order?.price,
            [ACTIVE]: order?.open_price,
            [CLOSED]: order?.close_price,
        }[order?.status]

        if (isClosePrice) price = order?.open_price
        const _percent = ((isClosePrice ? order?.profit : profit) / order?.margin) * 100;
        return {
            leverage: order?.leverage,
            profit: formatNumber(isClosePrice ? order?.profit : profit, 0, 0, true),
            percent: (_percent > 0 ? '+' : '') + formatNumber(_percent, 2, 0, true) + '%',
            price: formatNumber(price, 8),
            markPrice: formatNumber(pairPrice?.lastPrice, 8),
            closePrice: formatNumber(order?.close_price, 8),
            time: formatTime(order?.created_at),
            quoteAsset: pairPrice?.quoteAsset ?? '',
            bg: _percent > 0 ? 'text-teal' : 'text-red'
        }
    }, [order, pairPrice])

    const downloadImage = async () => {
        const node = refNodeInfoOrder.current;
        if (downloading || !node) return;
        setDownloading(true)
    };

    useEffect(() => {
        if (!downloading) return;
        html2canvas(refNodeInfoOrder.current, {
            allowTaint: true,
            useCORS: true,
        }).then(async (canvas) => {
            const dataUrl = canvas.toDataURL();
            setDownloading(false)
            const blob = await (await fetch(dataUrl)).blob();
            const filesArray = [
                new File(
                    [blob],
                    'share.png',
                    {
                        type: blob.type,
                        lastModified: new Date().getTime()
                    }
                )
            ];
            const shareData = {
                files: filesArray
            }
            if (navigator.share) {
                try {
                    await navigator.share(shareData).then(() => { });
                } catch (error) {
                    alert(error)
                }
            }
        });
    }, [downloading])

    const classMobile = useMemo(() => {
        const height = window.innerHeight <= 600 ? 'max-h-[500px] overflow-auto ' : '';
        const widht = '!w-[95%]';
        return height + widht
    }, [isVisible])

    const classNameBg = order.side === VndcFutureOrderType.Side.BUY ? 'text-teal' : 'text-red'
    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName={`${classMobile} p-0 top-[50%] !w-[358px] !border-0`}
        >
            <Background>
                <div className='relative top-[20%] px-[24px]' >
                    <div className="flex w-full mb-[12px] ">
                        <div className={`flex w-full text-white text-sm `}>
                            <span className={`uppercase ${classNameBg}`}>{renderCellTable('side', order)}</span>
                            <span className="px-[12px]">|</span>
                            <span className="font-medium">{hide.leverage ? '***' : `${leverage}x`}</span>
                            <span className="px-[12px]">|</span>
                            <div className="font-medium">{order?.symbol}</div>
                        </div>
                    </div>
                    <div className={`text-[64px] my-[40px] font-medium ${bg}`}>
                        {percent}
                    </div>
                    {/* <div className='text-lg font-medium'>({hide.pnl ? '*******' : profit} {quoteAsset})</div> */}
                    <div className="flex flex-col w-full text-lg">
                        <div className='flex items-center'>
                            <div className="font-normal min-w-[150px] uppercase text-gray-3 mr-[16px]">{t('futures:order_table:open_price')}</div>
                            <div className='font-medium'>{hide.price ? '*****' : price}</div>
                        </div>
                        <div className='flex items-center pt-[5px]'>
                            <div className="font-normal min-w-[150px] uppercase text-gray-3 mr-[16px]">{t(isClosePrice ? 'futures:order_table:close_price' : 'futures:mobile:market_price')}</div>
                            <div className={`font-medium ${bg}`}>{hide.price ? '*****' : isClosePrice ? closePrice : markPrice}</div>
                        </div>
                    </div>
                    {/* <div className='flex w-full px-[23px] p-[20px] justify-between'>
                            <div className='flex flex-col'>
                                <div>
                                    <div className="text-xs font-medium">{t('futures:referral_code')}</div>
                                    <div className="text-xl font-semibold">{codeRefer}</div>
                                </div>
                                <div className="text-[10px] font-medium">{t('futures:time_stamp')}: {time}</div>
                            </div>
                            <div className="bg-white rounded-[4px] shadow-mobile">
                                <div className="p-[7.5px]">
                                    <QRCode value={uriReferral} size={75} eyeRadius={1} className="rounded-[4px]" />
                                </div>
                            </div>
                        </div> */}
                </div>
            </Background>
        </Modal>
    );
}, (preProps, nextProps) => {
    return preProps.order?.displaying_id === nextProps.order?.displaying_id && preProps.pairPrice?.symbol === nextProps.pairPrice?.symbol
});

const Background = styled.div.attrs({
    className: 'w-[358px] h-[430px] m-auto'
})`
    background-image:${() => `url(${getS3Url('/images/screen/futures/bg_share.png')})`};
    background-position: center;
    background-repeat: no-repeat;     
    background-size: cover;
`
export default ShareFutureMobile;
