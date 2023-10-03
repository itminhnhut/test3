import { useState, useCallback, useContext } from 'react';

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

// ** Constants
import { LOAN_HISTORY_STATUS, PERCENT, STATUS_CODE } from 'components/screens/Lending/constants';

// ** Utils
import FetchApi from 'utils/fetch-api';
import { totalAsset } from 'components/screens/Lending/utils';

// ** Context
import { LendingContext } from 'components/screens/Lending/Context';
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

// ** Redux
import { formatTime } from 'redux/actions/utils';
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
import useMemoizeArgs from 'hooks/useMemoizeArgs';

// ** dynamic
const ModalAdjustMargin = dynamic(() => import('components/screens/Lending/components/Modal/AdjustMargin'), { ssr: false });
const ModalLoanRepayment = dynamic(() => import('components/screens/Lending/components/Modal/LoanRepayment'), { ssr: false });

// ** Constants
const LIMIT = 10;

const INIT_DATA = {
    isModal: false
};

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
    const { dispatchReducer, state } = useContext(LendingContext);

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
    const [isOpenRepaymentModal, setIsLoadRepaymentModal] = useState(INIT_DATA.isModal);
    const [copied, setCopied] = useState(false);

    // ** handle modal
    const handleToggleAdjustModal = ({ id, collateralAsset }) => {
        handleLoanOrderDetail(id, collateralAsset);
        dispatchReducer({ type: actions.TOGGLE_MODAL_ADJUST_MARGIN });
    };
    const onOpenRepayment = ({ id, collateralAsset }) => {
        handleLoanOrderDetail(id, collateralAsset);
        setIsOpenRepaymentModal(true);
    };

    // ** handle modal
    const onCloseRepayment = () => setIsLoadRepaymentModal((prev) => !prev);
    const handleCloseAdjustModal = () => {
        if (state.amount > 0) {
            dispatchReducer({ type: actions.TOGGLE_MODAL_CANCEL, isCancel: true, isAdjust: false });
        } else {
            dispatchReducer({ type: actions.TOGGLE_MODAL_ADJUST_MARGIN });
            dispatchReducer({ type: actions.RESET_AMOUNT });
        }
    };

    const onCopy = (value) => {
        setCopied(value);
    };

    const render_Col_Id_Status = (options) => {
        const { _id, status } = options;
        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                            {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    <div>Trạng thái</div>
                    <div
                        className={classNames('font-semibold text-green-2 dark:text-green-3 border-b border-darkBlue-5 border-dashed cursor-pointer w-fit', {
                            '!text-yellow-2': LOAN_HISTORY_STATUS?.[status] !== 'REPAID'
                        })}
                        data-tip={LOAN_HISTORY_STATUS?.[status]?.contentTooltip?.[language]}
                        data-for={status}
                    >
                        {LOAN_HISTORY_STATUS?.[status]?.[language]}
                    </div>
                </section>
                <Tooltip id={status} place="top" effect="solid" isV3 className="max-w-[300px]" />
            </section>
        );
    };

    const render_Col_Debt_CreateAt = (options) => {
        const { totalDebt, loanCoin, createdAt } = options;
        const rsTotalDebt = totalAsset(totalDebt, loanCoin); //** Tổng dư nợ */
        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <section className={classNames('flex flex-row items-center gap-1')}>
                        <AssetLogo assetId={rsTotalDebt?.symbol?.id} />
                        <section className="flex flex-col">
                            <div className="text-gray-1 dark:text-gray-7">Tổng dư nợ</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">
                                {rsTotalDebt?.total} {rsTotalDebt?.symbol?.assetCode}
                            </div>
                        </section>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    <section className={classNames('flex flex-row items-center')}>
                        <section className="flex flex-col">
                            <div className="text-gray-1 dark:text-gray-7">Thời gian vay</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">{formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
                        </section>
                    </section>
                </section>
            </section>
        );
    };

    const renderer = ({ days, hours, minutes, seconds }) => {
        return (
            <span>
                còn {days}d {hours}h {minutes}m {seconds}s
            </span>
        );
    };

    const renderDeadline = ({ expirationTime, liquidationTime }) => {
        const currentTime = moment(new Date());
        const expTime = moment(new Date(expirationTime));
        const isActive = currentTime <= expTime;

        const rs = isActive ? formatTime(liquidationTime, 'HH:mm:ss dd/MM/yyyy') : <Countdown date={Date.parse(liquidationTime)} renderer={renderer} />;
        return (
            <section className="flex flex-row items-center">
                <section className="flex flex-col">
                    <div className="text-gray-1 dark:text-gray-7">Thời hạn thanh lý</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold">{rs}</div>
                </section>
            </section>
        );
    };

    const renderCol3 = (options) => {
        const { collateralAmount, collateralCoin, expirationTime, status, liquidationTime } = options;
        const rsCollateralAmount = totalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <section className={classNames('flex flex-row items-center gap-1')}>
                        <AssetLogo assetId={rsCollateralAmount?.symbol?.id} />
                        <section className="flex flex-col">
                            <div className="text-gray-1 dark:text-gray-7">Tổng dư nợ</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">
                                {rsCollateralAmount?.total} {rsCollateralAmount?.symbol?.assetCode}
                            </div>
                        </section>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    {status === 'DEADLINE_LIQUIDATED' ? (
                        renderDeadline({ status, expirationTime })
                    ) : (
                        <section className={classNames('flex flex-row items-center')}>
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">Thời gian hết hạn</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{formatTime(liquidationTime, 'HH:mm:ss dd/MM/yyyy')}</div>
                            </section>
                        </section>
                    )}
                </section>
            </section>
        );
    };
    const renderCol4 = (options) => {
        const { collateralCoin, loanCoin, totalDebt, totalCollateralAmount, loanTerm, price } = options;
        const LTV = ((totalDebt / (totalCollateralAmount * price)) * PERCENT).toFixed(0); // ** LTV hiện tại */
        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <section className="flex flex-col">
                        <div className="text-gray-1 dark:text-gray-7">LTV hiện tại</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{LTV}%</div>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <section className="flex flex-col">
                        <div className="text-gray-1 dark:text-gray-7">Thời hạn vay</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{loanTerm} Ngày</div>
                    </section>
                </section>
            </section>
        );
    };

    const renderCol5 = (options) => {
        const { liquidationLTV, initialLTV } = options;

        const totalLiquidationLTV = (liquidationLTV * PERCENT).toFixed(0); //** LTV Thanh lý */
        const totalInitialLTV = (initialLTV * PERCENT).toFixed(0);

        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <section className="flex flex-col">
                        <div className="text-gray-1 dark:text-gray-7">LTV thanh lý</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{totalLiquidationLTV}%</div>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1  h-[72px] whitespace-nowrap">
                    <section className="flex flex-col">
                        <div className="text-gray-1 dark:text-gray-7">LTV gọi ký quỹ</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{totalInitialLTV}%</div>
                    </section>
                </section>
            </section>
        );
    };

    const renderActions = (options) => {
        const { _id, collateralAmount, collateralCoin } = options;
        const getCollateralAsset = totalAsset(collateralAmount, collateralCoin);

        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1  h-[72px] whitespace-nowrap">
                    <section className="flex flex-row items-center w-[162px] ml-6">
                        <ButtonV2 onClick={() => onOpenRepayment({ id: _id })}>Trả khoản vay</ButtonV2>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1  h-[72px] whitespace-nowrap">
                    <section className="flex flex-row items-center w-[162px] ml-6">
                        <ButtonV2
                            onClick={() => handleToggleAdjustModal({ id: _id, collateralAsset: getCollateralAsset })}
                            className="dark:!text-gray-7 !text-gray-1 !bg-gray-12 dark:!bg-dark-2"
                        >
                            Điều chỉnh ký quỹ
                        </ButtonV2>
                    </section>
                </section>
            </section>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 205,
                render: (_, options) => render_Col_Id_Status(options)
            },
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 230,
                render: (_, options) => render_Col_Debt_CreateAt(options)
            },
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 235,
                render: (_, options) => renderCol3(options)
            },
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 170,
                render: (_, options) => renderCol4(options)
            },
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 170,
                render: (_, options) => renderCol5(options)
            },
            {
                // key: 'money_use',
                dataIndex: 'money_use',
                align: 'left',
                width: 205,
                render: (_, options) => renderActions(options)
            }
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
    }, [useMemoizeArgs(data?.result), loading, isDark, copied]);

    return (
        <>
            <section className="rounded-b-2xl bg-white dark:bg-dark-4">{renderTable()}</section>
            <ModalAdjustMargin onClose={handleCloseAdjustModal} dataCollateral={dataCollateral} />
            <ModalLoanRepayment dataCollateral={dataCollateral} isOpen={isOpenRepaymentModal} onClose={onCloseRepayment} />
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
