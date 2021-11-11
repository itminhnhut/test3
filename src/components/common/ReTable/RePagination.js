// ********* Re-Pagination **********
// Version: M1
// Author:
// Updated: 09/11/2021
// **********************************

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

const RePagination = ({ total, current, pageSize, onChange, fromZero, ...restProps }) => {

    return (
        <Pagination hideOnSinglePage
                    total={total}
                    current={current}
                    pageSize={pageSize}
                    onChange={onChange}
                    {...restProps}/>
    )
}

export default RePagination


