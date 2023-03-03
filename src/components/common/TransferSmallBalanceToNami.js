import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect } from 'react';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const TransferSmallBalanceToNami = ({ width, className, allAssets, usdRate }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false)
    const [listCheck, setListCheck] = useState({})
    const [isCheckAll, setIsCheckAll] = useState(false)

    useEffect(() => {
        if (allAssets) {
            const parseArray = _.reduce(
                allAssets,
                (acc, { id, wallet }) => {
                    if (id === 1) return acc
                    return {
                        ...acc, [id]: false
                    }
                },
                {}
            )

            setListCheck(parseArray)
        }
    }, [allAssets])

    useEffect(() => {
        setListCheck(prev => _.mapValues(prev, () => !!isCheckAll))
    }, [isCheckAll])

    const namiUsdRate = usdRate?.['1'] || 0;

    return (
        <>
            <button
                onClick={() => setIsShowPoppup(prev => !prev)}
                className={`bg-gray-10 dark:bg-dark-2 flex items-center justify-between text-txtTabHover dark:text-white 
           text-sm gap-3 rounded-md px-4 py-3 cursor-pointer ${className}`}
            >
                <LogoIcon />
                <div className="flex items-center gap-3">
                    {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}
                    <BxChevronDown size={24} />
                </div>
            </button>

            <ModalV2
                isVisible={isShowPoppup}
                onBackdropCb={() => setIsShowPoppup(false)}
                className="!max-w-[488px]"
                wrapClassName='py-[30px] px-0'
                btnCloseclassName="px-8"
            >
                <div className='pt-4 text-gray-15 dark:text-gray-4 tracking-normal text-base'>
                    <div className='txtPri-3 px-8'>{t('wallet:convert_small_balance')}</div>
                    <div className='mt-6 max-h-[508px] h-full overflow-y-scroll px-8'>
                        {allAssets.map(item => {
                            if (item?.id === 1)
                                return null; // Token Nami

                            const { assetCode, assetDigit, assetName, id, status, wallet, walletTypes, available } = item

                            const assetUsdRate = usdRate?.[item?.id] || 0;
                            const totalUsd = available * assetUsdRate;
                            const totalNami = totalUsd / namiUsdRate;

                            const namiValue = formatWallet(totalNami, 1)

                            return <div key={'convert_small_ballance_' + id} className='py-3 flex items-center gap-2'>
                                <CheckBox
                                    className="w-[100px]"
                                    boxContainerClassName='w-5 h-5'
                                    labelClassName='text-gray-15 dark:text-gray-4 tracking-normal text-base'
                                    label={assetCode}
                                    onChange={() => setListCheck({ ...listCheck, [id]: !listCheck[id] })}
                                    active={listCheck[id]}
                                />
                                <span className="flex-auto text-right">
                                    {available
                                        ? formatWallet(available, assetCode === 'USDT' ? 2 : assetDigit)
                                        : '0.0000'}
                                </span>
                                <div className="w-[154px] text-right overflow-hidden">
                                    {namiValue}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className='px-8 border-t border-divider dark:border-divider-dark'>
                        <div className='py-6 flex items-center justify-between select-none'>
                            <CheckBox
                                className="w-[100px]"
                                boxContainerClassName='w-5 h-5'
                                labelClassName='text-gray-15 dark:text-gray-4 tracking-normal text-base font-semibold'
                                label={t('common:all')}
                                onChange={() => setIsCheckAll(prev => !prev)}
                                active={isCheckAll}
                            />
                            <span className="flex-auto text-right">
                                {'6 ' + t('wallet:selected')}
                            </span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='txtSecond-1'>{t('convert:you_will_get')}</span>
                            <span className='text-gray-15 dark:text-gray-4 tracking-normal text-[18px] leading-[26px] font-semibold'>
                                {2462346}
                            </span>
                        </div>
                        <ButtonV2 className="px-6 !text-sm w-full mt-10" onClick={() => console.log("Hello world")}>
                            {t('common:convert')}
                        </ButtonV2>
                    </div>
                </div>
            </ModalV2>
        </>
    );
};

export default TransferSmallBalanceToNami;
