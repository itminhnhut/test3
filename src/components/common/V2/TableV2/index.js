import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import NoData from './NoData';
import sumBy from 'lodash/sumBy';
import Skeletor from 'components/common/Skeletor';

const index = ({
    data,
    columns,
    loading,
    limit = 10,
    onChangePage,
    page = 1,
    useRowHover = true,
    height = 575,
    rowKey,
    className = '',
    pagingClassName = '',
    isSearch,
    total,
    pagingPrevNext,
    onRowClick,
    showPaging = true,
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
        const filterdData = columns.filter((child) => child?.visible === true || child?.visible === undefined);
        const isAdd = !filterdData.find((rs) => rs.fixed) && ref.current?.offsetWidth < sumBy(filterdData, 'width');
        const cols = !isAdd ? filterdData : filterdData.concat([{ fixed: 'right', width: 0 }]);
        return loading
            ? columns.map((column) => ({
                ...column,
                render: () => <Skeletor width={100} height={20} />
            }))
            : cols;
    }, [columns, ref.current, loading]);

    const totalPage = useMemo(() => {
        return Math.ceil(total ?? data?.length / limit);
    }, [total, data]);

    const loader = useMemo(() => {
        const arr = [];
        for (let i = 1; i <= limit; i++) {
            arr.push(i);
        }
        return arr;
    }, [limit]);

    return (
        <div className={className}>
            <ReTable
                reference={ref}
                useRowHover={useRowHover}
                data={loading ? loader : data}
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
                onRowClick={onRowClick}
                {...props}
            />
            {(pagingPrevNext || (totalPage > 1 && limit > 0)) && showPaging && (
                <div className={`pt-8 pb-10 flex items-center justify-center border-t dark:border-divider-dark ${pagingClassName}`}>
                    <RePagination
                        total={total ?? data?.length}
                        isNamiV2
                        current={currentPage}
                        pageSize={limit}
                        name="market_table___list"
                        pagingPrevNext={pagingPrevNext}
                        onChange={_onChangePage}
                    />
                </div>
            )}
        </div>
    );
};

export default index;
