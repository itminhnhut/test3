// ** Next
import { useTranslation } from 'next-i18next';

// ** Constants
import { LOAN_HISTORY_STATUS, FORMAT_HH_MM_SS } from 'components/screens/Lending/constants';

// ** Components
import AssetLogo from 'components/wallet/AssetLogo';
import { handleTotalAsset } from 'components/screens/Lending/utils';

// ** Utils
import { substring } from 'utils';

// ** Redux
import { useSelector } from 'react-redux';
import { formatTime } from 'redux/actions/utils';

// ** svg
import Copy from 'components/svg/Copy';

// ** Third party
import { Check } from 'react-feather';
import styled from 'styled-components';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const RejectContent = ({ value, onCopy, copied }) => {
    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { _id, collateralAmount, collateralCoin, createdAt, liquidationTime, status, interest, liquidationFee, loanCoin } = value;
    const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin, assetConfig); //** Tổng ký quỹ ban đầu */
    const rsLiquidationFree = handleTotalAsset(interest * liquidationFee, loanCoin, assetConfig);

    return (
        <section className="flex flex-row gap-6 py-4">
            <WrapperSection className="w-[180px] whitespace-nowrap">
                <div>ID khoản vay</div>
                <WrapperDetail>
                    <div>#{substring(_id)}</div>
                    <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                        {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
            <section className="flex flex-row items-center gap-2 min-w-[214px]">
                <AssetLogo assetId={rsCollateralAmount.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Tổng ký quỹ ban đầu</div>
                    <WrapperDetail>
                        {rsCollateralAmount.total} {collateralCoin}
                    </WrapperDetail>
                </section>
            </section>
            <section className="flex flex-row items-center gap-2 min-w-[204px]">
                <AssetLogo assetId={rsLiquidationFree.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Phí thanh lý</div>
                    <WrapperDetail>
                        {rsLiquidationFree.total} {loanCoin}
                    </WrapperDetail>
                </section>
            </section>
            <WrapperSection className="whitespace-nowrap">
                <div>Thời gian vay</div>
                <WrapperDetail>{formatTime(createdAt, FORMAT_HH_MM_SS)}</WrapperDetail>
            </WrapperSection>
            <WrapperSection className="whitespace-nowrap">
                <div>Thời gian thanh lý</div>
                <WrapperDetail>{formatTime(liquidationTime, FORMAT_HH_MM_SS)}</WrapperDetail>
            </WrapperSection>
            <WrapperSection className="whitespace-nowrap">
                <div>Nguyên nhân thanh lý</div>
                <WrapperDetail>{LOAN_HISTORY_STATUS?.[status]?.[language]}</WrapperDetail>
            </WrapperSection>
        </section>
    );
};

const WrapperSection = styled.section.attrs(({ className }) => ({
    className: classNames('flex flex-col justify-center dark:text-gray-7 text-gray-1', className)
}))``;

const WrapperDetail = styled.section.attrs(({ className }) => ({
    className: classNames('dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center', className)
}))``;

export default RejectContent;
