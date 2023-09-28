import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Utils
import { substring } from 'utils';

// ** svg
import Copy from 'components/svg/Copy';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Constants
import { LOAN_HISTORY_STATUS } from 'components/screens/Lending/constants';

// ** Context
import { getAssetConfig } from 'components/screens/Lending/Context';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';

// ** Third party
import colors from 'styles/colors';
import classNames from 'classnames';
import styled from 'styled-components';
import { useWindowSize } from 'react-use';
import { Check } from 'react-feather';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dynamic from 'next/dynamic';

// ** dynamic
const ModalAdjustMargin = dynamic(() => import('components/screens/Lending/components/Modal/AdjustMargin'), { ssr: false });
const ModalLoanRepayment = dynamic(() => import('components/screens/Lending/components/Modal/LoanRepayment'), { ssr: false });

// ** Constants
const LIMIT = 10;

const INIT_DATA = {
    isModal: false
};

const REPAYMENT = [
    {
        title: { vi: 'Tổng dư nợ', en: 'Tổng dư nợ' },
        asset: 'token'
    },
    {
        title: { vi: 'LTV hiện tại', en: 'LTV hiện tại' },
        asset: 'percent'
    },
    {
        title: { vi: 'LTV Dừng ký quỹ', en: 'LTV Dừng ký quỹ' },
        asset: 'percent'
    },
    {
        title: { vi: 'LTV Thanh lý', en: 'LTV Thanh lý' },
        asset: 'percent'
    }
];

const ADJUST = [
    {
        title: { vi: 'Ký quỹ ban đầu', en: 'Ký quỹ ban đầu' },
        asset: 'token'
    },
    {
        title: { vi: 'Thời hạn vay', en: 'Thời hạn vay' },
        asset: 'date'
    },
    {
        title: { vi: 'Thời gian bắt đầu', en: 'Thời gian bắt đầu' },
        asset: 'formatDate'
    },
    {
        title: { vi: 'Thời gian kết thúc', en: 'Thời gian kết thúc' },
        asset: 'formatDate'
    }
];

