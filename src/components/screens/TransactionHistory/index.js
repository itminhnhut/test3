import React from 'react';
import TabV2 from '../../common/V2/TabV2';
import Link from 'next/link';
import { TransactionTabs } from './constant';
import { useRouter } from 'next/router';
import TransactionFilter from './TransactionFilter';

const TransactionHistory = ({ id }) => {
    const router = useRouter();
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

                <TransactionFilter />
            </div>
        </div>
    );
};

export default TransactionHistory;
