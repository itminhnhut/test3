import React, { useState } from 'react';
import TabV2 from '../../common/V2/TabV2';
import Link from 'next/link';
import { TransactionTabs } from './constant';
import { useRouter } from 'next/router';
import TransactionFilter from './TransactionFilter';
import TableV2 from 'components/common/V2/TableV2';

const columns = [
    {
        key: 'code',
        dataIndex: 'code',
        title: 'Nami ID',
        align: 'left',
        fixed: 'left',
        width: 180,
        render: (data, item) => <div>hahahahaha</div>
    }
];

const TransactionHistory = ({ id }) => {
    const router = useRouter();
    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });

    return (
        <div className="min-h-[500px] max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl">
            <div className="mt-20 mb-[120px]">
                <div className="text-[32px] lead-[1.19] font-semibold mb-12">Lịch sử giao dịch</div>
                <div className="flex mb-8">
                    <TabV2
                        // isOverflow
                        activeTabKey={id}
                        onChangeTab={(key) => {
                            const clickedTab = TransactionTabs.find((tab) => tab.key === key);
                            if (clickedTab) {
                                router.push(clickedTab.href);
                            }
                        }}
                        tabs={TransactionTabs.map((tab) => ({
                            key: tab.key,
                            children: <div className="capitalize">{tab.localized}</div>
                        }))}
                    />
                </div>
                <div className="mb-12">
                    <TransactionFilter filter={filter} setFilter={setFilter} />
                </div>
                <div>
                    <TableV2
                        sort
                        defaultSort={{ key: 'code', direction: 'desc' }}
                        useRowHover
                        data={[]}
                        page={1}
                        onChangePage={(page) => console.log('page:', page)}
                        total={100}
                        columns={columns}
                        rowKey={(item) => item?.key}
                        scroll={{ x: true }}
                        
                        // isSearch={!!state.search}
                        height={404}
                        pagingClassName="border-none"
                        className="border rounded-lg border-divider dark:border-divider-dark pt-4 mt-8"
                        tableStyle={{ fontSize: '16px', padding: '16px' }}
                       
                        pagingPrevNext={{ page: 1, hasNext: false, onChangeNextPrev: () => {}, language: 'en' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
