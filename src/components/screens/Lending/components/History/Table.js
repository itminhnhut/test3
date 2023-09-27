import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import SelectV2 from 'components/common/V2/SelectV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';

// ** svg
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import Copy from 'components/svg/Copy';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

// ** Third party
import { Check } from 'react-feather';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// ** constants
import { STATUS_VI, STATUS_EN } from 'components/screens/Lending/constants';

// ** dynamic
const ModalRegisterLoan = dynamic(() => import('components/screens/Lending/components/Modal/RegisterLoan'));
const AssetFilter = dynamic(() => import('components/screens/Lending/components/AssetFilter', { ssr: false }));

// ** Constants
const LIMIT = 10;

const INIT_DATA = {
    isModal: false,
    filters: {
        time: {
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null
        },
        status: {
            key: 'status',
            value: null
        },
        loan_asset: {
            key: 'loan_asset',
            value: null
        },
        margin_asset: {
            key: 'margin_asset',
            value: null
        }
    }
};

const LendingTable = ({ data, page, loading, onPage, keyTab }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const filters = {
        time: {
            key: 'time',
            type: 'dateRange',
            value: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            values: null,
            title: t('lending:history:table:time'),
            position: 'left',
            wrapperDate: 'dark:!text-gray-4 !text-gray-15 !text-base !font-normal'
        },
        status: {
            key: 'status',
            type: 'select',
            value: null,
            values: language === 'en' ? STATUS_EN : STATUS_VI,
            title: t('lending:history:table:status'),
            childClassName: 'text-sm !text-gray-15 dark:!text-gray-7'
        },
        loan_asset: {
            key: 'loan_asset',
            type: 'select_assets',
            value: null,
            assetCode: 'margin_asset',
            title: t('lending:history:table:loan_asset')
        },
        margin_asset: {
            assetCode: 'loan_asset',
            key: 'margin_asset',
            type: 'select_assets',
            value: null,
            title: t('lending:history:table:margin_asset')
        },
        reset: {
            type: 'reset',
            label: '',
            title: t('lending:history:table:reset'),
            buttonClassName: '!h-12 !text-gray-1 dark:!text-gray-7 font-semibold text-base !w-[250px]'
        }
    };

    // ** useState
    const [isModal, setIsModal] = useState(INIT_DATA.isModal);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState(INIT_DATA.filters);

    // ** useEffect
    useEffect(() => {
        const isEqual = JSON.stringify(INIT_DATA.filters) === JSON.stringify(filter);
        if (!isEqual) {
            console.log('--re-render');
            setFilter(INIT_DATA.filters);
        }
    }, [keyTab]);

    // ** handle
    const onCopy = () => {
        setCopied(true);
    };
    const handleToggleModal = () => setIsModal((prev) => !prev);

    const onChange = (value, key) => {
        setFilter((prev) => ({ ...prev, [key]: { ...prev[key], value } }));
    };

    const onReset = () => setFilter(INIT_DATA.filters);

    // ** get data
    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const getAsset = (assetId) => {
        return assetConfigs.find((asset) => asset.id === assetId);
    };

    const list = ({ data, key }) => {
        let assetCode = null;
        const type = data?.type || '';
        const rsFilter = filter?.[key] || {};

        if (rsFilter?.assetCode) {
            assetCode = filter?.[rsFilter?.assetCode].value?.id;
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
                        wrapperClassNameDate={filter.wrapperDate}
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
                        value={rsFilter?.value || data?.values[0]?.value}
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
                        wrapperLabel="h-12"
                        assetCode={assetCode}
                        asset={rsFilter.value}
                        labelClassName="mr-2"
                        labelAsset="Chọn tài sản"
                        onChangeAsset={(e) => onChange(e, key)}
                        wrapperClassName="w-max right-[0] !left-[auto]"
                        className="!w-[168px] text-base !text-gray-15 dark:!text-gray-7 !h-12"
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
        return Object.keys(filters).map((key) => {
            const data = filters[key];
            return (
                <section className="">
                    <div className={classNames('dark:text-gray-7 text-gray-1 text-sm', { 'invisible h-5': !data.title })}>{data?.title}</div>
                    <div className="mt-2">{list({ key: data.key, data })}</div>
                </section>
            );
        });
    };

    const renderContent = (value) => {
        return (
            <section className="flex flex-row gap-6 py-4">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px]">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#1231242</div>
                        <CopyToClipboard onCopy={onCopy} className="cursor-pointer inline-block">
                            {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
                        </CopyToClipboard>
                    </div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] w-[180px]">
                    <div>Thời gian vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">09:55:39 12/08/2023</div>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[218px]">
                    <AssetLogo assetId={39} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Số lượng tài sản vay</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">20,000,000 VNDC</div>
                    </section>
                </section>
                <section className="flex flex-row items-center gap-2 min-w-[162px]">
                    <AssetLogo assetId={22} />
                    <section className="dark:text-gray-7 text-gray-1">
                        <div>Ký quỹ ban đầu</div>
                        <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">0.05 BTC</div>
                    </section>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px] min-w-[162px]">
                    <div>LTV ban đầu</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">70%</div>
                </section>
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    <div>Trạng thái</div>
                    <div className="dark:text-gray-7 text-gray-1 font-semibold flex flex-row gap-1 items-center">Thanh lý</div>
                </section>
            </section>
        );
    };

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'currency',
                dataIndex: 'currency',
                title: renderTitle(),
                align: 'left',
                width: 189,
                render: (value) => renderContent(value)
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
    }, [data?.result, loading, isDark, filter]);

    return (
        <>
            <section className="rounded-xl border-[0px] border-divider dark:border-divider-dark bg-white dark:bg-dark-4">{renderTable()}</section>
            {/* Tạo khoản vay  */}
            <ModalRegisterLoan isModal={isModal} onClose={handleToggleModal} />
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

export default LendingTable;
