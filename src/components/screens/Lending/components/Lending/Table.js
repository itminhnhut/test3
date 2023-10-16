import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';
import { useLoanableList, useCollateralList } from 'components/screens/Lending/context';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { ceilByExactDegit, formatNumber } from 'redux/actions/utils';

// ** Third party
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import dynamic from 'next/dynamic';
import useRedirectLoanAsset from '../../hooks/useRedirectLoanAsset';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_PAIR_PRICE } from 'redux/actions/apis';
import { formatPercent } from 'components/screens/Lending/utils';

// ** dynamic
const ModalRegisterLoan = dynamic(() => import('components/screens/Lending/components/Modal/RegisterLoan'), { ssr: false });

// ** Constants
const LIMIT = 10;

const LendingTable = ({ data, page, loading, onPage: onPageChange }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const { loanable: loanAssetList } = useLoanableList();
    const { collateral: collateralAssetList } = useCollateralList();

    const { loanAsset, setLoanAsset } = useRedirectLoanAsset({ loanAssetList });

    // ** render
    const renderTitle = (title, content) => {
        return (
            <section>
                <div>{title}</div>
                <div className={classNames('text-gray-1 dark:text-gray-7 text-xs font-normal mt-1', { 'invisible h-4': !content })}>{content}</div>
            </section>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'loanCoin',
                dataIndex: 'loanCoin',
                title: renderTitle(t('lending:lending:table:assets')),
                align: 'left',
                width: 189,
                render: (value) => (
                    <section className="flex flex-row items-center">
                        <AssetLogo useNextImg assetCode={value} />
                        <span className="ml-2">{value}</span>
                    </section>
                )
            },
            {
                key: 'minLimit',
                dataIndex: 'minLimit',
                title: renderTitle(t('lending:lending:table:minimum'), 'Đơn vị: USD'),
                align: 'left',
                width: 206,
                render: (limitValue, data) => {
                    return <div>{formatNumber(limitValue)}</div>;
                }
            },
            {
                key: 'maxLimit',
                dataIndex: 'maxLimit',
                title: renderTitle(t('lending:lending:table:maximum'), 'Đơn vị: USD'),
                align: 'left',
                width: 205,
                render: (limitValue, data) => {
                    return <div className="font-normal">{formatNumber(limitValue)}</div>;
                }
            },
            {
                key: '_7dHourlyInterestRate',
                dataIndex: '_7dHourlyInterestRate',
                title: renderTitle(t('lending:lending:table:7days'), 'Lãi suất theo giờ/theo năm'),
                align: 'left',
                width: 205,
                render: (value, data) => {
                    const interestRate = +value * 100;
                    return <div className="font-normal">{`${formatPercent(interestRate)}% / ${formatPercent(interestRate * 24 * 365)}%`}</div>;
                }
            },
            {
                key: '_30dHourlyInterestRate',
                dataIndex: '_30dHourlyInterestRate',
                title: renderTitle(t('lending:lending:table:30days'), 'Lãi suất theo giờ/theo năm'),
                align: 'left',
                width: 206,
                render: (value, data) => {
                    const interestRate = +value * 100;
                    return <div className="font-normal">{`${formatPercent(interestRate)}% / ${formatPercent(interestRate * 24 * 365)}%`}</div>;
                }
            },
            {
                key: 'setLoan',
                dataIndex: 'setLoan',
                align: 'center',
                width: 205,
                render: (_, data) => {
                    return (
                        <div className="w-full dark:text-green-2 text-green-3 font-semibold text-center" onClick={() => setLoanAsset(data?.loanCoin)}>
                            {t('lending:lending:table:active')}
                        </div>
                    );
                }
            }
        ];

        return (
            <WrapperTable
                sort={['_7dHourlyInterestRate', '_30dHourlyInterestRate']}
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                isDark={isDark}
                loading={loading}
                columns={columns}
                isMobile={isMobile}
                scroll={{ x: true }}
                className=""
                data={data || []}
                onRowClick={(item) => setLoanAsset(item?.loanCoin)}
                rowKey={(item) => `${item?.key}`}
                pagingClassName="!border-0 !py-8"
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: data?.hasNext,
                    onChangeNextPrev: (delta) => {
                        onPageChange(page + delta);
                    },
                    language: language
                }}
                tableStyle={{
                    rowHeight: '64px'
                }}
            />
        );
    }, [data?.result, loading, isDark]);

    return (
        <>
            <section className="rounded-xl border-[0px] border-divider dark:border-divider-dark bg-white dark:bg-dark-4">{renderTable()}</section>
            {/* Tạo khoản vay  */}
            <ModalRegisterLoan
                loanAssetList={loanAssetList}
                collateralAssetList={collateralAssetList}
                isOpen={Boolean(loanAsset)}
                loanAsset={loanAsset}
                onClose={() => setLoanAsset(null)}
            />
        </>
    );
};

const WrapperTable = styled(TableV2).attrs(({ ...props }) => ({
    className: classNames(props)
}))`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            width: ${(props) => (props.isMobile ? 'max-content' : '100%')};
        }
        .rc-table-thead {
            tr th {
                white-space: nowrap;
                font-size: 16px;
                font-weight: 600 !important;
                color: ${({ isDark }) => (isDark ? colors.gray[4] : colors.gray[15])};
                div > span {
                    margin-top: 24px;
                }
            }
        }
    }
`;

export default LendingTable;
