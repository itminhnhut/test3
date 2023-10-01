import { useState, useCallback } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import Tooltip from 'components/common/Tooltip';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** Utils
import { substring } from 'utils';

// ** svg
import Copy from 'components/svg/Copy';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useCollateralPrice from 'components/screens/Lending/hooks/useCollateralPrice';

// ** Constants
import { LOAN_HISTORY_STATUS, PERCENT, STATUS_CODE } from 'components/screens/Lending/constants';

// ** Utils
import FetchApi from 'utils/fetch-api';
import { totalAsset } from 'components/screens/Lending/utils';

// ** Context
import { getAssetConfig } from 'components/screens/Lending/Context';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';
import { API_HISTORY_LOAN } from 'redux/actions/apis';

// ** Third party
import colors from 'styles/colors';
import classNames from 'classnames';
import styled from 'styled-components';
import { useWindowSize } from 'react-use';
import { Check } from 'react-feather';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Countdown from 'react-countdown';
import moment from 'moment-timezone';

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
        asset: 'total_debt',
        classNames: 'w-[198px]'
    },
    {
        title: { vi: 'Tổng ký quỹ ban đầu', en: 'Tổng ký quỹ ban đầu' },
        asset: 'collateral_amount',
        classNames: 'w-[216px]'
    },
    {
        title: { vi: 'LTV hiện tại', en: 'LTV hiện tại' },
        asset: 'percent',
        classNames: 'w-[198px]'
    },
    {
        title: { vi: 'LTV Thanh lý', en: 'LTV Thanh lý' },
        asset: 'percent',
        classNames: 'w-[175px]'
    }
];

