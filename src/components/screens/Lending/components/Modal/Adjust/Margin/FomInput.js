// ** next
import Link from 'next/link';

// ** Redux
import { dwLinkBuilder } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';

// ** Utils
import { formatNumber } from 'utils/reference-utils';

// ** Components
import AssetLogo from 'components/wallet/AssetLogo';
import TradingInputV2 from 'components/trade/TradingInputV2';

// ** Constants
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';

// ** SVG
import { AddCircleColorIcon } from 'components/svg/SvgIcon';

//** Third party
import classNames from 'classnames';

const TAB_SUBTRACT = 'subtract';

const FormInput = ({ collateralAvailable, collateralAsset, collateralCoin, validator, amountAsset, onChangeAmount, tab }) => {
    const totalAvailable = formatNumber(collateralAvailable, collateralAsset?.symbol?.assetDigit);

    return (
        <section>
            <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1 text-sm">
                <section className="text-base font-semibold dark:text-gray-4 text-gray-15">Số lượng</section>
                <section className={classNames('flex flex-row items-center gap-1', { hidden: tab === TAB_SUBTRACT })}>
                    <div className="flex flex-row">
                        <span>Khả dụng:</span>
                        <span className="dark:text-gray-4 text-gray-15 ml-1 font-semibold">
                            {totalAvailable} {collateralAsset?.symbol?.assetCode}
                        </span>
                    </div>
                    <Link href={dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, collateralCoin)}>
                        <a className="inline-block">
                            <AddCircleColorIcon size={16} className="cursor-pointer" />
                        </a>
                    </Link>
                </section>
            </section>
            <TradingInputV2
                clearAble
                id="amount_input"
                errorTooltip={false}
                allowNegative={false}
                validator={validator}
                thousandSeparator={true}
                value={amountAsset || ''}
                containerClassName="mt-4"
                inputClassName="!text-left !ml-0 text-gray-15 dark:text-gray-4"
                placeHolder="Nhập số lượng tài sản"
                allowedDecimalSeparators={[',', '.']}
                onValueChange={({ value }) => onChangeAmount(value)}
                decimalScale={collateralAsset?.symbol?.assetDigit || 0}
                renderTail={
                    <div className="flex flex-row gap-2 items-center">
                        <AssetLogo size={24} assetId={collateralAsset?.symbol?.id} />
                        <span className="text-gray-15 font-semibold dark:text-gray-4">{collateralAsset?.symbol?.assetCode}</span>
                    </div>
                }
            />
        </section>
    );
};

export default FormInput;
