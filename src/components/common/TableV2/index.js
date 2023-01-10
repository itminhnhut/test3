import React from 'react';
import DataTable from 'react-data-table-component';

const index = () => {
    return (
        <DataTable
            data={filteredOrders}
            columns={columns}
            className="h-full"
            customStyles={customStyles}
            noHeader
            fixedHeader
            fixedHeaderScrollHeight={`${props.orderListWrapperHeight - 100}px`}
            dense
            pagination
            paginationPerPage={30}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
            noDataComponent={<TableNoData bgColor={darkMode ? 'bg-dark-2' : '#FFFFFF'} />}
            progressPending={loading}
            progressComponent={<TableLoader height={props.height} />}
        />
    );
};

export default index;
