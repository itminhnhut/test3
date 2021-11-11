// ********* Re-Pagination **********
// Version: M1
// Author:
// Updated: 09/11/2021
// **********************************

import { useEffect, useState } from 'react'

import Pagination from 'rc-pagination'
import styled from 'styled-components'
import colors from 'styles/colors'

import 'rc-pagination/assets/index.css'

const RePagination = ({ name, total, current, pageSize, onChange, fromZero, ...restProps }) => {

    useEffect(() => {
       name && scrollAfterPageChange(name)
    }, [current, name])

    return (
        <PaginationWrapper>
            <Pagination hideOnSinglePage
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        onChange={onChange}
                        {...restProps}/>
        </PaginationWrapper>
    )
}

const scrollAfterPageChange = (id) => {
    const element = document.getElementById(id)
    if (element) window.scrollTo({ top: element.offsetTop, behavior:"smooth" })
}

const PaginationWrapper = styled.div`
  
  .rc-pagination-item, .rc-pagination-prev button, .rc-pagination-next button {
    border: none;
    background-color: transparent;
    
    a {
      font-family: Barlow, serif !important;
      font-weight: 500 !important;
    }
    
    @media (min-width: 1366px) {
      a {
        font-size: 16px;
      }
    }
  }
  
  .rc-pagination-item-active a, .rc-pagination-item:focus a, .rc-pagination-item:hover a {
    color: ${colors.teal};
  }

  .rc-pagination-jump-prev button:after, .rc-pagination-jump-next button:after {
    content: '...';
  }

  .rc-pagination-next button:after, .rc-pagination-prev button:after {
    margin-top: -0.3rem;
  }

  .rc-pagination-prev .rc-pagination-item-link, .rc-pagination-next .rc-pagination-item-link {
    font-size: 28px;
  }
`

export default RePagination


