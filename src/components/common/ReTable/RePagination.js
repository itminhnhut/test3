// ********* Re-Pagination **********
// Version: M1
// Author:
// Updated: 09/11/2021
// **********************************

import { useEffect } from 'react';

import Pagination from 'rc-pagination';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import styled from 'styled-components';
import colors from 'styles/colors';

import 'rc-pagination/assets/index.css';
import React from 'react';

const RePagination = ({ name, total, current, pageSize, onChange, fromZero, isNamiV2 = false, ...restProps }) => {

  const [currentTheme,] = useDarkMode()

  useEffect(() => {
    name && scrollAfterPageChange(name)
  }, [current, name])

  const Wapper = isNamiV2 ? NamiV2PaginationWrapper : PaginationWrapper

  return (
    <Wapper isDark={currentTheme === THEME_MODE.DARK}>
      <Pagination hideOnSinglePage
        total={total}
        current={current}
        pageSize={pageSize}
        onChange={onChange}
        {...restProps} />
    </Wapper>
  )
}

const scrollAfterPageChange = (id) => {
  const element = document.getElementById(id)
  if (element) window.scrollTo({ top: element.offsetTop, behavior: "smooth" })
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

  .rc-pagination-item a, .rc-pagination-prev button, .rc-pagination-next button {
    color: ${({ isDark }) => isDark ? colors.grey4 : colors.darkBlue};
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

  .rc-pagination-disabled .rc-pagination-item-link, .rc-pagination-disabled:hover .rc-pagination-item-link, .rc-pagination-disabled:focus .rc-pagination-item-link {
    color: ${({ isDark }) => isDark ? colors.grey1 : colors.darkBlue5};
  }

  .rc-pagination-prev:focus .rc-pagination-item-link, .rc-pagination-next:focus .rc-pagination-item-link,
  .rc-pagination-prev:hover .rc-pagination-item-link, .rc-pagination-next:hover .rc-pagination-item-link {
    color: ${colors.teal};
    border-color: ${colors.teal};
  }
`

const NamiV2PaginationWrapper = styled.div`
  .rc-pagination-item-link, .rc-pagination-item {
    height: 36px;
    width: 36px;
    border-radius: 100px;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    margin-right: 16px;
  }

  .rc-pagination-item a {
    color: ${colors?.namiv2?.gray[2]};
  }

  .rc-pagination-item-active {
    background-color: ${colors?.namiv2?.green?.DEFAULT};
  }

  .rc-pagination-item-active a {
    color: white;
  }

  .rc-pagination {
    display: flex;
  }

  .rc-pagination-prev {
    margin-right: 16px !important;
    width: 36px;
  }

  .rc-pagination-next {
    margin-right: 0px !important;
    width: 36px;
  }

  .rc-pagination-options {
    display: none;
  }

  .rc-pagination-prev button, .rc-pagination-next button {
    color: ${colors?.namiv2?.gray[2]};
    background-color: ${colors?.namiv2?.gray?.DEFAULT};
  }

  .rc-pagination-prev button:after, .rc-pagination-next button:after {
    font-size: 24px;
  }

  .rc-pagination-disabled button:after {
    color: #454C5C !important;
  }

  .rc-pagination-jump-next button {
    align-items: end;
    color: #454C5C;
  }
`

export default RePagination


