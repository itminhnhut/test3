import { useMemo, useState, useCallback, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import SelectV2 from 'components/common/V2/SelectV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';

// * Context
import { useAssets } from 'components/screens/Lending/Context';

// ** svg
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import Copy from 'components/svg/Copy';

// ** Hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

// ** Utils
import { substring } from 'utils';

// ** Third party
import { Check } from 'react-feather';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// ** Constants
import { PERCENT, YEAR, LOAN_HISTORY_STATUS, HOUR } from 'components/screens/Lending/constants';

// ** dynamic
const AssetFilter = dynamic(() => import('components/screens/Lending/components/AssetFilter', { ssr: false }));

// ** Constants
const LIMIT = 10;

const INIT_DATA = {
    isModal: false,
    assets: {
        loanable: {},
        collateral: {}
    }
};

// const substring = (str, start = 10, end = -4) => (String(str).length > 10 ? `${String(str).substr(0, start)}...${String(str).substr(end)}` : str);

const DISABLE_STATUS = ['reject', 'repay', 'adjust'];

const HistoryTable = ({ data, page, loading, onPage, tab, filter, onFilter, configFilter, onReset }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    // ** useRedux
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // ** useContext
    const { assetLoanable, assetCollateral } = useAssets();

    // ** useState
    const [copied, setCopied] = useState(false);
    const [dataAssets, setDataAssets] = useState(INIT_DATA.assets);

    // ** useEffect
    useEffect(() => {
        setDataAssets({ loanable: assetLoanable, collateral: assetCollateral });
    }, [filter]);

    useEffect(() => {
        copied?.length > 0 && setCopied(false);
    }, [tab]);

    // ** handle
    const onCopy = (value) => {
        setCopied(value);
    };

    const onChange = (value, key) => {
        onFilter(value, key);
    };

    const list = ({ data, key }) => {
        let assetCode = null;
        let dataAssetByKey, valueAssetByKey;

        const type = data?.type || '';
        const rsFilter = filter?.[key] || {};

        if (rsFilter?.assetCode) {
            assetCode = filter?.[rsFilter?.assetCode]?.value?.id;
        }

        if (type === 'select_assets') {
            if (key === 'loanCoin') {
                dataAssetByKey = dataAssets?.loanable;
                valueAssetByKey = filter?.loanCoin;
            }
            if (key === 'collateralCoin') {
                dataAssetByKey = dataAssets?.collateral;
                valueAssetByKey = filter?.collateralCoin;
            }
        }

        switch (type) {
            case 'dateRange':
                return (
                    <DatePickerV2
                        month={2}
                        hasShadow
                        colorX="#8694b2"
                        initDate={rsFilter?.value}
                        wrapperClassname="!w-full"
                        wrapperClassNameContent="!h-6"
                        position={data?.position || 'center'}
                        onChange={(e) => onChange(e?.selection, key)}
                        wrapperClassNameDate="dark:!text-gray-4 !text-gray-15 !text-base !font-normal"
                    />
                );
            case 'select':
                return (
                    <SelectV2
                        name={key}
                        keyExpr="value"
                        options={data.values}
                        popoverPanelClassName="top-auto"
                        onChange={(e) => onChange(e, key)}
                        value={filter?.status || data?.values[0]?.value}
                        wrapperClassName="flex flex-row gap-2 flex-col"
                        labelClassName="dark:!text-gray-4 !text-gray-15 !text-base"
                        className={classNames('!h-12 w-[247px]', data.childClassName)}
                        activeIcon={<CheckCircleIcon color="currentColor" size={16} />}
                        optionClassName="flex flex-row items-center justify-between text-gray-1 dark:text-gray-4 py-3 text-base hover:bg-dark-13 dark:hover:bg-hover-dark"
                    />
                );
            case 'select_assets':
                return (
                    <AssetFilter
                        assetCode={assetCode}
                        data={dataAssetByKey}
                        labelClassName="mr-2"
                        asset={valueAssetByKey}
                        labelAsset="Chọn tài sản"
                        onChangeAsset={(e) => onChange(e, key)}
                        wrapperClassName="w-max right-[0] !left-[auto]"
                        wrapperLabel="h-12 dark:!text-gray-4 !text-gray-15 !text-base"
                        className={classNames('!w-[168px] text-base !text-gray-15 dark:!text-gray-7 !h-12', { '!w-[295px]': DISABLE_STATUS.includes(tab) })}
                    />
                );
            case 'reset':
                return (
                    <ButtonV2 variants="reset" className={classNames(data?.buttonClassName)} onClick={onReset}>
                        {data.title}
                    </ButtonV2>
                );
            default:
                return '';
        }
    };
    // ** render
    const renderTitle = () => {
        return Object.keys(configFilter).map((key) => {
            const data = configFilter[key];
            if (tab !== 'loan' && key === 'status') return;
            return (
                <section>
                    <div className={classNames('dark:text-gray-7 text-gray-1 text-sm', { 'invisible h-5': !data.title })}>{data?.title}</div>
                    <div className="mt-2">{list({ key: data.key, data })}</div>
                </section>
            );
        });
    };

    const handleTotalAsset = (data, asset) => {
        const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
        const total = formatNumber(data || 0, symbol?.assetDigit, 0, true);
        return { total: total, symbol: symbol };
    };

    const renderContentTab = (value) => {
        const { _id, createdAt, totalDebt, loanCoin, collateralAmount, collateralCoin, loanTerm, hourlyInterestRate, status } = value;
        const rsTotalDebt = handleTotalAsset(totalDebt, loanCoin); //** Tổng dư nợ */
        const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
        const interestRate = hourlyInterestRate * HOUR * YEAR * PERCENT;

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px]">
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
                        className={classNames('dark:text-gray-7 text-gray-1 font-semibold flex flex-row gap-1 items-center', {
                            'dark:!text-green-2 !text-green-3': status === 'REPAID'
                        })}
                    >
                        {LOAN_HISTORY_STATUS?.[status]?.[language]}
                    </div>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[218px]">
                    <AssetLogo assetId={rsTotalDebt.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Tổng dư nợ</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {rsTotalDebt.total} {loanCoin}
                        </div>
                    </section>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[162px]">
                    <AssetLogo assetId={rsCollateralAmount.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Ký quỹ ban đầu</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {rsCollateralAmount.total} {collateralCoin}
                        </div>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[72px]">
                    <div>Kỳ hạn</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">{loanTerm} ngày</div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[72px]">
                    <div>Lãi suất năm</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">{formatNumber(interestRate)}%</div>
                </section>

                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[180px]">
                    <div>Thời gian vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        {formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}
                    </div>
                </section>
            </section>
        );
    };

    const renderContentTabReject = (value) => {
        const { _id, collateralAmount, collateralCoin, createdAt, liquidationTime, status, interest, liquidationFee, loanCoin } = value;
        const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
        const rsLiquidationFree = handleTotalAsset(interest * liquidationFee, loanCoin);

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                            {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[214px]">
                    <AssetLogo assetId={rsCollateralAmount.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Tổng ký quỹ ban đầu</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {rsCollateralAmount.total} {collateralCoin}
                        </div>
                    </section>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={rsLiquidationFree.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Phí thanh lý</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {rsLiquidationFree.total} {loanCoin}
                        </div>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[180px]">
                    <div>Thời gian vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        {formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[180px]">
                    <div>Thời gian thanh lý</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        {formatTime(liquidationTime, 'HH:mm:ss dd/MM/yyyy')}
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] whitespace-nowrap">
                    <div>Nguyên nhân thanh lý</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        {LOAN_HISTORY_STATUS?.[status]?.[language]}
                    </div>
                </section>
            </section>
        );
    };

    const renderContentTabAdjust = (value) => {
        const { _id, orderId, metadata, detail, collateralCoin } = value;

        const totalCollateralAmount = detail?.totalCollateralAmount;
        const LTV = detail?.LTV;

        const initialCollateral = handleTotalAsset(totalCollateralAmount?.from, collateralCoin);
        const adjustCollateral = handleTotalAsset(totalCollateralAmount?.to, collateralCoin);

        const type = metadata?.payment?.amount < 0 ? 'Bớt ký quỹ' : 'Thêm ký quỹ';

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(orderId)}</div>
                        <CopyToClipboard onCopy={onCopy} text={orderId} className="cursor-pointer inline-block">
                            {copied === orderId ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID lệnh ký quỹ</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                            {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>Loại ký quỹ</div>
                    <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={initialCollateral.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Ký quỹ ban đầu</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {initialCollateral.total} {initialCollateral.symbol.assetCode}
                        </div>
                    </section>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={adjustCollateral.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Ký quỹ ban đầu</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {adjustCollateral.total} {adjustCollateral.symbol.assetCode}
                        </div>
                    </section>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>LTV trước điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">{(LTV?.from * PERCENT).toFixed(0)}%</div>
                    </section>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>LTV sau điều chỉnh</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">{(LTV?.to * PERCENT).toFixed(0)}%</div>
                    </section>
                </section>
            </section>
        );
    };

    const renderContentTabRepay = (value) => {
        const { _id, orderId, metadata, detail, collateralCoin } = value;

        const totalRepaid = handleTotalAsset(detail?.totalRepaid?.to, detail?.totalRepaid?.currency);

        const repayCollateralAmount = handleTotalAsset(metadata?.repayCollateralAmount, collateralCoin);
        const returnCollateralAmount = handleTotalAsset(metadata?.returnCollateralAmount, collateralCoin);

        const type = metadata?.repayRate === 1 ? 'Toàn bộ' : 'Một phần';

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(orderId)}</div>
                        <CopyToClipboard onCopy={onCopy} text={orderId} className="cursor-pointer inline-block">
                            {copied === orderId ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID lệnh ký quỹ</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} text={_id} className="cursor-pointer inline-block">
                            {copied === _id ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[150px] whitespace-nowrap">
                    <div>Loại hoàn trả</div>
                    <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={totalRepaid.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Tổng đã trả</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {totalRepaid.total} {totalRepaid.symbol.assetCode}
                        </div>
                    </section>
                </section>

                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={repayCollateralAmount.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Tổng ký quỹ sử dụng</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {repayCollateralAmount.total} {collateralCoin}
                        </div>
                    </section>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[204px]">
                    <AssetLogo assetId={returnCollateralAmount.symbol.id} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Tổng ký quỹ hoàn trả</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                            {returnCollateralAmount.total} {collateralCoin}
                        </div>
                    </section>
                </section>
            </section>
        );
    };

    const templateContent = {
        reject: (value) => renderContentTabReject(value),
        loan: (value) => renderContentTab(value),
        adjust: (value) => renderContentTabAdjust(value),
        repay: (value) => renderContentTabRepay(value)
    };

    const renderContent = (value) => {
        return templateContent?.[tab] && templateContent?.[tab].call(this, value);
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'currency',
                dataIndex: 'currency',
                title: renderTitle(),
                align: 'left',
                width: 189,
                render: (value, option) => renderContent(option)
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
    }, [data?.result, loading, isDark, filter, tab, copied]);

    return <section className="rounded-xl border-[0px] border-divider dark:border-divider-dark bg-white dark:bg-dark-4">{renderTable()}</section>;
};

const WrapperTable = styled(TableV2).attrs(({ ...props }) => ({
    className: classNames(props)
}))`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            width: ${(props) => (props.isMobile ? 'max-content' : '100%')};
        }
        // .rc-table-tbody {
        //     display: flex;
        //     flex-direction: row;
        // }
        .rc-table-thead {
            tr th {
                max-height: 112px;
                display: flex;
                flex-direction: row;
                gap: 12px;
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

export default HistoryTable;
