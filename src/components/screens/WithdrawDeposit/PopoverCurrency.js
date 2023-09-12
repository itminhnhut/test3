import React, { useRef } from 'react';
import PopoverV2 from 'components/common/V2/PopoverV2';
import SvgIcon from 'components/svg';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from './constants';
import AssetLogo from 'components/wallet/AssetLogo';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import classNames from 'classnames';

const PopoverCurrency = React.memo(() => {
    const router = useRouter();
    const { side, assetId } = router.query;
    const ref = useRef(null);
    return (
        <PopoverV2
            containerClassName="z-20"
            className="w-[150px] !left-[unset] -right-3 !-translate-x-0"
            ref={ref}
            label={(open) => (
                <div className="space-x-2 h-11 flex items-center w-full">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 min-w-[24px] max-w-[24px] flex items-center">
                            <AssetLogo assetCode={ALLOWED_ASSET[+assetId]} size={24} useNextImg />
                        </div>
                        <div className="font-semibold">{ALLOWED_ASSET[+assetId]}</div>
                    </div>

                    <div className="text-txtSecondary dark:text-gray-7">
                        <SvgIcon
                            name="chevron_down"
                            className={`${open ? '!rotate-0 ' : ' '} transition-transform duration-150`}
                            size={16}
                            color="currentColor"
                        />
                    </div>
                </div>
            )}
        >
            <div className="py-4 z-50">
                <div className="space-y-3">
                    {Object.keys(ALLOWED_ASSET_ID).map((assetCode) => {
                        const isSelect = +assetId === ALLOWED_ASSET_ID[assetCode];
                        return (
                            <div
                                onClick={() => {
                                    if (isSelect) return;
                                    router.push(
                                        {
                                            pathname: PATHS.WITHDRAW_DEPOSIT.PARTNER,
                                            query: { side, assetId: ALLOWED_ASSET_ID[assetCode] }
                                        },
                                        undefined,
                                        { shallow: true }
                                    );
                                    ref.current.close();
                                }}
                                key={assetCode}
                                className={classNames('flex items-center justify-between px-4 py-3 hover:bg-hover dark:hover:bg-hover-dark', {
                                    'cursor-pointer': !isSelect
                                })}
                            >
                                <div className="flex items-center space-x-2 ">
                                    <div className="w-6 h-6 min-w-[24px] max-w-[24px] flex items-center">
                                        <AssetLogo assetCode={assetCode} size={24} useNextImg />
                                    </div>

                                    <div className="">{assetCode}</div>
                                </div>
                                {isSelect && <CheckCircleIcon color="currentColor" size={16} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </PopoverV2>
    );
});

export default PopoverCurrency;
