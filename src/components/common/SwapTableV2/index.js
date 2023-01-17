import React, { useMemo, useState } from 'react';
import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import RePagination from 'src/components/common/ReTable/RePagination';
import NoData from './NoData';

const index = ({ data, columns, loading, limit = 10, skip = 0, onChangePage, useRowHover = true, height = 575, rowKey, ...props }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const _onChangePage = (page) => {
        setCurrentPage(page);
        if (onChangePage) onChangePage(page);
    };

    const _columns = useMemo(() => {
        const checked = columns.find((rs) => rs.fixed);
        return checked ? columns : columns.concat([{ fixed: 'right', width: 0 }]);
    }, [columns]);

    if (!data || data.length === 0) {
        return (
            <div className="mt-[60px] pb-[46px]">
                <NoData loading={loading} />
            </div>
        );
    }

    return (
        <div className="mt-8 pb-4 border border-divider-dark dark:border-divider-dark rounded-xl">
            <ReTable
                useRowHover={useRowHover}
                data={data}
                columns={_columns}
                scroll={{ x: true }}
                rowKey={(item, idx) => `row_${idx}`}
                paginationProps={{
                    hide: true,
                    current: currentPage,
                    pageSize: limit,
                    onChange: (currentPage) => setCurrentPage(currentPage)
                }}
                isNamiV2
                height={height}
                loading={loading}
                emptyText={<NoData loading={loading} />}
                {...props}
            />
            {data.length > 0 && (
                <div className="pt-8 flex items-center justify-center dark:bg-bgSpotContainer-dark">
                    <RePagination total={data.length} isNamiV2 current={currentPage} pageSize={limit} onChange={_onChangePage} name="market_table___list" />
                </div>
            )}
        </div>
    );
};

export default index;
