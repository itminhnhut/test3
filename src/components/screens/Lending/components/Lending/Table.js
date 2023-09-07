import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';

// ** components
import AssetLogo from 'components/wallet/AssetLogo';
import TableV2 from 'components/common/V2/TableV2';

// ** Redux
import { useSelector } from 'react-redux';

// ** Third party
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import classNames from 'classnames';

// ** Constants
const LIMIT = 10;

const LendingTable = ({ data, page, loading, onPage }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    // const asset = useMemo(() => {
    //     return assetConfigs.find((asset) => asset.id === assetId);
    // }, [assetConfigs, assetId]);

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'currency',
                dataIndex: 'currency',
                title: t('staking:statics:history:columns.type'),
                align: 'left',
                width: 302,
                render: (value) => (
                    <section className="flex flex-row items-center">
                        <AssetLogo assetId={value} />
                        {/* <span className="ml-2">{asset?.assetCode}</span> */}
                    </section>
                )
            },
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: t('staking:statics:history:columns.amount'),
                align: 'left',
                width: 302,
                render: (value) => 1
            },
            {
                key: 'created_at',
                dataIndex: 'created_at',
                title: t('staking:statics:history:columns.time'),
                align: 'left',
                width: 302,
                render: (value) => <div className="font-normal">2</div>
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: t('staking:statics:history:columns.status'),
                align: 'right',
                width: 302,
                render: (value) => <div className="dark:text-green-2 text-green-3">{t('common:success')}</div>
            }
        ];

        return (
            <WrapperTable
                isMobile={isMobile}
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                loading={loading}
                columns={columns}
                scroll={{ x: true }}
                className="border-t border-divider dark:border-divider-dark"
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
    }, [data?.result, loading]);

    return <>{renderTable()}</>;
};

const WrapperTable = styled(TableV2)`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            width: ${(props) => (props.isMobile ? 'max-content' : '100%')};
        }
    }
`;

export default LendingTable;
