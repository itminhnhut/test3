import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import NoData from './NoData';
import sumBy from 'lodash/sumBy';

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
        return !isAdd ? filterdData : filterdData.concat([{ fixed: 'right', width: 0 }]);
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
                onRowClick={onRowClick}
                {...props}
            />
            {!pagingPrevNext ? (
                total > 0 ||
                (data.length > 0 && (
                    <div className={`pt-8 pb-10 flex items-center justify-center border-t dark:border-divider-dark ${pagingClassName}`}>
                        <RePagination
                            total={total ?? data.length}
                            isNamiV2
                            current={currentPage}
                            pageSize={limit}
                            onChange={_onChangePage}
                            name="market_table___list"
                            // pagingPrevNext={pagingPrevNext}
                        />
                    </div>
                ))
            ) : (
                <div className={`pt-8 pb-8 flex items-center justify-center border-t dark:border-divider-dark ${pagingClassName}`}>
                    <RePagination
                        total={total ?? data.length}
                        isNamiV2
                        current={currentPage}
                        pageSize={limit}
                        name="market_table___list"
                        pagingPrevNext={pagingPrevNext}
                    />
                </div>
            )}
        </div>
    );
};

export default index;
