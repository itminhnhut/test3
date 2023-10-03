// ** Next
import { useTranslation } from 'next-i18next';

// ** Constants
import { PERCENT } from 'components/screens/Lending/constants';

// ** Components
import AssetLogo from 'components/wallet/AssetLogo';

// ** Redux
import { useSelector } from 'react-redux';

// ** svg
import Copy from 'components/svg/Copy';

// ** Utils
import { substring } from 'utils';
import { handleTotalAsset } from 'components/screens/Lending/utils';

// ** Third party
import { Check } from 'react-feather';
import styled from 'styled-components';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AdjustContent = ({ value, onCopy, copied }) => {
    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { _id, orderId, metadata, detail, collateralCoin } = value;

    const totalCollateralAmount = detail?.totalCollateralAmount;
    const LTV = detail?.LTV;

    const initialCollateral = handleTotalAsset(totalCollateralAmount?.from, collateralCoin, assetConfig);
    const adjustCollateral = handleTotalAsset(totalCollateralAmount?.to, collateralCoin, assetConfig);

    const type = metadata?.payment?.amount < 0 ? 'Bớt ký quỹ' : 'Thêm ký quỹ';

    return (
        <section className="flex flex-row gap-6 py-4">
            <WrapperSection className="w-[180px] whitespace-nowrap">
                <div>ID khoản vay</div>
                <WrapperDetail>
                    <div>#{substring(orderId)}</div>
                    <CopyToClipboard onCopy={onCopy} text={orderId} className="cursor-pointer inline-block">
                        {copied === orderId ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
            <WrapperSection className="w-[180px] whitespace-nowrap">
                <div>ID lệnh ký quỹ</div>
                <WrapperDetail>
                    <div>#{substring(_id)}</div>
                    <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                        {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
            <WrapperSection className="w-[140px] whitespace-nowrap">
                <div>Loại ký quỹ</div>
                <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
            </WrapperSection>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <AssetLogo assetId={initialCollateral.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Ký quỹ ban đầu</div>
                    <WrapperDetail>
                        {initialCollateral.total} {initialCollateral.symbol.assetCode}
                    </WrapperDetail>
                </section>
            </section>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <AssetLogo assetId={adjustCollateral.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Ký quỹ ban đầu</div>
                    <WrapperDetail>
                        {adjustCollateral.total} {adjustCollateral.symbol.assetCode}
                    </WrapperDetail>
                </section>
            </section>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <section className="dark:text-gray-7 text-gray-1">
                    <div>LTV trước điều chỉnh</div>
                    <WrapperDetail>{(LTV?.from * PERCENT).toFixed(0)}%</WrapperDetail>
                </section>
            </section>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <section className="dark:text-gray-7 text-gray-1">
                    <div>LTV sau điều chỉnh</div>
                    <WrapperDetail>{(LTV?.to * PERCENT).toFixed(0)}%</WrapperDetail>
                </section>
            </section>
        </section>
    );
};

const WrapperSection = styled.section.attrs(({ className }) => ({
    className: classNames('flex flex-col justify-center dark:text-gray-7 text-gray-1', className)
}))``;

const WrapperDetail = styled.section.attrs(({ className }) => ({
    className: classNames('dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center', className)
}))``;

export default AdjustContent;
