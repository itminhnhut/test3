import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** svg
import Copy from 'components/svg/Copy';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

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
    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const getAsset = (assetId) => {
        return assetConfigs.find((asset) => asset.id === assetId);
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

    const renderIdStatus = ({ value }) => {
        return (
            <section className="flex flex-col">
                <section className="flex flex-col justify-center dark:text-gray-7 text-gray-1 h-[72px]">
                    <div>ID khoản vay</div>
                    <div className="dark:text-gray-4 text-gray-15 font-semibold flex flex-row gap-1 items-center">
                        <div>#1231242</div>
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
                        Gọi ký quỹ
                    </div>
                </section>
            </section>
        );
    };

    const renderLTV = ({ value }) => {
        return (
            <>
                {renderRepayment()}
                {renderAdjust()}
            </>
        );
    };

    const renderAsset = (data, type) => {
        const rs = ((data, type) => {
            switch (type) {
                case 'token':
                    return `${formatNumber(data)} ${getAsset(39)?.assetCode}`;
                case 'percent':
                    return `${data}%`;
                case 'date':
                    return `${data} ${language === 'vi' ? 'ngày' : 'ngày'}`;
                case 'formatDate':
                    return formatTime(data, 'dd/MM/yyyy HH:mm:ss');
                default:
                    '-';
            }
        })(data, type);
        return rs;
    };

    const renderRepayment = () => {
        const totalRepayment = [60000000, 80, 85, 95];
        return (
            <section className="grid grid-cols-4 h-[72px] w-max gap-4">
                {REPAYMENT?.map((item, key) => {
                    return (
                        <section className={classNames('flex flex-row items-center', { 'gap-1': item?.asset === 'token' })}>
                            {item?.asset === 'token' ? <AssetLogo assetId={72} /> : null}
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{renderAsset(totalRepayment?.[key], item.asset)}</div>
                            </section>
                        </section>
                    );
                })}
            </section>
        );
    };

    const renderAdjust = () => {
        const totalRepayment = [600, 7, '2023-09-05T17:00:00.000Z', '2023-09-05T17:00:00.000Z'];
        return (
            <section className="grid grid-cols-4 h-[72px] w-max gap-4">
                {ADJUST?.map((item, key) => {
                    return (
                        <section className={classNames('flex flex-row items-center', { 'gap-1': item?.asset === 'token' })}>
                            {item?.asset === 'token' ? <AssetLogo assetId={22} /> : null}
                            <section className="flex flex-col">
                                <div className="text-gray-1 dark:text-gray-7">{item.title?.[language]}</div>
                                <div className="dark:text-gray-4 text-gray-15 font-semibold">{renderAsset(totalRepayment?.[key], item.asset)}</div>
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
                key: 'currency',
                dataIndex: 'currency',

                title: t('lending:lending:table:assets'),
                align: 'left',
                width: 176,
                render: (value) => renderIdStatus({ value })
            },
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: renderTitle(t('lending:lending:table:minimum'), 'Đơn vị: VND'),
                align: 'left',
                width: 205,
                render: (value) => renderLTV({ value })
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
