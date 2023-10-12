import React, { useMemo } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatTime } from 'redux/actions/utils';

const OrderLogsPending = ({ orderDetail, decimals }) => {
    const { t } = useTranslation();

    const getTypeLabel = (key) => {
        switch (key) {
            case 'MODIFY_MARGIN':
                return t('futures:mobile:adjust_margin:adjust_position_margin');
            case 'REMOVE_MARGIN_FUNDING_FEE':
                return t('futures:mobile:adjust_margin:remove_margin_funding');
            case 'MODIFY':
                return t('futures:tp_sl:modify_tpsl');
            case 'ADD_VOLUME':
                return t('futures:mobile:adjust_margin:added_volume');
            case 'PARTIAL_CLOSE':
                return t('futures:mobile:adjust_margin:close_partially');

            default:
                return null;
        }
    };

    const formatModify = (item, key) => {
        return {
            before: item?.metadata?.[key]?.before,
            after: item?.metadata?.[key]?.after
        };
    };

    const dataTable = useMemo(() => {
        const dataFilter = orderDetail?.futuresorderlogs.map((item) => {
            return {
                type_modify: getTypeLabel(item?.type),
                time: formatTime(item?.createdAt, 'HH:mm:ss dd/MM/yyyy'),
                sl: formatModify(item, 'modify_sl'),
                tp: formatModify(item, 'modify_tp')
            };
        });
        return dataFilter;
    }, [orderDetail]);

    const getValue = (number, decimal = 0) => {
        if (number) {
            return formatNumber(number, decimal, 0, true);
        } else {
            return '_';
        }
    };

    const columns = [
        {
            dataIndex: 'type_modify',
            title: t('futures:mobile:adjust_margin:adjustment_type')
        },
        {
            dataIndex: 'time',
            title: t('common:time')
        },
        {
            dataIndex: 'sl',
            title: <span>{t('futures:stop_loss')}</span>,
            render: (row) => (
                <span className="text-red">{row?.after ? getValue(row?.before, decimals.symbol) + ' > ' + getValue(row?.after, decimals.symbol) : '_'}</span>
            )
        },
        {
            dataIndex: 'tp',
            title: <span>{t('futures:take_profit')}</span>,
            render: (row) => (
                <span className="text-teal">{row?.after ? getValue(row?.before, decimals.symbol) + ' > ' + getValue(row?.after, decimals.symbol) : '_'}</span>
            )
        }
    ];

    return (
        <TableV2
            useRowHover
            data={dataTable}
            columns={columns}
            rowKey={(item) => `${item?.key}`}
            limit={10}
            skip={0}
            tableStyle={{ padding: '12px 16px' }}
            noBorder={true}
            pagingClassName="border-none"
            className="border border-divider dark:border-divider-dark rounded-xl"
        />
    );
};

export default OrderLogsPending;
