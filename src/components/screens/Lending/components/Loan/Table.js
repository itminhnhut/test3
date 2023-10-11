import { useState, useCallback, useContext } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import Tooltip from 'components/common/Tooltip';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import EmptyData from 'components/screens/Lending/EmptyData';

// ** Utils
import { substring } from 'utils';

// ** svg
import Copy from 'components/svg/Copy';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Constants
import { LIMIT, LOAN_HISTORY_STATUS, PERCENT, STATUS_CODE } from 'components/screens/Lending/constants';

// ** Utils
import FetchApi from 'utils/fetch-api';
import { totalAsset } from 'components/screens/Lending/utils';

// ** Context
import { LendingContext, usePairPrice } from 'components/screens/Lending/Context';
import { globalActionTypes as actions } from 'components/screens/Lending/Context/actions';

// ** Redux
import { formatTime } from 'redux/actions/utils';
import { API_HISTORY_LOAN } from 'redux/actions/apis';

// ** AXIOS
import axios from 'axios';

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
const ModalAdjustMargin = dynamic(() => import('components/screens/Lending/components/Modal/Adjust/AdjustMargin'));
const ModalLoanRepayment = dynamic(() => import('components/screens/Lending/components/Modal/LoanRepayment'), { ssr: false });

const INIT_DATA = {
    isModal: false
};

const DISABLE_STATUS = ['ACCRUING_INTEREST'];

const CancelToken = axios.CancelToken;
const isCancel = (error) => axios.isCancel(error);
let cancel;

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
    const { getPairPrice } = usePairPrice();
    // ** useState
    const [dataCollateral, setDataCollateral] = useState({});

    // ** handle
    const handleLoanOrderDetail = async (id, collateralAsset = {}, action = false) => {
        try {
            const { data, statusCode } = await FetchApi({
                url: `${API_HISTORY_LOAN}/${id}`,
                cancelToken: new CancelToken(function exec(c) {
                    cancel = c;
                })
            });
            if (statusCode === STATUS_CODE) {
                setDataCollateral({ ...data, collateralAsset });
                if (action === 'adjust') {
                    dispatchReducer({ type: actions.TOGGLE_MODAL_ADJUST_MARGIN }); //** show modal adjust
                    getPairPrice({ collateralAssetCode: data?.collateralCoin, loanableAssetCode: data?.loanCoin }); //** get price token
                } else {
                    setIsOpenRepaymentModal(true);
                }
            }
        } catch (error) {
            if (isCancel(error)) {
                console.error('Cancelled');
            } else {
                throw new Error('api get loan order detail error', error);
            }
        }
    };

    // ** useState
    const [isOpenRepaymentModal, setIsOpenRepaymentModal] = useState(INIT_DATA.isModal);
    const [copied, setCopied] = useState(false);

    // ** handle modal
    const handleToggleAdjustModal = async ({ id, collateralAsset }) => {
        if (cancel !== undefined) {
            cancel();
        }
        handleLoanOrderDetail(id, collateralAsset, 'adjust');
    };
    const onOpenRepayment = async ({ id, collateralAsset }) => {
        if (cancel !== undefined) {
            cancel();
        }
        handleLoanOrderDetail(id, collateralAsset);
    };

    // ** handle modal
    const onCloseRepayment = () => setIsOpenRepaymentModal((prev) => !prev);

    // ** handle close modal adjust (Điều chỉnh ký quỹ)
    const handleCloseAdjustModal = () => {
        if (+state.amount > 0) {
            dispatchReducer({ type: actions.TOGGLE_MODAL_CANCEL, modal: { isCancel: true, isAdjust: false } });
        } else {
            dispatchReducer({ type: actions.TOGGLE_MODAL_ADJUST_MARGIN });
            dispatchReducer({ type: actions.RESET_AMOUNT });
        }
    };

    const onCopy = (value) => {
        setCopied(value);
    };

    const render_Col_Id_Status = (options) => {
        const { _id, status, onMarginCall } = options;
        const loan_status = status;
        if (status === 'ONGOING' && onMarginCall) {
            loan_status = 'MARGIN_CALL';
        }

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
                        className={classNames('font-semibold text-yellow-2 border-b border-darkBlue-5 border-dashed cursor-pointer w-fit', {
                            'dark:!text-green-2 !text-green-3': loan_status === 'ONGOING'
                        })}
                        data-tip={LOAN_HISTORY_STATUS?.[status]?.contentTooltip?.[language]}
                        data-for={status}
                    >
                        {LOAN_HISTORY_STATUS?.[loan_status]?.[language]}
                    </div>
                </section>
                <Tooltip id={loan_status} place="top" effect="solid" isV3 className="max-w-[300px]" />
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
        const { collateralAmount, collateralCoin, expirationTime, status } = options;
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
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{formatTime(expirationTime, 'HH:mm:ss dd/MM/yyyy')}</div>
                            </section>
                        </section>
                    )}
                </section>
            </section>
        );
    };
    const renderCol4 = (options) => {
        const { totalDebt, totalCollateralAmount, loanTerm, price } = options;
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
        const { liquidationLTV, marginCallLTV } = options;

        const totalLiquidationLTV = (liquidationLTV * PERCENT).toFixed(0); //** LTV Thanh lý */
        const totalMarginCallLTV = (marginCallLTV * PERCENT).toFixed(0);

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
                        <div className="dark:text-gray-4 text-gray-15 font-semibold">{totalMarginCallLTV}%</div>
                    </section>
                </section>
            </section>
        );
    };

    const renderActions = (options) => {
        const { _id, collateralAmount, collateralCoin, isAccruingInterest } = options;
        const getCollateralAsset = totalAsset(collateralAmount, collateralCoin);

        return (
            <section className="flex flex-col h-[128px] w-max">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1  h-[72px] whitespace-nowrap">
                    <section className="flex flex-row items-center w-[162px] ml-6">
                        <ButtonV2 disabled={DISABLE_STATUS.includes(isAccruingInterest)} onClick={() => onOpenRepayment({ id: _id })}>
                            Trả khoản vay
                        </ButtonV2>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1  h-[72px] whitespace-nowrap">
                    <section className="flex flex-col items-center w-[162px] ml-6">
                        <ButtonV2
                            onClick={() => handleToggleAdjustModal({ id: _id, collateralAsset: getCollateralAsset })}
                            variants="adjust"
                            disabled={DISABLE_STATUS.includes(isAccruingInterest)}
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
    }, [data?.result, loading, isDark, copied]);

    return (
        <>
            <section className="bg-white dark:bg-dark-4 rounded-xl">
                {data?.result?.length === 0 ? (
                    <EmptyData isDark={isDark} content="Không có lệnh cần thanh toán" textBtn="Vay Crypto ngay" link="/lending?tab=lending&loanAsset=USDT" />
                ) : (
                    renderTable()
                )}
            </section>
            <ModalAdjustMargin isShow={state.modal.isAdjust} onClose={handleCloseAdjustModal} dataCollateral={dataCollateral} />
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
                &:first-child {
                    padding-top: 16px;
                }
                padding-top: 15px;
                padding-bottom: 15px;
                border-color: ${(props) => (props.isDark ? colors.divider.dark : colors.divider.DEFAULT)} !important;
            }
            tr:nth-child(2) td {
                &:first-child {
                    border-top-left-radius: 12px;
                }
                &:last-child {
                    border-top-right-radius: 12px;
                }
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
