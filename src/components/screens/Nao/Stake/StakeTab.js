import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider } from 'components/screens/Nao/NaoStyle';
import styled from 'styled-components';
import { Minus, Plus } from 'react-feather';
import { getS3Url, formatNumber, getLoginUrl } from 'redux/actions/utils';
import colors from 'styles/colors';
import StateLockModal from './StateLockModal';
import { useRef } from 'react';
import fetchApi from 'utils/fetch-api';
import { API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'next-i18next';


const getBalance = createSelector(
    [
        state => state.wallet?.FUTURES,
        (wallet, params) => params
    ],
    (wallet, params) => {
        return wallet[params]?.value - wallet[params]?.locked_value
    }
);

const StakeTab = forwardRef(({ dataSource, getStake, assetNao }, ref) => {
    const { t, i18n: { language } } = useTranslation();
    const [hidden, setHidden] = useState(true);
    const [showLockModal, setShowLockModal] = useState(false);
    const isLock = useRef(false);
    const [referencePrice, setReferencePrice] = useState({})
    const balance = useSelector(state => getBalance(state, 447));

    useEffect(() => {
        getRef();
    }, [])

    useImperativeHandle(ref, () => ({
        showLock: onShowLockModal
    }))


    const onShowLockModal = (mode) => {
        isLock.current = mode;
        setShowLockModal(!showLockModal)
    }

    useEffect(() => {
        if (showLockModal) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [showLockModal])

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' },
            });
            if (data) {
                setReferencePrice(data.reduce((acm, current) => {
                    return {
                        ...acm,
                        [current.base]: current.price,
                    }
                }, {}))
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    const onConfirm = (data) => {
        getStake()
        setShowLockModal(false)
    }

    const staked = dataSource?.totalStaked ?? 0;
    return (
        <div className="flex flex-wrap gap-6">
            {showLockModal &&
                <StateLockModal isLock={isLock.current}
                    onConfirm={onConfirm} onClose={() => setShowLockModal(false)}
                    assetNao={assetNao} data={dataSource}
                    balance={isLock.current ? balance : (dataSource?.availableStaked ?? 0)}
                />}
            <CardNao className="text-center mt-10">
                <BackgroundImage className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <img src={getS3Url("/images/nao/ic_nao_large.png")} alt="" width="55" height="55" />
                </BackgroundImage>
                <TextLiner className="!text-lg leading-6 !w-full mb-3 !pb-0 pt-8">{t('nao:pool:staking_token')}</TextLiner>
                <div className="text-nao-grey text-sm px-[26px]">{t('nao:pool:share_revenue')}</div>
            </CardNao>
            <CardNao noBg stroke="1.5" className="pt-9 pb-8 bg-opacity-100">
                <div className="flex items-center justify-between pb-4">
                    <div className="text-sm font-medium text-nao-text uppercase">{t('nao:pool:est_apy')}</div>
                    <div className="text-[1.25rem] font-semibold">{formatNumber(dataSource?.estimateAPY ?? 0, 2)}%</div>
                </div>
                <div >
                    <label className={`text-nao-green text-sm font-semibold ${language !== 'vi' ? 'capitalize' : ''}`}>{t('nao:pool:total_staked')}</label>
                    <div className="text-nao-text mt-4 flex items-center justify-between space-x-4">
                        <div>
                            <div className="font-semibold leading-8 text-2xl break-all">{formatNumber(staked, assetNao?.assetDigit ?? 8)}</div>
                            <span className="text-sm font-medium">${formatNumber(staked * (referencePrice['VNDC'] ?? 1), assetNao?.assetDigit ?? 8)}</span>
                        </div>
                        <div className="flex  space-x-[10px]">
                            <div className={`w-[49px] h-[49px] ${staked ? 'border-nao-green' : 'border-nao-text'} border-[1.5px] rounded-xl flex justify-center items-center`}>
                                <Minus
                                    size={25}
                                    className={`cursor-pointer`}
                                    color={staked ? colors.nao.green : colors.nao.text}
                                    onClick={() => onShowLockModal(false)}
                                />
                            </div>
                            <div className={`w-[49px] h-[49px] ${staked ? 'border-nao-green' : 'border-nao-text'} border-[1.5px] rounded-xl flex justify-center items-center`}>
                                <Plus
                                    size={25}
                                    className={`cursor-pointer`}
                                    color={staked ? colors.nao.green : colors.nao.text}
                                    onClick={() => onShowLockModal(true)}
                                />
                            </div>
                        </div>
                    </div>
                    {!staked &&
                        <div className="mt-4">
                            <label className="text-nao-text font-medium leading-6 uppercase">Stake NAO</label>
                            <ButtonNao onClick={() => onShowLockModal(true)} className="h-12 mt-2 font-semibold">Stake</ButtonNao>
                        </div>
                    }
                    <Divider className="!opacity-100 !my-6" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-nao-bg4 shadow-nao rounded px-3 py-1 flex items-center cursor-pointer mr-3">
                                <img src={getS3Url("/images/nao/ic_refresh.png")} alt="" width="12" height="12" />
                                <span className="text-nao-green text-sm font-semibold ml-1">{t('nao:pool:auto')}</span>
                            </div>
                            <img className="min-w-[20px]" src={getS3Url('/images/nao/ic_help.png')} height={20} width={20} />
                        </div>
                        <div className="text-nao-green flex items-end space-x-1" onClick={() => setHidden(!hidden)}>
                            <div className="font-semibold">{t('nao:pool:hide')}</div>
                            <div className="w-5 h-5 flex items-center justify-center">
                                <img className={hidden ? '' : 'rotate-180'} src={getS3Url("/images/nao/ic_sort.png")} alt='' width="10" height="10" />
                            </div>
                        </div>
                    </div>
                    {!hidden &&
                        <div className="mt-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-nao-text font-medium text-sm leading-6">{t('nao:pool:total_staked')}</div>
                                    <div className="text-nao-white font-semibold text-sm text-right">{formatNumber(staked, assetNao?.assetDigit ?? 8)} NAO</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-nao-text font-medium text-sm leading-6">{t('nao:pool:total_users')}</div>
                                    <div className="text-nao-white font-semibold text-sm text-right">{t('nao:pool:users', { value: formatNumber(dataSource?.totalUser, 0) })}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-nao-text font-medium text-sm leading-6">{t('nao:pool:lock_duration')}</div>
                                    <div className="text-nao-white font-semibold text-sm text-right">{dataSource?.duration ?? 7} {t('nao:pool:days')}</div>
                                </div>
                            </div>
                            <div className="mt-5 space-x-2 flex items-center text-nao-text">
                                <div className="w-full py-2 px-5 bg-nao-bg4 flex justify-center items-center text-xs rounded-md">
                                    <div>Whitepaper</div>
                                </div>
                                <div className="w-full py-2 px-5 bg-nao-bg4 flex justify-center items-center text-xs rounded-md">
                                    <div>{t('nao:pool:guide')}</div>
                                </div>
                                {/* <div className="w-full py-2 px-5 bg-nao-bg4 flex justify-center items-center text-xs rounded-md">
                                    <div>Contract</div>
                                </div> */}
                            </div>
                        </div>
                    }
                </div>
            </CardNao>
        </div>
    );
});

const BackgroundImage = styled.div.attrs({
    className: 'w-[80px] h-[80px] rounded-[50%] flex justify-center items-center'
})`
    background: linear-gradient(101.26deg, #00144E -5.29%, #003A33 113.82%);
`



export default StakeTab;