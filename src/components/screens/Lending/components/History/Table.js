import { useState, useCallback, useEffect } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** Redux
import { useSelector } from 'react-redux';
import { formatNumber, formatTime } from 'redux/actions/utils';

// ** Components
import SelectV2 from 'components/common/V2/SelectV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';

// ** Constants
import { PERCENT, YEAR, LOAN_HISTORY_STATUS, HOUR, ALLOW_ADJUST, FORMAT_HH_MM_SS, LIMIT } from 'components/screens/Lending/constants';

// * Context
import { useAssets } from 'components/screens/Lending/context';

// ** svg
import Copy from 'components/svg/Copy';
import { CheckCircleIcon } from 'components/svg/SvgIcon';

// ** Utils
import { substring } from 'utils';

// ** Hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Third party
import { Check } from 'react-feather';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// ** Dynamic
const AssetFilter = dynamic(() => import('components/screens/Lending/components/AssetFilter', { ssr: false }));

// ** Constants
const INIT_DATA = {
    isModal: false,
    assets: {
        loanable: [],
        collateral: []
    }
};
const TAB_LOAN = 'loan';
const TAB_REPAY = 'repay';
const TAB_ADJUST = 'adjust';
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

    const handleTotalAsset = (data, asset) => {
        const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
        const total = formatNumber(data || 0, symbol?.assetDigit, 0, true);
        return { total: total, symbol: symbol };
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
                        initDate={rsFilter}
                        wrapperClassname="w-[278px]"
                        wrapperClassNameContent="!h-6"
                        position={data?.position || 'center'}
                        onChange={(e) => onChange(e?.selection, key)}
                        wrapperClassNameDate="dark:!text-gray-4 !text-gray-15 !text-base !font-normal whitespace-nowrap"
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
                        wrapperClassName="flex flex-row py-4 gap-3 flex-col"
                        labelClassName="dark:!text-gray-4 !text-gray-15 !text-base"
                        className={classNames('!h-12 w-[247px]', data.childClassName)}
                        activeIcon={<CheckCircleIcon color="currentColor" size={16} />}
                        optionClassName="flex flex-row items-center justify-between text-gray-1 dark:text-gray-4 py-3 text-base hover:bg-dark-13 dark:hover:bg-hover-dark !font-normal"
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
    const renderFilter = () => {
        return Object.keys(configFilter).map((key) => {
            const data = configFilter[key];
            if (tab !== TAB_LOAN && key === 'status') return;
            return (
                <section>
                    <div className={classNames('dark:text-gray-7 text-gray-1 text-sm', { 'invisible h-5': !data.title })}>{data?.title}</div>
                    <div className="mt-2">{list({ key: data.key, data })}</div>
                </section>
            );
        });
    };

    const renderAssetLogo = ({ title, total = 0, assetId, assetCode = '-' }) => {
        return (
            <section className="flex flex-row items-center gap-2 min-w-[214px]">
                <AssetLogo assetId={assetId} />
                <section className="dark:text-gray-7 text-gray-1">
                    <div>{title}</div>
                    <WrapperDetail>
                        {total} {assetCode}
                    </WrapperDetail>
                </section>
            </section>
        );
    };

    const renderCopy = ({ id, title }) => {
        return (
            <WrapperSection>
                <div>{title}</div>
                <WrapperDetail>
                    <div>#{substring(id)}</div>
                    <CopyToClipboard onCopy={onCopy} text={id} className="cursor-pointer inline-block">
                        {copied === id ? <Check size={16} color={colors.teal} /> : <Copy />}
                    </CopyToClipboard>
                </WrapperDetail>
            </WrapperSection>
        );
    };

    const renderID = ({ id, orderId }) => {
        return !ALLOW_ADJUST.includes(tab) ? renderCopy({ title: 'ID khoản vay', id }) : renderCopy({ title: 'ID khoản vay', id: orderId });
    };

    const renderCol2 = (option) => {
        const { status, _id } = option;
        if (tab == 'loan') {
            return (
                <WrapperSection className="w-[150px]">
                    <div>Trạng thái</div>
                    <WrapperDetail
                        className={classNames('dark:text-gray-7 text-gray-1', {
                            'dark:!text-green-2 !text-green-3': status === 'REPAID'
                        })}
                    >
                        {LOAN_HISTORY_STATUS?.[status]?.[language]}
                    </WrapperDetail>
                </WrapperSection>
            );
        }
        if (tab === 'reject') {
            const { collateralAmount, collateralCoin } = option;
            const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
            return renderAssetLogo({
                title: 'Tổng ký quỹ ban đầu',
                total: rsCollateralAmount.total,
                assetId: rsCollateralAmount.symbol.id,
                assetCode: collateralCoin
            });
        }
        return renderCopy({ title: 'ID lệnh ký quỹ', id: _id });
    };
    const renderCol3 = (option) => {
        const { loanCoin, metadata, interest, liquidationFee, loanAmount, totalDebt } = option;

        if (tab === TAB_LOAN) {
            const rsTotalDebt = handleTotalAsset(loanAmount + interest, loanCoin); //** Tổng dư nợ */
            return renderAssetLogo({
                title: 'Tổng dư nợ',
                total: rsTotalDebt.total,
                assetId: rsTotalDebt.symbol.id,
                assetCode: loanCoin
            });
        }
        if (tab === TAB_REPAY) {
            const type = metadata?.repayRate === 1 ? 'Toàn bộ' : 'Một phần';
            return (
                <WrapperSection>
                    <div>Loại hoàn trả</div>
                    <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
                </WrapperSection>
            );
        }
        if (tab === TAB_ADJUST) {
            const type = metadata?.payload?.amount < 0 ? 'Bớt ký quỹ' : 'Thêm ký quỹ';
            return (
                <WrapperSection className="w-[140px] whitespace-nowrap">
                    <div>Loại ký quỹ</div>
                    <div className="dark:text-green-2 text-green-3 font-semibold">{type}</div>
                </WrapperSection>
            );
        }
        // ** reject
        const rsLiquidationFree = handleTotalAsset(totalDebt * liquidationFee, loanCoin);
        return renderAssetLogo({
            title: 'Phí thanh lý',
            total: rsLiquidationFree.total,
            assetId: rsLiquidationFree.symbol.id,
            assetCode: loanCoin
        });
    };

    const renderCol4 = (option) => {
        const { collateralAmount, collateralCoin, detail, createdAt } = option;

        if (tab === TAB_LOAN) {
            const rsCollateralAmount = handleTotalAsset(collateralAmount, collateralCoin); //** Tổng ký quỹ ban đầu */
            return renderAssetLogo({
                title: 'Ký quỹ ban đầu',
                total: rsCollateralAmount.total,
                assetId: rsCollateralAmount.symbol.id,
                assetCode: collateralCoin
            });
        }
        if (tab === TAB_REPAY) {
            const totalRepaid = handleTotalAsset(detail?.totalRepaid?.to, detail?.totalRepaid?.currency);
            return renderAssetLogo({
                title: 'Tổng đã trả',
                total: totalRepaid.total,
                assetId: totalRepaid.symbol.id,
                assetCode: totalRepaid.symbol.assetCode
            });
        }
        if (tab === TAB_ADJUST) {
            const totalCollateralAmount = detail?.totalCollateralAmount;
            const initialCollateral = handleTotalAsset(totalCollateralAmount?.from, collateralCoin);
            return renderAssetLogo({
                title: 'Ký quỹ ban đầu',
                total: initialCollateral.total,
                assetId: initialCollateral.symbol.id,
                assetCode: initialCollateral.symbol.assetCode
            });
        }
        // ** reject
        return (
            <WrapperSection className="whitespace-nowrap">
                <div>Thời gian vay</div>
                <WrapperDetail>{formatTime(createdAt, FORMAT_HH_MM_SS)}</WrapperDetail>
            </WrapperSection>
        );
    };

    const renderCol5 = (option) => {
        const { loanTerm, metadata, collateralCoin, detail, liquidatedAt } = option;
        if (tab === TAB_LOAN) {
            return (
                <WrapperSection>
                    <div>Kỳ hạn</div>
                    <WrapperDetail>{loanTerm} ngày</WrapperDetail>
                </WrapperSection>
            );
        }
        if (tab === TAB_REPAY) {
            const repayCollateralAmount = handleTotalAsset(metadata?.repayCollateralAmount, collateralCoin);
            return renderAssetLogo({
                title: 'Tổng ký quỹ sử dụng',
                total: repayCollateralAmount.total,
                assetId: repayCollateralAmount.symbol.id,
                assetCode: collateralCoin
            });
        }
        if (tab === TAB_ADJUST) {
            const totalCollateralAmount = detail?.totalCollateralAmount;
            const adjustCollateral = handleTotalAsset(totalCollateralAmount?.to, collateralCoin);
            return renderAssetLogo({
                title: 'Ký quỹ điều chỉnh',
                total: adjustCollateral.total,
                assetId: adjustCollateral.symbol.id,
                assetCode: adjustCollateral.symbol.assetCode
            });
        }
        // ** reject
        return (
            <WrapperSection className="whitespace-nowrap">
                <div>Thời gian thanh lý</div>
                <WrapperDetail>{formatTime(liquidatedAt, FORMAT_HH_MM_SS)}</WrapperDetail>
            </WrapperSection>
        );
    };

    const renderCol6 = (option) => {
        const { hourlyInterestRate, metadata, collateralCoin, detail, status } = option;
        if (tab === TAB_LOAN) {
            const interestRate = hourlyInterestRate * HOUR * YEAR * PERCENT;
            return (
                <WrapperSection>
                    <div>Lãi suất năm</div>
                    <WrapperDetail>{interestRate.toFixed(2)}%</WrapperDetail>
                </WrapperSection>
            );
        }
        if (tab === TAB_REPAY) {
            const returnCollateralAmount = handleTotalAsset(metadata?.returnCollateralAmount, collateralCoin);

            return renderAssetLogo({
                title: 'Tổng ký quỹ hoàn trả',
                total: returnCollateralAmount.total,
                assetId: returnCollateralAmount.symbol.id,
                assetCode: collateralCoin
            });
        }
        if (tab === TAB_ADJUST) {
            const LTV = detail?.LTV;
            return (
                <section className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <section className="dark:text-gray-7 text-gray-1 whitespace-nowrap">
                        <div>LTV trước điều chỉnh</div>
                        <WrapperDetail>{(LTV?.from * PERCENT).toFixed(0)}%</WrapperDetail>
                    </section>
                </section>
            );
        }
        // ** reject
        return (
            <WrapperSection className="whitespace-nowrap">
                <div>Nguyên nhân thanh lý</div>
                <WrapperDetail>{LOAN_HISTORY_STATUS?.[status]?.[language]}</WrapperDetail>
            </WrapperSection>
        );
    };

    const renderCol7 = (option) => {
        const { createdAt, detail } = option;
        if (tab === TAB_LOAN) {
            return (
                <WrapperSection className="w-max">
                    <div>Thời gian vay</div>
                    <WrapperDetail>{formatTime(createdAt, 'HH:mm:ss dd/MM/yyyy')}</WrapperDetail>
                </WrapperSection>
            );
        }
        if (tab === TAB_ADJUST) {
            const LTV = detail?.LTV;
            return (
                <section className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>LTV sau điều chỉnh</div>
                        <WrapperDetail>{(LTV?.to * PERCENT).toFixed(0)}%</WrapperDetail>
                    </section>
                </section>
            );
        }
    };

    const renderCol8 = (option) => {
        const { expirationTime, metadata } = option;

        if (tab === TAB_LOAN) {
            return (
                <WrapperSection className="w-max">
                    <div>Thời gian hết hạn</div>
                    <WrapperDetail>{formatTime(expirationTime, FORMAT_HH_MM_SS)}</WrapperDetail>
                </WrapperSection>
            );
        }
        if (tab === TAB_ADJUST) {
            return (
                <section className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Thời gian vay</div>
                        <WrapperDetail>{formatTime(metadata?.orderCreatedAt || '-', FORMAT_HH_MM_SS)}</WrapperDetail>
                    </section>
                </section>
            );
        }
    };

    const renderCol9 = (option) => {
        const { createdAt } = option;

        if (tab === TAB_ADJUST) {
            return (
                <section className="flex flex-row items-center gap-2 whitespace-nowrap">
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Thời gian điều chỉnh</div>
                        <WrapperDetail>{formatTime(createdAt || '-', FORMAT_HH_MM_SS)}</WrapperDetail>
                    </section>
                </section>
            );
        }
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: '_id',
                dataIndex: '_id',
                title: '',
                align: 'left',
                render: (value, option) => renderID({ id: value, orderId: option.orderId })
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol2(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol3(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                width: 220,

                render: (value, option) => renderCol4(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol5(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol6(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol7(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol8(option)
            },
            {
                key: '',
                dataIndex: '',
                title: '',
                align: 'left',
                render: (value, option) => renderCol9(option)
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
                    rowHeight: '96px'
                }}
            />
        );
    }, [data?.result, loading, isDark, filter, tab, copied]);

    return (
        <section className="rounded-xl border-[0px] border-divider dark:border-divider-dark bg-white dark:bg-dark-4">
            <div className="flex gap-6 flex-wrap mx-6 items-end justify-between">
                <div className="flex justify-between gap-4 mb-8 mt-6">{renderFilter()}</div>
            </div>
            {renderTable()}
        </section>
    );
};

const WrapperSection = styled.section.attrs(({ className }) => ({
    className: classNames('flex flex-col justify-center dark:text-gray-7 text-gray-1 whitespace-nowrap', className)
}))``;

const WrapperDetail = styled.section.attrs(({ className }) => ({
    className: classNames('dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center whitespace-nowrap', className)
}))``;

const WrapperTable = styled(TableV2).attrs(({ ...props }) => ({
    className: classNames(props)
}))`
    .rc-table-container {
        .rc-table-thead {
            display: none;
        }
        .rc-table-tbody {
            tr td {
                border-color: ${(props) => (props.isDark ? colors.divider.dark : colors.divider.DEFAULT)} !important;
            }
        }
    }
`;

export default HistoryTable;
