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

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

// ** Third party
import { Check } from 'react-feather';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// ** constants
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

const substring = (str, start = 10, end = -4) => (String(str).length > 10 ? `${String(str).substr(0, start)}...${String(str).substr(end)}` : str);

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

    // ** handle
    const onCopy = () => {
        setCopied(true);
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
                        position={data?.position || 'center'}
                        wrapperClassNameDate="dark:!text-gray-4 !text-gray-15 !text-base !font-normal"
                        wrapperClassNameContent="!h-6"
                        onChange={(e) => onChange(e?.selection, key)}
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
                        wrapperLabel="h-12 dark:!text-gray-4 !text-gray-15 !text-base"
                        assetCode={assetCode}
                        asset={valueAssetByKey}
                        data={dataAssetByKey}
                        labelClassName="mr-2"
                        labelAsset="Chọn tài sản"
                        onChangeAsset={(e) => onChange(e, key)}
                        wrapperClassName="w-max right-[0] !left-[auto]"
                        className={classNames('!w-[168px] text-base !text-gray-15 dark:!text-gray-7 !h-12', { '!w-[295px]': tab === 'reject' })}
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
            if (tab === 'reject' && key === 'status') return;
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
        const rsTotalDebt = handleTotalAsset(totalDebt, loanCoin); //** tổng dư nợ */
        const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
        const interestRate = hourlyInterestRate * HOUR * YEAR * PERCENT;

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px]">
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
        const rsLiquidationFree = handleTotalAsset(interest * liquidationFee, loanCoin); //** Tổng ký quỹ ban đầu */

        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px] whitespace-nowrap">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#{substring(_id)}</div>
                        <CopyToClipboard onCopy={onCopy} className="cursor-pointer inline-block">
                            {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
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
                {/* <section className="flex flex-row items-center gap-2 min-w-[162px]">
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
                </section> */}
            </section>
        );
    };

    const renderContent = (value) => {
        return tab !== 'reject' ? renderContentTab(value) : renderContentTabReject(value);
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
    }, [data?.result, loading, isDark, filter, tab]);

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
