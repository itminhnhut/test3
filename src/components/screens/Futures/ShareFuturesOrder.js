import React, { useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';

import Modal from 'components/common/ReModal';
import { useSelector } from 'react-redux';
import CheckBox from 'components/common/CheckBox';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import classNames from 'classnames';
import { getProfitVndc, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { IconLoading } from 'components/common/Icons';

const {PENDING, ACTIVE, CLOSED} = VndcFutureOrderType.Status
const APP_URL = process.env.APP_URL || 'https://nami.exchange'

const ShareFuturesOrder = ({isVisible, onClose, pairPrice, order = {}, isClosePrice}) => {
    const [hide, setHide] = useState({
        leverage: false,
        pnl: false,
        price: false,
    })
    const [downloading, setDownloading] = useState(false)
    const refNodeInfoOrder = useRef(null)
    const codeRefer = useSelector((state) => state.auth?.user?.code_refer)
    const uriReferral = APP_URL + '/referral?ref=' + codeRefer

    const {
        leverage = '',
        profit = '',
        percent = '',
        price = '',
        markPrice = '',
        closePrice = '',
        time = ''
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
            profit: formatNumber(profit, 0, 0, true),
            percent: formatNumber((profit / order?.margin), 2, 0, true) + '%',
            price: formatNumber(price, 8),
            markPrice: formatNumber(pairPrice?.lastPrice, 8),
            closePrice: formatNumber(order?.close_price, 8),
            time: formatTime(order?.created_at)
        }
    }, [order?.displayingId, pairPrice])

    const downloadImage = () => {
        const node = refNodeInfoOrder.current;
        if (downloading || !node) return;
        setDownloading(true)
        const element = ReactDOM.findDOMNode(node);
        return html2canvas(element, {
            useCORS: true,
        }).then(canvas => {
            const uri = canvas.toDataURL('svg', 1.0)
            const link = document.createElement('a');

            link.href = uri;
            link.download = codeRefer + '.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloading(false)
        });
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='p-0 w-[596px] h-[448px] dark:border border-divider-dark '
        >
            <div className='flex flex-col h-full rounded'>
                <div ref={refNodeInfoOrder}
                     className='flex flex-col flex-1 rounded bg-gradient-to-r from-teal to-[#00BEB3] my-[-10px] px-8 pt-8 py-5'>
                    <div>
                        <Image src="/images_v2/share-order-logo.svg" width={120} height={30}/>
                    </div>
                    <div className='flex flex-row flex-1 mt-6'>
                        <div className='flex flex-col w-2/3 text-white'>
                            <div className='grow'>
                                <div className='font-medium'>
                                    <span>Long</span>
                                    <span className='px-3'>|</span>
                                    <span>{hide.leverage ? '***' : `${leverage}x`}</span>
                                    <span className='px-3'>|</span>
                                    <span>{pairPrice?.symbol} Perpetual</span>
                                </div>
                                <div>
                                    <span className='text-5xl font-semibold'>{percent}</span>
                                    <span
                                        className='text-lg font-medium pl-3'>({hide.pnl ? '*******' : profit} {pairPrice?.quoteAsset})</span>
                                </div>
                                <div className='flex flex-row'>
                                    <div className='font-medium'>
                                        <div className='pb-1'>Entry Price</div>
                                        <div> {isClosePrice ? <div>Close Price</div> : <div>Mark Price</div>} </div>
                                    </div>
                                    <div className='font-semibold ml-6'>
                                        <div
                                            className='pb-1'>{hide.price ? '*****' : price} {pairPrice?.quoteAsset}</div>
                                        {isClosePrice ? <div>{closePrice} {pairPrice?.quoteAsset}</div> :
                                            <div>{markPrice} {pairPrice?.quoteAsset}</div>}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-auto text-xs font-semibold'>
                                Time Stamp: {time}
                            </div>
                        </div>
                        <div>
                            <div className='p-3 bg-white rounded-xl'>
                                <QRCode value={uriReferral} size={116} eyeRadius={1}/>
                            </div>
                            <div className='flex flex-col items-center text-white mt-3'>
                                <div className='text-sm font-medium'>Referral Code</div>
                                <div className='text-xl font-semibold'>{codeRefer}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between h-[142px] px-8 py-6 bg-white rounded-md'>
                    <div className='flex flex-row justify-between'>
                        <span className='text-gray-1'>Optional Information to share</span>
                        <div className='flex flex-row justify-between'>
                            <CheckBox
                                label='Leverage'
                                className='mr-6'
                                active={!hide.leverage}
                                onChange={() => setHide({...hide, leverage: !hide.leverage})}
                            />
                            <CheckBox
                                label='PNL Amount'
                                className='mr-6'
                                active={!hide.pnl}
                                onChange={() => setHide({...hide, pnl: !hide.pnl})}
                            />
                            <CheckBox
                                label='Price'
                                active={!hide.price}
                                onChange={() => setHide({...hide, price: !hide.price})}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row justify-center space-x-6'>
                        <div
                            className='flex justify-center items-center cursor-pointer w-full h-[50px] rounded-xl font-semibold bg-bgBtnSecondary text-txtBtnSecondary hover:opacity-80'
                            onClick={onClose}
                        >
                            Cancel
                        </div>
                        <div
                            className={classNames(
                                'flex justify-center items-center cursor-pointer w-full h-[50px] rounded-xl font-semibold bg-bgBtnPrimary text-txtBtnPrimary hover:opacity-80',
                                {'!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3': downloading}
                            )}
                            onClick={() => downloadImage()}
                        >
                            <span>Download </span>
                            {downloading && <span> <IconLoading color='#FFFFFF'/> </span>}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default React.memo(ShareFuturesOrder, (preProps, nextProps) => {
    return preProps.isVisible === nextProps.isVisible && preProps.order?.displaying_id === nextProps.order?.displaying_id && preProps.pairPrice?.symbol === nextProps.pairPrice?.symbol
})
