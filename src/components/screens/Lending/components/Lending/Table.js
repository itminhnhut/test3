import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';

// ** hooks
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

// ** Redux
import { formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

// ** Third party
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';
import colors from 'styles/colors';
import dynamic from 'next/dynamic';

// ** dynamic
const ModalRegisterLoan = dynamic(() => import('components/screens/Lending/components/Modal/RegisterLoan'));

// ** Constants
const LIMIT = 10;

const INIT_DATA = {
    isModal: false
};

const LendingTable = ({ data, page, loading, onPage }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    // ** useState
    const [isModal, setIsModal] = useState(INIT_DATA.isModal);

    // ** handle
    const handleToggleModal = () => setIsModal((prev) => !prev);

    // ** get data
    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const getAsset = (assetCode) => {
        return assetConfigs.find((asset) => asset.assetCode === assetCode);
    };

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
                        <AssetLogo assetId={getAsset(value)?.id} />
                        <span className="ml-2">{getAsset(value)?.assetCode}</span>
                    </section>
                )
            },
            {
                key: 'minLimit',
                dataIndex: 'minLimit',
                title: renderTitle(t('lending:lending:table:minimum'), 'Đơn vị: VND'),
                align: 'left',
                minWidth: 205,
                render: (value) => <div>{formatNumber(value)}</div>
            },
            {
                key: 'maxLimit',
                dataIndex: 'maxLimit',
                title: renderTitle(t('lending:lending:table:maximum'), 'Đơn vị: VND'),
                align: 'left',
                width: 205,
                render: (value) => <div className="font-normal">{formatNumber(value)}</div>
            },
            {
                key: '_7dHourlyInterestRate',
                dataIndex: '_7dDailyInterestRate',
                title: renderTitle(t('lending:lending:table:7days'), 'Lãi suất theo giờ/theo năm'),
                align: 'left',
                minWidth: 205,
                render: (value, data) => <div className="font-normal">{`${value}/${data._180dDailyInterestRate}`}</div>
            },
            {
                key: '_30dHourlyInterestRate',
                dataIndex: '_30dDailyInterestRate',
                title: renderTitle(t('lending:lending:table:30days'), 'Lãi suất theo giờ/theo năm'),
                align: 'left',
                minWidth: 206,
                render: (value, data) => <div className="font-normal">{`${value}/${data._180dDailyInterestRate}`}</div>
            },
            {
                key: '',
                dataIndex: '',
                align: 'right',
                width: 205,
                render: () => (
                    <div className="dark:text-green-2 text-green-3 font-semibold text-center" onClick={handleToggleModal}>
                        {t('lending:lending:table:active')}
                    </div>
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
                data={data || []}
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
