import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider, Tooltip } from 'components/screens/Nao/NaoStyle';
import styled from 'styled-components';
import { Minus, Plus } from 'react-feather';
import { getS3Url, formatNumber, getLoginUrl } from 'redux/actions/utils';
import colors from 'styles/colors';
import StateLockModal from './StateLockModal';
import { useRef } from 'react';
import fetchApi from 'utils/fetch-api';
import { API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { useTranslation } from 'next-i18next';
import { requestNao } from 'redux/actions/nao';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';

const getBalance = createSelector([(state) => state.wallet?.NAO_FUTURES, (wallet, params) => params], (wallet, params) => {
    return wallet ? wallet[params]?.value - wallet[params]?.locked_value : 0;
});

const StakeTab = forwardRef(({ dataSource, getStake, assetNao }, ref) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [hidden, setHidden] = useState(true);
    const [showLockModal, setShowLockModal] = useState(false);
    const isLock = useRef(false);
    const [referencePrice, setReferencePrice] = useState({});
    const balance = useSelector((state) => getBalance(state, 447));
    const dispatch = useDispatch();

    useEffect(() => {
        getRef();
    }, []);

    useImperativeHandle(ref, () => ({
        showLock: onShowLockModal
    }));

    const onShowLockModal = (mode) => {
        isLock.current = mode;
        setShowLockModal(!showLockModal);
    };

    useEffect(() => {
        if (showLockModal) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [showLockModal]);

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' }
            });
            if (data) {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [current.base]: current.price
                        };
                    }, {})
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const onConfirm = (data) => {
        getStake();
        setShowLockModal(false);
        dispatch(requestNao());
    };

    const onRedirect = (key) => {
        let url = '';
        switch (key) {
            case 'whitepaper':
                url = 'https://naotoken.gitbook.io/du-an-nao';
                break;
            case 'contract':
                url = 'https://bscscan.com/address/0x07430e1482574389bc0e5d33cfb65280e881ee8c';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    };

    const staked = dataSource?.totalStaked ?? 0;

    return (
        <div className="flex flex-wrap gap-6">
            {showLockModal && (
                <StateLockModal
                    isLock={isLock.current}
                    onConfirm={onConfirm}
                    onClose={() => setShowLockModal(false)}
                    assetNao={assetNao}
                    data={dataSource}
                    balance={isLock.current ? balance : dataSource?.availableStaked ?? 0}
                />
            )}
            <CardNao className="text-center mt-10" bgStake>
                <BackgroundImage className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} alt="" width="55" height="55" />
                </BackgroundImage>
                <TextLiner className="!text-xl leading-6 !w-full mb-3 !pb-0 pt-8 !normal-case !text-txtPrimary dark:!text-txtPrimary-dark">
                    {t('nao:pool:staking_token')}
                </TextLiner>
                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm px-[26px]">{t('nao:pool:revenue_share_from_trade')}</div>
            </CardNao>
            <CardNao stroke="1.5" className="py-6 px-4 !bg-none border border-divider dark:border-none">
                <div className="flex items-center justify-between pb-4">
                    <div className="text-sm font-semibold text-txtSecondary dark:text-txtSecondary-dark uppercase">{t('nao:pool:est_apy')}</div>
                    <div className="text-lg font-semibold">{dataSource?.apy > 0 ? formatNumber(dataSource?.apy ?? 0, 2) : '--'}%</div>
                </div>
                <div>
                    <label className={`text-teal text-xs ${language !== 'vi' ? 'capitalize' : ''}`}>{t('nao:pool:staked_title')}</label>
                    <div className="mt-4 flex items-center justify-between space-x-4">
                        <div className="space-y-0.5">
                            <div className="font-semibold text-xl break-all">{formatNumber(dataSource?.availableStaked ?? 0, assetNao?.assetDigit ?? 8)}</div>
                            <span className="text-sm">
                                ${formatNumber((dataSource?.availableStakedVNDC ?? 0) * (referencePrice['VNDC'] ?? 1), assetNao?.assetDigit ?? 8)}
                            </span>
                        </div>
                        <div className="flex space-x-[10px]">
                            <div
                                onClick={() => onShowLockModal(false)}
                                className={`cursor-pointer w-11 h-11 ${
                                    staked ? 'border-teal' : 'border-teal'
                                } border-[1.5px] rounded-md flex justify-center items-center`}
                            >
                                <Minus size={25} className={`cursor-pointer`} color={staked ? colors.teal : colors.teal} />
                            </div>
                            <div
                                onClick={() => onShowLockModal(true)}
                                className={`cursor-pointer w-11 h-11 ${
                                    staked ? 'border-teal' : 'border-teal'
                                } border-[1.5px] rounded-md flex justify-center items-center`}
                            >
                                <Plus size={25} color={staked ? colors.teal : colors.teal} />
                            </div>
                        </div>
                    </div>
                    {/* <div className='flex justify-between mt-2'>
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs">{t('nao:pool:equivalent')}</div>
                        <span className="text-txtPrimary dark:text-txtPrimary-dark text-sm font-semibold">${formatNumber((dataSource?.availableStakedVNDC ?? 0) * (referencePrice['VNDC'] ?? 1), assetNao?.assetDigit ?? 8)}</span>
                    </div> */}
                    {dataSource?.isNewUser && (
                        <div className="mt-8">
                            <ButtonNao onClick={() => onShowLockModal(true)} className="h-12 font-semibold">
                                Stake
                            </ButtonNao>
                        </div>
                    )}
                    <hr className="!opacity-100 !my-4 border-divider dark:border-divider-dark" />
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            <Tooltip
                                id="tooltip-auto"
                                place="top"
                                effect="solid"
                                className="w-full sm_only:!max-w-[calc(100%-2rem)] sm_only:!mx-4 sm_only:after:!left-8 sm_only:after:translate-x-[-50%]"
                                overridePosition={({ top, left }) => {
                                    if (window?.innerWidth < 640) {
                                        // 640 is the breakpoint of small devices
                                        return {
                                            top,
                                            left: 0
                                        };
                                    }

                                    return { top, left };
                                }}
                            />
                            <div
                                className="mr-3 font-semibold border-b border-gray-1 dark:border-gray-7 border-dashed text-sm"
                                data-tip={t('nao:pool:tooltip_auto')}
                                data-for="tooltip-auto"
                            >
                                {t('nao:pool:auto')}
                            </div>
                            {/* <div data-tip={t('nao:pool:tooltip_auto')} data-for="tooltip-auto" >
                                <QuestionMarkIcon size={20} />
                            </div> */}
                        </div>
                        <div className="text-teal flex items-end space-x-1 text-sm" onClick={() => setHidden(!hidden)}>
                            <div className="font-semibold">{t(`nao:pool:${!hidden ? 'hide' : 'show'}`)}</div>
                            <ArrowDropDownIcon size={20} isFilled color="currentColor" className={`transition-all ${hidden ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {!hidden && (
                        <div className="mt-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm leading-6">
                                        {t('nao:pool:total_available_staked')}
                                    </div>
                                    <div className="font-semibold text-sm text-right">{formatNumber(staked, assetNao?.assetDigit ?? 8)} NAO</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm leading-6">{t('nao:pool:total_users')}</div>
                                    <div className="font-semibold text-sm text-right">
                                        {t('nao:pool:users', { value: formatNumber(dataSource?.totalUser, 0) })}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm leading-6">{t('nao:pool:lock_duration')}</div>
                                    <div className="font-semibold text-sm text-right">
                                        {dataSource?.duration ?? 7} {t('nao:pool:days')}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 space-x-2 flex items-center font-semibold text-txtPrimary dark:text-txtSecondary-dark">
                                <div
                                    onClick={() => onRedirect('whitepaper')}
                                    className="w-full py-3 px-5 bg-gray-12 dark:bg-dark-2 flex justify-center items-center text-sm font-semibold rounded-md"
                                >
                                    <div>Whitepaper</div>
                                </div>
                                <div
                                    onClick={() => onRedirect('contract')}
                                    className="w-full py-3 px-5 bg-gray-12 dark:bg-dark-2 flex justify-center items-center text-sm font-semibold rounded-md"
                                >
                                    <div>Smart contract</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardNao>
        </div>
    );
});

const BackgroundImage = styled.div.attrs({
    className: 'w-[80px] h-[80px] rounded-[50%] flex justify-center items-center'
})`
    background: linear-gradient(101.26deg, #00144e -5.29%, #003a33 113.82%);
`;

export default StakeTab;