const LoanTable = ({ data, page, loading, onPage }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const { assetConfig, assetById } = getAssetConfig();

    // ** useState
    const [isAdjustModal, setIsAdjustModal] = useState(INIT_DATA.isModal);
    const [isLoadRepaymentModal, setIsLoadRepaymentModal] = useState(INIT_DATA.isModal);

    const [copied, setCopied] = useState(false);

    // ** handle
    const handleToggleAdjustModal = () => setIsAdjustModal((prev) => !prev);
    const handleToggleLoadRepaymentModal = () => setIsLoadRepaymentModal((prev) => !prev);

    const onCopy = () => {
        setCopied(true);
    };

    // ** get data
    const getAsset = (assetId) => {
        return assetConfig.find((asset) => asset.id === assetId);
    };

    console.log('--render--', data.result);

    // ** render
    const renderTitle = (title, content) => {
        return (
            <section>
                <div>{title}</div>
                <div className="text-gray-1 dark:text-gray-7 text-xs font-normal mt-1">{content}</div>
            </section>
        );
    };

    const renderIdStatus = (options) => {
        const { _id, status } = options;
        return (
            <section className="flex flex-col">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} className="cursor-pointer inline-block">
                            {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    <div>Trạng thái</div>
                    <div
                        className={classNames('font-semibold text-green-2 dark:text-green-3', {
                            '!text-yellow-2': 1
                        })}
                    >
                        {LOAN_HISTORY_STATUS?.[status]?.[language]}
                    </div>
                </section>
            </section>
        );
    };

    const renderLTV = (options) => {
        return (
            <>
                {renderRepayment(options)}
                {renderAdjust(options)}
            </>
        );
    };

    const renderAsset = (data, type, idAssetCode = null) => {
        const rs = ((data, type) => {
            switch (type) {
                case 'token':
                    return `${data} ${assetById?.[idAssetCode]?.assetCode}`;
                case 'percent':
                    return `${data}%`;
                case 'date':
                    return `${data} ${language === 'vi' ? 'ngày' : 'ngày'}`;
                case 'formatDate':
                    return formatTime(data, 'HH:mm:ss dd/MM/yyyy');
                default:
                    '-';
            }
        })(data, type);
        return rs;
    };

    const handleTotalAsset = (data, asset) => {
        const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
        const total = formatNumber(data || 0, symbol?.assetDigit, 0, true);
        return { total: total, symbol: symbol };
    };

    const renderRepayment = (options) => {
        const { totalDebt, loanCoin, marginCallLTV, liquidationLTV } = options;
        const rsTotalDebt = handleTotalAsset(totalDebt, loanCoin); //** Tổng dư nợ */
        const totalRepayment = [rsTotalDebt.total, 80, marginCallLTV, liquidationLTV];

        return (
            <section className="grid grid-cols-4 h-[72px] w-max gap-4">
                {REPAYMENT?.map((item, key) => {
                    return (
                        <section className={classNames('flex flex-row items-center', { 'gap-1': item?.asset === 'token' })}>
                            {item?.asset === 'token' ? <AssetLogo assetId={rsTotalDebt.symbol.id} /> : null}
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">
                                    {renderAsset(totalRepayment?.[key], item.asset, rsTotalDebt.symbol.id)}
                                </div>
                            </section>
                        </section>
                    );
                })}
            </section>
        );
    };

    const renderAdjust = (options) => {
        const { collateralAmount, collateralCoin, createdAt, liquidationTime } = options;
        const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //

        const totalRepayment = [rsCollateralAmount.total, 7, createdAt, liquidationTime];
        return (
            <section className="grid grid-cols-4 h-[72px] w-max gap-4">
                {ADJUST?.map((item, key) => {
                    return (
                        <section className={classNames('flex flex-row items-center', { 'gap-1': item?.asset === 'token' })}>
                            {item?.asset === 'token' ? <AssetLogo assetId={rsCollateralAmount.symbol.id} /> : null}
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">
                                    {renderAsset(totalRepayment?.[key], item.asset, rsCollateralAmount.symbol.id)}
                                </div>
                            </section>
                        </section>
                    );
                })}
            </section>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: '_id',
                dataIndex: '_id',

                title: t('lending:lending:table:assets'),
                align: 'left',
                width: 176,
                render: (value, options) => renderIdStatus(options)
            },
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: renderTitle(t('lending:lending:table:minimum'), 'Đơn vị: VND'),
                align: 'left',
                width: 205,
                render: (value, options) => renderLTV(options)
            },
            {
                key: '',
                dataIndex: '',
                align: 'right',
                width: 205,
                render: () => (
                    <section className="flex flex-col items-center gap-3">
                        <ButtonV2 onClick={handleToggleLoadRepaymentModal}>Trả khoản vay</ButtonV2>
                        {/* className={classNames('', { a: 'dark:!text-gray-7 !text-gray-1' })} */}
                        <ButtonV2 onClick={handleToggleAdjustModal}>Điều chỉnh ký quỹ</ButtonV2>
                    </section>
                )
            }
        ];

        return (
            <WrapperTable
                sort={['created_at2', 'created_at3']}
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
                data={data.result || []}
                rowKey={(item) => `${item?.key}`}
                pagingClassName="!border-0 !py-8"
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: data?.hasNext,
                    onChangeNextPrev: (delta) => {
                        onPage(page + delta);
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
            <section className="rounded-b-2xl bg-white dark:bg-dark-4">{renderTable()}</section>
            <ModalAdjustMargin isModal={isAdjustModal} onClose={handleToggleAdjustModal} />
            <ModalLoanRepayment isModal={isLoadRepaymentModal} onClose={handleToggleLoadRepaymentModal} />
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
        .rc-table-tbody {
            tr td {
                padding-top: 12px;
                padding-bottom: 12px;
            }
        }
        .rc-table-thead {
            tr th {
                display: none;
            }
        }
    }
`;

export default LoanTable;
