import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState } from 'react';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';


const TransferSmallBalanceToNami = ({ width, className, allAssets, usdRate }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false)
    const [listCheck, setListCheck] = useState({})
    const getUsdRate = (id) => {
        const x = usdRate?.[id + ''] || 0;
        // console.log("__x: ", id, x);
    }
    // console.log("____", usdRate);

    useState(() => {
        if (allAssets) {
            const namiUsdRate = usdRate?.['1'] || 0;

            const parseArray = _.reduce(
                allAssets,
                (acc, { id, wallet }) => ({
                    ...acc, [id]: {
                        // value: wallet?.value
                        //     ? formatWallet(wallet?.value, assetCode === 'USDT' ? 2 : assetDigit)
                        //     : '0.0000',
                        isCheck: false,
                        namiValue: wallet?.value * usdRate?.[id] / namiUsdRate
                    }
                }),
                {}
            )
            setListCheck(parseArray)
        }
    }, [allAssets, usdRate])

    console.log("______listCheck", listCheck);

    return (
        <>
            <button
                onClick={() => setIsShowPoppup(!isShowPoppup)}
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
                isVisible={true}
                onBackdropCb={() => setIsShowPoppup(false)}
                className="!max-w-[488px]"
                wrapClassName='py-[30px] px-0'
                btnCloseclassName="px-8"
            >
                <div className='pt-4 text-gray-15 dark:text-gray-4 tracking-normal text-base'>
                    <div className='txtPri-3 px-8'>{t('wallet:convert_small_balance')}</div>
                    <div className='mt-6 max-h-[508px] h-full overflow-y-scroll px-8'>
                        {allAssets.map(item => {
                            const { assetCode, assetDigit, assetName, id, status, wallet, walletTypes } = item
                            const { locked_value, type, value } = wallet

                            return <div key={'convert_small_ballance_' + id} className='py-3 flex items-center gap-2'>
                                <CheckBox
                                    className="w-[100px]"
                                    boxContainerClassName='w-5 h-5'
                                    labelClassName='text-gray-15 dark:text-gray-4 tracking-normal text-base'
                                    label={assetCode}
                                    // onChange={() => setIsDefault(!isDefault)}
                                    active={listCheck[id]}
                                />
                                <span className="flex-auto text-right">
                                    {value
                                        ? formatWallet(value, assetCode === 'USDT' ? 2 : assetDigit)
                                        : '0.0000'}
                                </span>
                                <div className="w-[154px] text-right overflow-hidden">
                                    {value}
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </ModalV2>
        </>
    );
};

export default TransferSmallBalanceToNami;
