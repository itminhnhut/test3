import React, { useState, memo, useEffect, useRef, useContext } from 'react';
import Modal from 'components/common/ReModal';
import { useTranslation } from 'next-i18next';
import Button from "components/common/Button";
import Switcher from '../../../../common/Switcher';
import { API_GET_ALL_ORDERS_BY_CONDTION, API_CLOSE_ALL_ORDERS_BY_CONDTION } from 'redux/actions/apis'
import FetchApi from 'utils/fetch-api';
import { useSelector } from 'react-redux';
import CloseProfit from 'components/screens/Mobile/Futures/CloseOrders/CloseProfit'
import numeral from 'numeral';
import { DangerIcon } from 'src/components/common/Icons';
import RadioBox from 'components/common/RadioBox';
import useOnScreen from 'hooks/useOnScreen';
import { set } from 'lodash';
import { AlertContext } from 'components/common/layouts/LayoutMobile';

const CloseOrdersByCondtionMobile = memo(({ onClose, onConfirm, isClosing, pair, tab, isMobile }) => {
    const { t } = useTranslation();

    const [showChooseType, setShowChooseType] = useState(true)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showConfirmAllPending, setShowConfirmAllPending] = useState(false)
    const [type, setType] = useState(null)
    const [showPositionList, setShowPositionList] = useState(false)
    const [state, setState] = useState({ isLoading: false, orders: null })
    const [PnLObject, setPnLObject] = useState({})
    const [totalPnL, setTotalPnL] = useState("")
    const [isMore, setIsMore] = useState(false)
    const context = useContext(AlertContext);

    const listInnerRef = useRef()

    // const onScroll = () => {
    //     if (state?.orders?.length <= 5) return
    //     if (listInnerRef.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
    //         if (scrollTop + clientHeight === scrollHeight) {
    //             setIsMore(false)
    //         } else {
    //             if (isMore) return setTimeout(() => setIsMore(false), 3000)
    //             setIsMore(true)

    //         }
    //     }
    // };

    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const assetConfig = useSelector(state => state.utils.assetConfig);

    const getOrdersByCloseType = async () => {
        setState({ ...state, isLoading: true })
        try {
            const response = await FetchApi({
                url: API_GET_ALL_ORDERS_BY_CONDTION,
                options: {
                    method: 'POST',
                },
                params: {
                    type,
                    pair
                },
            });
            if (response.status === 'ok' && response.data) {
                setState({ orders: response.data, isLoading: false })
                if (response.data.length > 5) setIsMore(true)
            }
        } catch (error) {
            console.log('Error when get orders by close type', error)
        }
    }

    const closeOrdersByCloseType = async () => {
        if (!state?.orders || state.orders.length === 0) return
        setState({ ...state, isLoading: true })
        isClosing({
            isClosing: 'true',
            timeout: state.orders.length * 3
        })
        try {
            const response = await FetchApi({
                url: API_CLOSE_ALL_ORDERS_BY_CONDTION,
                options: {
                    method: 'POST',
                },
                params: {
                    type,
                    pair
                },
            });
            if (response.status === 'ok' && response.data) {
                setState({ orders: response.data, isLoading: false })
            }
        } catch (error) {
            console.log('Error when get orders by close type', error)
        }
        onClose()
    }

    useEffect(() => {
        if (!type) return
        getOrdersByCloseType()
        setPnLObject({})
    }, [type])

    useEffect(() => {
        if (!PnLObject || !state.orders || showChooseType || !pair) return
        let pnl = 0
        for (const property in PnLObject) {
            pnl += PnLObject[property]
        }
        let totalPnl
        setTotalPnL(numeral(+pnl).format(
            `0,0.${'0'.repeat(pair.includes('VNDC') ? 0 : 4)}`,
            Math.floor
        ))
        if (Object.keys(PnLObject).length !== state.orders.length) setTotalPnL("-")
    }, [PnLObject, state])

    const formatPair = (pair) => {
        return pair.slice(0, pair.length - 4) + "/" + pair.slice(pair.length - 4)
    }

    const closeTypes = {
        position: [
            {
                type: 'ALL',
                value: t('futures:mobile.close_all_positions.close_type.close_all', { pair: formatPair(pair).includes('VNDC') ? 'VNDC' : 'USDT' })
            },
            {
                type: 'PROFIT',
                value: t('futures:mobile.close_all_positions.close_type.close_all_profit', { pair: formatPair(pair).includes('VNDC') ? 'VNDC' : 'USDT' })
            },
            {
                type: 'LOSS',
                value: t('futures:mobile.close_all_positions.close_type.close_all_loss', { pair: formatPair(pair).includes('VNDC') ? 'VNDC' : 'USDT' })
            },
            {
                type: 'PAIR',
                value: t('futures:mobile.close_all_positions.close_type.close_all_pair', { pair: formatPair(pair) })
            },
        ],
        openOrders: [
            {
                type: 'ALL_PENDING',
                value: t('futures:mobile.close_all_positions.close_type.close_all_pending', { pair: formatPair(pair).includes('VNDC') ? 'VNDC' : 'USDT' })
            },
            {
                type: 'ALL_PAIR_PENDING',
                value: t('futures:mobile.close_all_positions.close_type.close_all_pair_pending', { pair: formatPair(pair) })
            },
        ]
    }

    const doShow = (showType, options = {}) => {
        switch (showType) {
            case 'choose': {
                setState({ isLoading: false, orders: null })
                setShowChooseType(true)
                setShowConfirm(false)
                setShowConfirmAllPending(false)
                setType(null)
                setTotalPnL("")
                return;
            }
            case 'confirm': {
                // if (options.type === 'ALL_PENDING') {
                //     setShowConfirmAllPending(true)
                //     // renderCloseAllPendingModal(type)
                //     setShowChooseType(false)
                //     setShowConfirm(false)
                //     return
                // }
                setShowConfirmAllPending(false)
                setShowChooseType(false)
                setShowConfirm(true)
                return;
            }
            default:
                return;
        }
    }

    const calculatePnL = (profit) => {
        const before = PnLObject
        setPnLObject({ ...before, ...profit })
    }

    const renderCloseTypes = () => {
        const types = tab === 'position' ? closeTypes.position : closeTypes.openOrders
        return (
            <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
                modalClassName="z-[99999] flex justitfy-center h-full"
                onusClassName={"!px-4 pb-13 min-h-[200px] rounded-t-[16px] !bg-onus-bg3 !overflow-hidden !pt-9"}
                containerClassName="!bg-nao-bgModal2/[0.6]"
            >
                <div>
                    {types.map((closeType, index) => (
                        <div className={`h-12 rounded-md mt-2 bg-onus-bg flex items-center w-full py-3 px-4 justify-between ${closeType.type === type && '!border-onus-base border'}`} onClick={() => setType(closeType.type)}>
                            <div className="font-normal text-base leading-6">
                                {closeType.value}
                            </div>

                        </div>
                    ))}
                    <Button
                        disabled={!type}
                        onusMode
                        onClick={() => doShow('confirm', { type })}
                        type='primary'
                        componentType='button'
                        title={t(`futures:mobile.close_all_positions.preview`)}
                        className="!rounded-md text-nao-white! !h-12 mt-8 !text-base !font-semibold !leading-[22px] !tracking-[-0.02em]"
                    />
                </div>
            </Modal>
        )
    }

    const renderConfirmCloseOrders = (type) => {
        //call api
        return (
            <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
                modalClassName="z-[99999] flex justitfy-center h-full"
                onusClassName={"!px-4 pb-13 min-h-[200px] rounded-t-[16px] !bg-onus-bg3 !overflow-hidden !pt-11"}
                containerClassName="!bg-nao-bgModal2/[0.6]"
            >
                <div className="w-full leading-6 font-semibold tracking-[-0.02em] !text-[20px] mb-3">
                    <div>{type.includes('PAIR') ? t(`futures:mobile.close_all_positions.confirm_title.close_all_${type}`, { pair: formatPair(pair) }) : t(`futures:mobile.close_all_positions.confirm_title.close_all_${type}`, { pair: formatPair(pair).includes('VNDC') ? 'VNDC' : 'USDT' })}</div>
                </div>
                <div className='w-full h-full max-h-[calc(100%-112px)] overflow-y-auto'>
                    {state?.orders && renderCloseInfo()}
                    <div className="mt-3 flex w-full">
                        <div className="w-[22px]">
                            {DangerIcon({ height: "14", width: "14" })}
                        </div>
                        <div className="text-xs leading-[18px] font-medium tracking-[-0.02em] text-onus-orange w-full">
                            {t('futures:mobile.close_all_positions.confirm_description')}
                        </div>
                    </div>

                    <div className="flex mt-8 h-6 gap-2" style={{ display: `${state?.orders?.length > 0 && type !== 'ALL_PAIR_PENDING' && type !== 'ALL_PENDING' ? 'flex' : 'none'}` }}>
                        <div className="text-base font-semibold leading-[22px] tracking-[-0.02em]">
                            {t('futures:mobile.close_all_positions.position_list')}
                        </div>
                        <div>
                            <Switcher addClass="!w-[24px] !h-[24px] top-[0px] left-[0px] !bg-white" wrapperClass="!bg-onus-gray !h-[24px] !w-[48px]" onusMode onChange={() => {
                                setShowPositionList(!showPositionList)
                            }} active={showPositionList} />
                        </div>
                    </div>
                    <div className="w-full mt-2"
                        style={{ display: `${showPositionList ? 'block' : 'none'}` }}
                        ref={listInnerRef}
                        // onScroll={onScroll}
                    >
                        {state?.orders && renderPositionList()}
                    </div>
                    {/* {state?.orders?.length > 5 && <div className='text-onus-base w-full flex justify-center h-4 items-end'>
                        {showPositionList && isMore && IsMoreIcon}
                    </div>} */}
                </div>
                <div className="w-full flex justify-between gap-[10px] mt-8 h-12">
                    <Button
                        onusMode
                        onClick={() => doShow('choose')}
                        componentType='button'
                        title={t('common:back')}
                        className="!rounded-md text-nao-white! !text-base !font-semibold !leading-[22px] !tracking-[-0.02em]"
                    />
                    <Button
                        disabled={state?.orders?.length === 0}
                        onusMode
                        onClick={() => closeOrdersByCloseType()}
                        type='primary'
                        componentType='button'
                        title={t('common:confirm')}
                        className={`!rounded-md text-nao-white! !text-base !font-semibold !leading-[22px] !tracking-[-0.02em]`}
                    />
                </div>

            </Modal>
        )
    }

    const renderCloseInfo = () => {
        return (
            <div className="font-normal text-sm leading-5 w-full">
                <div className={`h-11 min-h-full border-b border-onus-bg2 flex items-center w-full`} style={{ display: `${type !== 'ALL_PAIR_PENDING' && type !== 'ALL_PENDING' ? 'flex' : 'none'}` }}>
                    <div className="w-full flex justify-between">
                        <div className='text-onus-grey'>
                            {t('futures:mobile.close_all_positions.estimated_pnl')}
                        </div>
                        {!totalPnL.includes('-') ? (
                            <div className='text-onus-green'>
                                {totalPnL ? '+' : '-'}{totalPnL} {pair.includes('VNDC') ? 'VNDC' : 'USDT'}
                            </div>
                        ) : (
                            <div className='text-onus-red'>
                                {totalPnL} {pair.includes('VNDC') ? 'VNDC' : 'USDT'}
                            </div>
                        )}
                    </div>
                </div>
                <div className={`h-11 min-h-full border-b border-onus-bg2 flex items-center w-full`}>
                    <div className="w-full flex justify-between">
                        <div className='text-onus-grey'>
                            {t('futures:mobile.close_all_positions.estimated_time')}
                        </div>
                        <div>
                            {state?.orders?.length * 0.5}s
                        </div>
                    </div>
                </div>

                <div className={`h-11 min-h-full flex items-center w-full`}>
                    <div className="w-full flex justify-between">
                        <div className='text-onus-grey'>
                            {t('futures:mobile.close_all_positions.estimated_orders')}
                        </div>
                        <div>
                            {state?.orders?.length} {state?.orders?.length > 1 ? t('futures:mobile.close_all_positions.orders') : t('futures:mobile.close_all_positions.order')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPositionList = () => {
        return state?.orders?.map((order, index) => {
            const dataMarketWatch = marketWatch[order?.symbol];
            const symbol = allPairConfigs.find(rs => rs.symbol === order.symbol);
            const decimalSymbol = assetConfig.find(rs => rs.id === symbol?.quoteAssetId)?.assetDigit ?? 0;
            const isVndcFutures = symbol?.quoteAsset === 'VNDC';
            return (
                <div
                    key={order.displaying_id}
                    style={{ display: `${showPositionList && state?.orders?.length > 0 ? 'block' : 'none'}` }}
                // ref={index === state?.orders?.length - 1 ? ref : undefined}
                >
                    <CloseProfit key={order.displaying_id} onusMode={true} className="flex flex-col" index={index} length={state?.orders?.length} doShow={() => doShow('confirm', type)} calculatePnL={calculatePnL}
                        order={order} initPairPrice={dataMarketWatch} isMobile decimal={isVndcFutures ? decimalSymbol : decimalSymbol + 2}
                    />
                </div>
            )
        })
    }

    const renderCloseAllPendingModal = (type) => {
        // context.alert.show('warning',
        //     t(`futures:mobile.close_all_positions.confirm_title.close_all_${type}`, { pair: formatPair(pair) }),
        //     t(`futures:mobile.close_all_positions.confirm_close_pending_description`),
        //     null,
        //     () => closeOrdersByCloseType(),
        // );
        return (
            <Modal onusMode={true} isVisible={true} onBackdropCb={onClose}
                modalClassName="z-[99999] flex justitfy-center h-full"
                onusClassName={"!px-9 pb-13 min-h-[304px] !bg-onus-bg3 !overflow-hidden !pt-11 !bottom-[52px] rounded-[16px]"}
                containerClassName="!bg-nao-bgModal2/[0.6] !px-4"
            >
                <div className='w-full flex justify-center mb-8'>
                    {DangerIcon({ height: "80", width: "80" })}
                </div>

                <div className="w-full leading-6 font-semibold tracking-[-0.02em] !text-lg mb-3 text-center">
                    <div>{t(`futures:mobile.close_all_positions.confirm_title.close_all_${type}`, { pair: formatPair(pair) })}</div>
                </div>
                <div className="w-full leading-[22ox] font-normal tracking-[-0.02em] !text-base text-center text-onus-grey">
                    <div>{t(`futures:mobile.close_all_positions.confirm_close_pending_description`)}</div>
                </div>

                <div className="w-full flex justify-between mt-8 gap-[10px] h-12">
                    <Button
                        onusMode
                        onClick={() => doShow('choose')}
                        componentType='button'
                        title={t('common:back')}
                        className="!rounded-md text-nao-white! !text-base !font-semibold !leading-[22px] !tracking-[-0.02em]"
                    />
                    <Button
                        onusMode
                        onClick={() => closeOrdersByCloseType()}
                        type='primary'
                        componentType='button'
                        title={t('common:confirm')}
                        className="!rounded-md text-nao-white! !text-base !font-semibold !leading-[22px] !tracking-[-0.02em]"
                    />
                </div>
            </Modal>
        )
    }


    return (
        <>
            {showChooseType && renderCloseTypes()}
            {showConfirm && type && renderConfirmCloseOrders(type)}
            {showConfirmAllPending && type && renderCloseAllPendingModal(type)}
        </>
    )
})

export default CloseOrdersByCondtionMobile

const IsMoreIcon = <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.28138 5.7215C6.12551 5.87578 5.87449 5.87578 5.71862 5.7215L0.629212 0.684296C0.375223 0.432913 0.553236 -1.08813e-06 0.910592 -1.05689e-06L11.0894 -1.67029e-07C11.4468 -1.35788e-07 11.6248 0.432913 11.3708 0.684297L6.28138 5.7215Z" fill="#8492A7" />
</svg>


