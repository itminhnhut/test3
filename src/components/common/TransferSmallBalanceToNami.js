import { useTranslation } from 'next-i18next';
import { LogoIcon, BxChevronDown } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState } from 'react';

const TransferSmallBalanceToNami = ({ width, className, allAssets }) => {
    const { t } = useTranslation();
    const [isShowPoppup, setIsShowPoppup] = useState(false)

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
                wrapClassName='py-[30px]'
            >
                <div className='pt-4 text-gray-15 dark:text-gray-4 tracking-normal text-base'>
                    <span className='txtPri-3'>{t('wallet:convert_small_balance')}</span>
                    <div className='bg-white mt-6 max-w-[508px] overflow-hidden overflow-y-auto'>
                        {allAssets.map(item => {
                            console.log("allAssets", item);
                            const { assetCode } = item
                            return <div className='py-2'>
                                {assetCode}
                            </div>
                        })}
                    </div>
                </div>
            </ModalV2>
        </>
    );
};

export default TransferSmallBalanceToNami;
