import React, { useMemo, useState } from 'react';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import { ArrowLeft, Search, X } from 'react-feather';
import { useTranslation } from 'next-i18next';
import { CopyText, formatNumber, getInsuranceLoginLink, roundByExactDigit } from 'redux/actions/utils';
import classNames from 'classnames';
import { INSURANCE_URL } from 'constants/constants';
import { useSelector } from 'react-redux';
import usePrevious from 'hooks/usePrevious';
import CountUp from 'react-countup';

const InsuranceListModal = ({ visible, onClose = () => {}, insurances, symbol }) => {
    const { t } = useTranslation();

    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const p_market = marketWatch[symbol];

    return (
        <ModalV2 canBlur={false} closeButton={false} className="!max-w-[800px]" isVisible={visible} onBackdropCb={onClose}>
            <div className="flex items-center justify-between">
                <ArrowLeft className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
                <X className="cursor-pointer" color="currentColor" size={24} onClick={onClose} />
            </div>
            <div className="my-6 font-semibold text-2xl">{t('futures:insurance:title')}</div>
            <div className="max-h-[calc(90vh-168px)] overflow-y-auto -mx-8 px-8">
                <div className="grid grid-cols-2 gap-4">
                    {insurances?.length &&
                        insurances.map((insurance) => {
                            return <ContractItem p_market={p_market.lastPrice} key={insurance?._id} insurance={insurance} />;
                        })}
                </div>
            </div>
        </ModalV2>
    );
};

const ContractItem = ({ insurance, p_market }) => {
    const { t } = useTranslation();

    const q_AssetDigit = insurance?.quote_asset === 'USDT' ? 4 : 0;

    const [loading, setLoading] = useState(false);

    const sideColor = insurance?.side === 'BULL' ? 'text-green-2' : 'text-red';

    const getInsuranceDetailLink = async () => {
        setLoading(true);
        await getInsuranceLoginLink({
            redirectTo: `${INSURANCE_URL}/tracking/${insurance?._id}`,
            targetType: '_blank'
        });
        setLoading(false);
    };

    return (
        <div className="bg-bgContainer dark:bg-bgContainer-dark border dark:border-none border-divider rounded-xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{insurance?.asset_covered}</span>
                    <div className="w-0.5 h-0.5 bg-gray-1 dark:bg-gray-7 rounded-full"></div>
                    <span className={classNames('font-semibold', sideColor)}>{insurance?.side}</span>
                </div>

                <span className="font-semibold">{formatNumber(p_market, q_AssetDigit)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
                <CopyText text={insurance?._id} />
                <span className="text-teal">{insurance?.state === 'Available' ? 'Còn hiệu lực' : 'Không còn hiệu lực'}</span>
            </div>
            <hr className="border-divider dark:border-divider-dark my-4" />
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">Q-Claim</span>
                <span className="font-semibold">
                    {formatNumber(insurance?.q_claim, q_AssetDigit)}{' '}
                    <span className="text-green-2">({formatNumber((insurance?.q_claim / insurance?.margin) * 100, 2)}%)</span>
                </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">P-Claim </span>
                <span className="font-semibold">
                    {formatNumber(insurance?.p_claim, q_AssetDigit)}{' '}
                    <span className={classNames('', sideColor)}>({formatNumber((Math.abs(insurance?.p_claim - p_market) / p_market) * 100, 2)}%)</span>
                </span>
            </div>
            <Button variants="secondary" disabled={loading} onClick={getInsuranceDetailLink} className="mt-4">
                {t('common:details')}
            </Button>
        </div>
    );
};

export default InsuranceListModal;
