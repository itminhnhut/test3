import React, { useState, useMemo, memo, useRef } from 'react';
import Modal from 'components/common/ReModal';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import CheckBox from 'components/common/CheckBox';
import { useTranslation } from 'next-i18next';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, formatTime } from 'redux/actions/utils';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import classNames from 'classnames';

const { PENDING, ACTIVE, CLOSED } = VndcFutureOrderType.Status
const APP_URL = process.env.APP_URL || 'https://nami.exchange'
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
        quoteAsset = ''
    } = useMemo(() => {
        if (!order) return {}

        const profit = getProfitVndc(order, pairPrice?.lastPrice)
        let price = {
            [PENDING]: order?.price,
            [ACTIVE]: order?.open_price,
            [CLOSED]: order?.close_price,
        }[order?.status]

        if (isClosePrice) price = order?.open_price

        return {
            leverage: order?.leverage,
            profit: formatNumber(isClosePrice ? order?.profit : profit, 0, 0, true),
            percent: formatNumber(((isClosePrice ? order?.profit : profit) / order?.margin) * 100, 2, 0, true) + '%',
            price: formatNumber(price, 8),
            markPrice: formatNumber(pairPrice?.lastPrice, 8),
            closePrice: formatNumber(order?.close_price, 8),
            time: formatTime(order?.created_at),
            quoteAsset: pairPrice?.quoteAsset ?? order?.symbol
        }
    }, [order, pairPrice])

    const downloadImage = () => {
        const node = refNodeInfoOrder.current;
        if (downloading || !node) return;
        // setDownloading(true)
        return html2canvas(refNodeInfoOrder.current, {
            allowTaint: true,
            useCORS: true,
        }).then(canvas => {
            const uri = canvas.toDataURL("image/png", 1)
            console.log(uri)
            // const link = document.createElement('a');

            // link.href = uri;
            // link.download = codeRefer + '.png';
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // setDownloading(false)
        });
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='p-0 w-[330px] min-h-[600px] top-[50%] rounded-[12px] !bg-dominant !border-0 '
        >
            <div className='flex flex-col h-full rounded-[12px]' >
                <div ref={refNodeInfoOrder} className='flex flex-col rounded-t-[12px] flex-1  items-center text-white'
                    style={{ background: 'linear-gradient(157.98deg, rgba(0, 220, 194, 0.9) 15.55%, #00B6C7 72.38%)' }}>
                    <div className='p-[23px]'>
                        <img src="/images/share-order-logo.svg" width={120} height={30} />
                    </div>
                    <div className="flex w-full px-[50px] mb-[12px]" style={{ backgroundColor: 'rgb(255 255 255 / 20%)' }}>
                        <div className="flex justify-evenly w-full text-white text-xs font-medium p-[5px] ">
                            <span>Long</span>|
                            <span>{hide.leverage ? '***' : `${leverage}x`}</span>|
                            <span>{order?.symbol} {t('futures:tp_sl:perpetual')}</span>
                        </div>
                    </div>
                    <div className="text-[46px] font-semibold py-[14px] h-[52px]">
                        {percent}
                    </div>
                    <div className='text-lg font-medium'>({hide.pnl ? '*******' : profit} {quoteAsset})</div>
                    <div className="flex justify-around w-full py-[12px]">
                        <div className='flex flex-col items-center w-1/2 justify-center'>
                            <div className='text-xs font-medium'>{t('futures:order_table:open_price')}</div>
                            <div className='text-sm font-semibold'>{hide.price ? '*****' : price} {quoteAsset}</div>
                        </div>
                        <div className='bg-[#E2E8F0] w-[1px] opacity-[0.5]'></div>
                        <div className='flex flex-col items-center w-1/2 justify-center'>
                            <div className='text-xs font-medium'>{t(isClosePrice ? 'futures:order_table:close_price' : 'futures:order_table:mark_price')}</div>
                            <div className='text-sm font-semibold'>{hide.price ? '*****' : isClosePrice ? closePrice : markPrice} {quoteAsset}</div>
                        </div>
                    </div>
                    <div className='px-[23px] w-full pt-[4px]'>
                        <div className='bg-[#E2E8F0] w-full h-[1px] opacity-[0.5]'></div>
                    </div>
                    <div className='flex w-full px-[23px] p-[20px] justify-between'>
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
                    </div>
                </div>
                <div className="bg-white rounded-[12px] h-[212px] p-[23px]">
                    <div className="text-teal text-center font-medium text-sm">{t('futures:optional_information')}</div>
                    <div className="flex justify-between py-[12px]">
                        <CheckBox
                            label={t('futures:leverage:leverage')}
                            labelClassName="!font-medium !text-sm !text-gray-1"
                            boxContainerClassName={!hide.leverage ? '!border-0' : ''}
                            active={!hide.leverage}
                            onChange={() => setHide({ ...hide, leverage: !hide.leverage })}
                        />
                        <CheckBox
                            label={t('futures:mobile:pnl')}
                            labelClassName="!font-medium !text-sm !text-gray-1"
                            boxContainerClassName={!hide.pnl ? '!border-0' : ''}
                            active={!hide.pnl}
                            onChange={() => setHide({ ...hide, pnl: !hide.pnl })}
                        />
                        <CheckBox
                            label={t('futures:price')}
                            labelClassName="!font-medium !text-sm !text-gray-1"
                            boxContainerClassName={!hide.price ? '!border-0' : ''}
                            active={!hide.price}
                            onChange={() => setHide({ ...hide, price: !hide.price })}
                        />
                    </div>
                    <div
                        className={classNames('bg-dominant rounded-[6px] text-sm font-semibold text-center py-[12px] my-[8px]',
                            { '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3': downloading }
                        )}
                        onClick={() => downloadImage()}>{t('futures:download')}</div>
                    <div className="bg-[#F5F5F5] text-teal rounded-[6px] text-sm font-semibold text-center py-[12px]" onClick={onClose}>{t('common:cancel')}</div>
                </div>
            </div>
        </Modal>
    );
}, (preProps, nextProps) => {
    return preProps.order?.displaying_id === nextProps.order?.displaying_id && preProps.pairPrice?.symbol === nextProps.pairPrice?.symbol
});

export default ShareFutureMobile;