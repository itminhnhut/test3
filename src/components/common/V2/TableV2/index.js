import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import RePagination from 'src/components/common/ReTable/RePagination';
import NoData from './NoData';
import sumBy from 'lodash/sumBy';

const index = ({
    data,
    columns,
    loading,
    limit = 10,
    skip = 0,
    onChangePage,
    page,
    useRowHover = true,
    height = 575,
    rowKey,
    className = '',
    pagingClassName = '',
    isSearch,
    total,
    pagingPrevNext,
    ...props
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ref = useRef();

    useEffect(() => {
        if (page) setCurrentPage(page);
    }, [page]);

    const _onChangePage = (page) => {
        setCurrentPage(page);
        if (onChangePage) onChangePage(page);
    };

    const _columns = useMemo(() => {
        const isAdd = !columns.find((rs) => rs.fixed) && ref.current?.offsetWidth < sumBy(columns, 'width');
        return !isAdd ? columns : columns.concat([{ fixed: 'right', width: 0 }]);
    }, [columns, ref.current]);

    return (
        <div className={className}>
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
                emptyText={<NoData loading={loading} isSearch={!!isSearch} className="" />}
                {...props}
            />
            {total > 0 ||
                (data.length > 0 && (
                    <div className={`pt-8 pb-10 flex items-center justify-center border-t dark:border-divider-dark ${pagingClassName}`}>
                        <RePagination
                            total={total ?? data.length}
                            isNamiV2
                            current={currentPage}
                            pageSize={limit}
                            onChange={_onChangePage}
                            name="market_table___list"
                            pagingPrevNext={pagingPrevNext}
                        />
                    </div>
                ))}
        </div>
    );
};

export default index;
