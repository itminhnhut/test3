// ** Next
import { useTranslation } from 'next-i18next';

// ** Constants
import { PERCENT, YEAR, LOAN_HISTORY_STATUS, HOUR } from 'components/screens/Lending/constants';

// ** Components
import AssetLogo from 'components/wallet/AssetLogo';

// ** Redux
import { useSelector } from 'react-redux';
import { formatNumber, formatTime } from 'redux/actions/utils';

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

const LoanContent = ({ value, onCopy, copied }) => {
    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { _id, createdAt, totalDebt, loanCoin, collateralAmount, collateralCoin, loanTerm, hourlyInterestRate, status } = value;
    const rsTotalDebt = handleTotalAsset(totalDebt, loanCoin, assetConfig); //** Tổng dư nợ */
    const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin, assetConfig); //** Tổng ký quỹ ban đầu */
    const interestRate = hourlyInterestRate * HOUR * YEAR * PERCENT;
    return (
        <section className="flex flex-row gap-6 py-4">
            <WrapperSection className="w-[190px]">
                <div>ID khoản vay</div>
                <WrapperDetail>
                    <div>#{substring(_id)}</div>
                    <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                        {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
            <WrapperSection className="w-[150px]">
                <div>Trạng thái</div>
                <WrapperDetail
                    className={classNames({
                        'dark:!text-green-2 !text-green-3': status === 'REPAID'
                    })}
                >
                    {LOAN_HISTORY_STATUS?.[status]?.[language]}
                </WrapperDetail>
            </WrapperSection>
            <section className="flex flex-row items-center gap-2 whitespace-nowrap w-[200px]">
                <AssetLogo assetId={rsTotalDebt?.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Tổng dư nợ</div>
                    <WrapperDetail>
                        {rsTotalDebt?.total} {loanCoin}
                    </WrapperDetail>
                </section>
            </section>
            <section className="flex flex-row items-center gap-2 whitespace-nowrap w-[200px]">
                <AssetLogo assetId={rsCollateralAmount?.symbol.id} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>Ký quỹ ban đầu</div>
                    <WrapperDetail>
                        {rsCollateralAmount?.total} {collateralCoin}
                    </WrapperDetail>
                </section>
            </section>
            <WrapperSection className="w-[70px]">
                <div>Kỳ hạn</div>
                <WrapperDetail>{loanTerm} ngày</WrapperDetail>
            </WrapperSection>
            <WrapperSection className="w-[100px]">
                <div>Lãi suất năm</div>
                <WrapperDetail>{formatNumber(interestRate)}%</WrapperDetail>
            </WrapperSection>

            <WrapperSection className="w-max">
                <div>Thời gian vay</div>
                <WrapperDetail>{formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}</WrapperDetail>
            </WrapperSection>
        </section>
    );
};

const WrapperSection = styled.section.attrs(({ className }) => ({
    className: classNames('flex flex-col justify-center dark:text-gray-7 text-gray-1 whitespace-nowrap', className)
}))``;

const WrapperDetail = styled.section.attrs(({ className }) => ({
    className: classNames('dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center whitespace-nowrap', className)
}))``;

export default LoanContent;
