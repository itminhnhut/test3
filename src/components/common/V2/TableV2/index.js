import React, { useMemo, useRef, useState } from 'react';
import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import RePagination from 'src/components/common/ReTable/RePagination';
import NoData from './NoData';
import sumBy from 'lodash/sumBy';

const index = ({ data, columns, loading, limit = 10, skip = 0, onChangePage, useRowHover = true, height = 575, rowKey, ...props }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ref = useRef();

    const _onChangePage = (page) => {
        setCurrentPage(page);
        if (onChangePage) onChangePage(page);
    };

    const _columns = useMemo(() => {
        const isAdd = !columns.find((rs) => rs.fixed) && ref.current?.offsetWidth < sumBy(columns, 'width');
        return !isAdd ? columns : columns.concat([{ fixed: 'right', width: 0 }]);
    }, [columns, ref.current]);

    return (
        <>
            <ReTable
                reference={ref}
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
                <div className="pt-8 pb-10 flex items-center justify-center dark:bg-bgSpotContainer-dark border-t dark:border-divider-dark">
                    <RePagination total={data.length} isNamiV2 current={currentPage} pageSize={limit} onChange={_onChangePage} name="market_table___list" />
                </div>
            )}
        </>
    );
};

export default index;
