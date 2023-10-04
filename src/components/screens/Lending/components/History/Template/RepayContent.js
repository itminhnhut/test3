// ** Next
import { useTranslation } from 'next-i18next';

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

const RepayContent = ({ value, onCopy, copied }) => {
    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { _id, orderId, metadata, detail, collateralCoin } = value;

    const totalRepaid = handleTotalAsset(detail?.totalRepaid?.to, detail?.totalRepaid?.currency, assetConfig);

    const repayCollateralAmount = handleTotalAsset(metadata?.repayCollateralAmount, collateralCoin, assetConfig);
    const returnCollateralAmount = handleTotalAsset(metadata?.returnCollateralAmount, collateralCoin, assetConfig);

    const type = metadata?.repayRate === 1 ? 'Toàn bộ' : 'Một phần';

    return (
        <section className="flex flex-row gap-6 py-4">
            <WrapperSection className="w-[190px] whitespace-nowrap">
                <div>ID khoản vay</div>
                <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                    <div>#{substring(orderId)}</div>
                    <CopyToClipboard onCopy={onCopy} text={orderId} className="cursor-pointer inline-block">
                        {copied === orderId ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </div>
            </WrapperSection>
            <WrapperSection className="w-[190px] whitespace-nowrap">
                <div>ID lệnh ký quỹ</div>
                <WrapperDetail>
                    <div>#{substring(_id)}</div>
                    <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                        {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
            <WrapperSection className="w-[150px] whitespace-nowrap">
                <div>Loại hoàn trả</div>
                <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
            </WrapperSection>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <AssetLogo assetId={totalRepaid.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Tổng đã trả</div>
                    <WrapperDetail>
                        {totalRepaid.total} {totalRepaid.symbol.assetCode}
                    </WrapperDetail>
                </section>
            </section>

            <section className="flex flex-row items-center gap-2 w-[204px]">
                <AssetLogo assetId={repayCollateralAmount.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Tổng ký quỹ sử dụng</div>
                    <WrapperDetail>
                        {repayCollateralAmount.total} {collateralCoin}
                    </WrapperDetail>
                </section>
            </section>
            <section className="flex flex-row items-center gap-2 w-[204px]">
                <AssetLogo assetId={returnCollateralAmount.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Tổng ký quỹ hoàn trả</div>
                    <WrapperDetail>
                        {returnCollateralAmount.total} {collateralCoin}
                    </WrapperDetail>
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

export default RepayContent;
