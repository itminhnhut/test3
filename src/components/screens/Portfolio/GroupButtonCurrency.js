import React, { useRef, useState } from 'react';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import classNames from 'classnames';
import { ChevronDown } from 'react-feather';
import { ArrowDownIcon, CheckCircleIcon } from 'components/svg/SvgIcon';
import useOutsideClick from 'hooks/useOutsideClick';
import styled from 'styled-components';

export default ({ className, typeCurrency, setTypeCurrency, isMobile }) => {
    const [isShowModalChooseCurrency, setIsShowModalChooseCurrency] = useState(false);
    const fromAssetListRef = useRef();
    useOutsideClick(fromAssetListRef, () => isShowModalChooseCurrency && setIsShowModalChooseCurrency(false));

    if (isMobile)
        return (
            <div className="">
                <div
                    onClick={() => setIsShowModalChooseCurrency((prev) => !prev)}
                    className={classNames('px-4 py-2 border rounded-full cursor-pointer font-normal flex items-center gap-x-1 text-sm', {
                        'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': true
                    })}
                >
                    {typeCurrency === ALLOWED_ASSET_ID.USDT ? 'USDT' : 'VNDC'}
                    <ArrowDownIcon size={12} className={`${isShowModalChooseCurrency ? '!rotate-0' : ''} rotate-180 transition-all`} />
                </div>
                <AssetList className={!isShowModalChooseCurrency && 'hidden'}>
                    <div ref={fromAssetListRef} className="bg-white dark:bg-dark-4 py-2">
                        <AssetItem
                            onClick={() => {
                                setTypeCurrency(ALLOWED_ASSET_ID.VNDC);
                                setIsShowModalChooseCurrency(false);
                            }}
                            isChoosed={typeCurrency === ALLOWED_ASSET_ID.VNDC}
                            className="!text-txtPrimary dark:!text-txtPrimary-dark !font-semibold"
                        >
                            VNDC
                            {typeCurrency === ALLOWED_ASSET_ID.VNDC && <CheckCircleIcon color="currentColor" size={16} />}
                        </AssetItem>
                        <AssetItem
                            onClick={() => {
                                setTypeCurrency(ALLOWED_ASSET_ID.USDT);
                                setIsShowModalChooseCurrency(false);
                            }}
                            isChoosed={typeCurrency === ALLOWED_ASSET_ID.USDT}
                            className="!text-txtPrimary dark:!text-txtPrimary-dark !font-semibold"
                        >
                            USDT
                            {typeCurrency === ALLOWED_ASSET_ID.USDT && <CheckCircleIcon color="currentColor" size={16} />}
                        </AssetItem>
                    </div>
                </AssetList>
            </div>
        );
    return (
        <div className={`flex mt-0 text-sm md:text-base ${className}`}>
            <button
                onClick={() => setTypeCurrency(ALLOWED_ASSET_ID.VNDC)}
                className={`border border-divider dark:border-divider-dark rounded-l-md px-4 md:px-9 py-2 md:py-3 ${
                    typeCurrency === ALLOWED_ASSET_ID.VNDC ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-r-none'
                }`}
            >
                VNDC
            </button>
            <button
                onClick={() => setTypeCurrency(ALLOWED_ASSET_ID.USDT)}
                className={`border border-divider dark:border-divider-dark rounded-r-md px-4 md:px-9 py-2 md:py-3 ${
                    typeCurrency === ALLOWED_ASSET_ID.USDT ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-l-none'
                }`}
            >
                USDT
            </button>
        </div>
    );
};

const AssetList = styled.div.attrs(({ AssetListRef, className }) => ({
    className: `absolute right-0 overflow-hidden bg-shadow/[0.6] top-auto py-4 mt-2 !w-[100vw] h-full z-20 ease-in transition-all duration-200 ${className}`,
    ref: AssetListRef
}))``;

const AssetItem = styled.li.attrs(({ key, className, isChoosed, onClick }) => ({
    className: `text-txtSecondary dark:text-txtSecondary-dark text-left text-base
    px-4 py-4 flex items-center justify-between cursor-pointer font-normal first:mt-0 mt-3
    hover:bg-hover focus:bg-hover dark:hover:bg-hover-dark dark:focus:bg-hover-dark
    ${isChoosed && 'bg-hover dark:bg-hover-dark'} ${className}`,
    key: key,
    onClick: onClick
}))``;