const ADJUST = [
    {
        title: { vi: 'Thời gian vay', en: 'Thời gian vay' },
        asset: 'formatDate',
        classNames: 'w-[198px]'
    },
    {
        title: { vi: 'Thời gian hết hạn', en: 'Thời gian hết hạn' },
        asset: 'formatDate',
        key: 'expired',
        classNames: 'w-[216px]'
    },
    {
        title: { vi: 'Thời hạn vay', en: 'Thời hạn vay' },
        asset: 'date',
        classNames: 'w-[198px]'
    },
    {
        title: { vi: 'LTV gọi ký quỹ', en: 'LTV gọi ký quỹ' },
        asset: 'percent',
        classNames: 'w-[175px]'
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

    // ** useContent
    const { assetConfig, assetById } = getAssetConfig();

    // ** useState
    const [dataCollateral, setDataCollateral] = useState({});

    // ** handle
    const handleLoanOrderDetail = async (id, collateralAsset) => {
        try {
            const { data, statusCode } = await FetchApi({
                url: `${API_HISTORY_LOAN}/${id}`
            });
            if (statusCode === STATUS_CODE) {
                setDataCollateral({ ...data, collateralAsset });
            }
        } catch (error) {
            throw new Error('api get loan order detail error', error);
        } finally {
        }
    };

    // ** useState
    const [isAdjustModal, setIsAdjustModal] = useState(INIT_DATA.isModal);
    const [isLoadRepaymentModal, setIsLoadRepaymentModal] = useState(INIT_DATA.isModal);

    const [copied, setCopied] = useState(false);

    // ** handle
    const handleToggleAdjustModal = ({ id, collateralAsset }) => {
        handleLoanOrderDetail(id, collateralAsset);
        setIsAdjustModal((prev) => !prev);
    };
    const handleToggleLoadRepaymentModal = () => setIsLoadRepaymentModal((prev) => !prev);
    const handleCloseAdjustModal = () => setIsAdjustModal((prev) => !prev);

    const onCopy = () => {
        setCopied(true);
    };

    // ** get data
    const getAsset = (assetId) => {
        return assetConfig.find((asset) => asset.id === assetId);
    };

    // ** render
    const renderTitle = (title, content) => {
        return (
            <section>
                <div>{title}</div>
                <div className="text-gray-1 dark:text-gray-7 text-xs font-normal mt-1">{content}</div>
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
                case 'total_debt':
                case 'collateral_amount':
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

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <span>
                còn {days}d {hours}h {minutes}m {seconds}s
            </span>
        );
    };

    const renderRepayment = (options) => {
        const { totalDebt, loanCoin, liquidationLTV, totalCollateralAmount, collateralCoin, collateralAmount, _id } = options;
        const rsTotalDebt = totalAsset(totalDebt, loanCoin); //** Tổng dư nợ */
        const rsCollateralAmount = totalAsset(collateralAmount, collateralCoin);

        const marketPrice = useCollateralPrice({ collateralAssetCode: collateralCoin, loanableAssetCode: loanCoin });
        const LTV = ((totalDebt / (totalCollateralAmount * marketPrice?.data)) * PERCENT).toFixed(0);
        const totalLiquidationLTV = (liquidationLTV * PERCENT).toFixed(0);

        const totalRepayment = [rsTotalDebt?.total, rsCollateralAmount?.total, LTV, totalLiquidationLTV];

        return (
            <section className="flex flex-row h-[72px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 w-[195px] h-[72px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} className="cursor-pointer inline-block">
                            {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                {REPAYMENT?.map((item, key) => {
                    const assetId = null;
                    if (item?.asset === 'total_debt') {
                        assetId = rsTotalDebt?.symbol?.id;
                    }
                    if (item?.asset === 'collateral_amount') {
                        assetId = rsCollateralAmount?.symbol?.id;
                    }

                    return (
                        <section
                            className={classNames(
                                'flex flex-row items-center',
                                {
                                    'gap-1': ['total_debt', 'collateral_amount'].includes(item?.asset)
                                },
                                item?.classNames
                            )}
                        >
                            {['total_debt', 'collateral_amount'].includes(item?.asset) ? <AssetLogo assetId={assetId} /> : null}
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{renderAsset(totalRepayment?.[key], item.asset, assetId)}</div>
                            </section>
                        </section>
                    );
                })}
                <section className="flex flex-row items-center w-[162px] ml-6">
                    <ButtonV2 onClick={handleToggleLoadRepaymentModal}>Trả khoản vay</ButtonV2>
                </section>
            </section>
        );
    };

    const renderAdjust = (options) => {
        const { createdAt, liquidationTime, expirationTime, status, loanTerm, initialLTV, _id, collateralAmount, collateralCoin } = options;

        const totalInitialLTV = (initialLTV * PERCENT).toFixed(0);

        const totalRepayment = [createdAt, liquidationTime, loanTerm, totalInitialLTV];

        const getCollateralAsset = totalAsset(collateralAmount, collateralCoin);

        return (
            <>
                <section className="flex flex-row h-[72px] w-max">
                    <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 w-[195px] h-[72px]">
                        <div>Trạng thái</div>
                        <div
                            className={classNames(
                                'font-semibold text-green-2 dark:text-green-3 border-b border-darkBlue-5 border-dashed cursor-pointer w-fit',
                                {
                                    '!text-yellow-2': LOAN_HISTORY_STATUS?.[status] !== 'REPAID'
                                }
                            )}
                            data-tip={LOAN_HISTORY_STATUS?.[status]?.contentTooltip?.[language]}
                            data-for={status}
                        >
                            {LOAN_HISTORY_STATUS?.[status]?.[language]}
                        </div>
                    </section>
                    {ADJUST?.map((item, key) => {
                        if (item?.key === 'expired' && status === 'DEADLINE_LIQUIDATED') {
                            const currentTime = moment(new Date());
                            const expTime = moment(new Date(expirationTime));
                            const isActive = currentTime <= expTime;

                            const rs = isActive ? (
                                renderAsset(totalRepayment?.[key], item.asset)
                            ) : (
                                <Countdown date={Date.parse(liquidationTime)} renderer={renderer} />
                            );
                            return (
                                <section className={classNames('flex flex-row items-center', item?.classNames)}>
                                    <section className="flex flex-col">
                                        <div className="text-gray-1 dark:text-gray-7">Thời hạn thanh lý</div>
                                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{rs}</div>
                                    </section>
                                </section>
                            );
                        }
                        return (
                            <section className={classNames('flex flex-row items-center', item?.classNames)}>
                                <section className="flex flex-col">
                                    <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                    <div className="dark:text-gray-4 text-gray-15 font-semibold">{renderAsset(totalRepayment?.[key], item.asset)}</div>
                                </section>
                            </section>
                        );
                    })}
                    <section className="flex flex-row items-center w-[162px] ml-6">
                        <ButtonV2
                            onClick={() => handleToggleAdjustModal({ id: _id, collateralAsset: getCollateralAsset })}
                            className="dark:!text-gray-7 !text-gray-1 !bg-gray-12 dark:!bg-dark-2"
                        >
                            Điều chỉnh ký quỹ
                        </ButtonV2>
                    </section>
                </section>
                <Tooltip id={status} place="top" effect="solid" isV3 className="max-w-[300px]" />
            </>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: renderTitle(t('lending:lending:table:minimum'), 'Đơn vị: VND'),
                align: 'left',
                width: 205,
                render: (value, options) => renderLTV(options)
            }
            // {
            //     key: '',
            //     dataIndex: '',
            //     align: 'right',
            //     width: 205,
            //     render: () => (
            //         <section className="flex flex-col items-center gap-3 w-[162px]">
            //             <ButtonV2 onClick={handleToggleLoadRepaymentModal}>Trả khoản vay</ButtonV2>
            //             {/* className={classNames('', { a: 'dark:!text-gray-7 !text-gray-1' })} */}
            //             <ButtonV2 onClick={handleToggleAdjustModal}>Điều chỉnh ký quỹ</ButtonV2>
            //         </section>
            //     )
            // }
        ];

        return (
            <WrapperTable
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
            <ModalAdjustMargin isModal={isAdjustModal} onClose={handleCloseAdjustModal} dataCollateral={dataCollateral} />
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
                border-color: ${(props) => (props.isDark ? colors.divider.dark : colors.divider.DEFAULT)} !important;
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
