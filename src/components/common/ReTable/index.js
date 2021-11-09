// ************ Re-Table ***********
// Version: M1
// Author:
// Updated: 09/11/2021
// Reference: https://table-react-component.vercel.app/
// **********************************

// ### Columns Defs should look like
// [
//     { key: 'coin', dataIndex: 'coin', title: 'Coin', width: 100, fixed: 'left' },
//     { key: 'last_price', dataIndex: 'last_price', title: 'Last Price', width: 100 },
//     { key: 'change_24h', dataIndex: 'change_24h', title: 'Change 24h', width: 100 },
//     { key: 'market_cap', dataIndex: 'market_cap', title: 'Market Cap', width: 100 },
//     { key: 'volume_24h', dataIndex: 'volume_24h', title: 'Volume 24h', width: 100 },
//     { key: '24h_high', dataIndex: '24h_high', title: '24h High', width: 100 },
//     { key: '24h_low', dataIndex: '24h_low', title: '24h Low', width: 100 }
// ]

// ### Data Source should look like
// [
//     { coin: 'BTC/USDT', last_price: 600000, change_24h: 50%, volume_24h: 1000000, 24_high: 65000, 24h_low: 32000 },
//     ...
// ]

// !NOTE:
// 1. Resizable only work with initialized column width
// 2.

// !USAGE: Support display list, sorting, pagination, resize column, custom style, ...
//

import RcTable from 'rc-table'
import styled from 'styled-components'
import colors from 'styles/colors'

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import { useState, memo, useEffect } from 'react'
import { Resizable } from 'react-resizable'
import { castArray } from 'lodash'

import 'rc-table/assets/index.css'
import 'react-resizable/css/styles.css'

const HIDE_SORTER = ['star', 'operation']

const ReTable = memo(({
    data,
    columns,
    loading,
    resizable,
    sort,
    pagination,
    tableStyle,
    useRowHover,
    ...restProps }) => {

    // * Init State
    const [ownColumns, setOwnColumns] = useState(columns)
    const [state, set] = useState({ })

    // * Use Hooks
    const { t } = useTranslation(['common'])
    const [currentTheme, ] = useDarkMode()

    // * Helper
    const setState = state => set(prevState => ({...prevState, ...state}))

    const handleResize = index => (e, { size }) => {
        setOwnColumns(prevState => {
            const nextColumns = [...prevState]
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width
            }
            return nextColumns
        })
    }

    // * Overriding
    const components = {
        header: {
            cell: ResizableTitle,
        },
    }
    const _columns = ownColumns.map((col, index) => ({
        ...col,
        onHeaderCell: (column) =>
            ({
                width: column.width,
                onResize: handleResize(index)
            })
    }))

    // * Side Effect

    // Add Sorter
    useEffect(() => {
        const sortColumn = []
        const className = ['flex', 'items-center']

        if (typeof sort === 'string' || Array.isArray(sort)) {
            columns.forEach(c => {
                let item = c
                if (castArray(sort).includes(c.key)) {
                    if (c.align === 'left') className.push('justify-start')
                    if (c.align === 'right') className.push('justify-end')
                    if (c.align === 'center') className.push('justify-center')

                    item = ({ ...c, title: <div className={className.join(' ')}>{c.title} <Sorter/></div> })
                }
                sortColumn.push(item)
            })
            sortColumn && sortColumn.length && setOwnColumns(sortColumn)
        } else if (sort === 'all' || sort === true) {
            columns.forEach(c => {
                let item = c
                if (!HIDE_SORTER.includes(c.key)) {
                    if (c.align === 'left') className.push('justify-start')
                    if (c.align === 'right') className.push('justify-end')
                    if (c.align === 'center') className.push('justify-center')
                    item = ({ ...c, title: <div className={className.join(' ')}>{c.title} <Sorter/></div> })
                }
                sortColumn.push(item)
            })
            sortColumn && sortColumn.length && setOwnColumns(sortColumn)
        }
    }, [sort, columns])

    return (
        <ReTableWrapper isDark={currentTheme === THEME_MODE.DARK}
                        useRowHover={useRowHover}
                        {...tableStyle}>
            <RcTable data={data}
                     columns={resizable ? _columns : ownColumns}
                     components={components}
                     emptyText={t('common:no_data')}
                     {...restProps}
            />
        </ReTableWrapper>
    )
})

const Sorter = ({ active }) => {
    return (
        <SorterWrapper>
            <CaretUpFilled/>
            <CaretDownFilled/>
        </SorterWrapper>
    )
}

const ResizableTitle = ({ onResize, width, ...restProps }) => {
    if (!width) {
        return <th {...restProps} />
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    )
}

const ReTableWrapper = styled.div`
  
  .rc-table {
    color: ${({ isDark }) => isDark ? colors.grey4 : colors.darkBlue};
    
    .re_table__link {
      font-size: 14px;

      :hover {
        text-decoration: underline !important;
      }
    }
  }
  
  .rc-table-content, .rc-table th, .rc-table td {
    border-color: ${({ isDark }) => isDark ? colors.darkBlue3 : colors.grey4} !important;
    border-right: none;
    border-left: none;
    border-top-width: 0;
  }
  
  .rc-table th {
    color: ${({ isDark }) => isDark ? colors.darkBlue5 : colors.grey1};
    font-weight: 500;
    padding-bottom: 14px;
    
    @media (min-width: 1280px) {
      font-size: 14px;
    }
  }

  .rc-table td {
    font-weight: 500;
    font-size: 14px;
    
    @media (min-width: 1280px) {
      font-size: 16px;
    }
  }
  
  .rc-table thead td, .rc-table thead th,
  .rc-table tbody tr td, .rc-table tbody tr th {
    background: ${({ isDark }) => isDark ? colors.darkBlue2 : colors.white};
  }
  
  .rc-table-content {
    overflow: auto;
  }

  .rc-table-cell-fix-right {
    ::after {
      display: ${({ shadowWithFixedCol }) => shadowWithFixedCol ? 'block' : 'none'};
      box-shadow: ${({ isDark }) => isDark ? 'inset -10px 0 8px -8px #263459' 
                                           : 'inset -10px 0 8px -8px #f2f4f6'} !important;
    }
  }

  .rc-table-cell-fix-right-first, .rc-table-cell-fix-right-last {
    box-shadow: ${({ isDark }) => isDark ? '-1px 0 0 #263459'
            : '-1px 0 0 #f2f4f6'} !important;
  }
  
  .rc-table-cell-fix-left {
    ::after {
      display: ${({ shadowWithFixedCol }) => shadowWithFixedCol ? 'block' : 'none'};
      box-shadow: ${({ isDark }) => isDark ? 'inset 10px 0 8px -8px #263459' : 'inset 10px 0 8px -8px #f2f4f6'} !important;
    }
  }

  table {
    width: 100% !important;
    ${({ tableStyle }) => tableStyle ? {...tableStyle} : ''};
    
    thead tr, tbody tr {
      position: relative;
      cursor: pointer;
    }
    
    tbody tr:last-child {
      td {
        border-bottom-width: 0;
      }
    }
    
    tbody tr:hover td {
      background: ${({ useRowHover, isDark }) => useRowHover ? isDark ? colors.darkBlue3 : colors.lightTeal : undefined};
    }

    thead tr th:first-child, tbody tr td:first-child {
      padding-left: ${({ paddingHorizontal }) => paddingHorizontal ? paddingHorizontal : 0};
    }

    thead tr th:last-child, tbody tr td:last-child {
      padding-right: ${({ paddingHorizontal }) => paddingHorizontal ? paddingHorizontal : 0};
    }
    
    tbody tr td:first-child {
      border-top-left-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
      border-bottom-left-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
    }

    tbody tr td:last-child {
      border-top-right-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
      border-bottom-right-radius: ${({ rowRadius }) => rowRadius ? rowRadius : 0};
    }
    
    thead tr {
      ${({ headerStyle }) => headerStyle ? {...headerStyle} : ''};
      user-select: none;
    }
    
    tbody tr {
      ${({ rowStyle }) => rowStyle ? {...rowStyle} : ''}
      transition: all .2s ease;
      
      :hover {
        box-shadow: 0 7px 23px rgba(0, 0, 0, 0.05);
      }
    }
  }
`

const SorterWrapper = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10px;
  margin-top: -2px;
  
  span:first-child {
    transform: translateY(2px);
  }
  
  span {
    width: 7px;
    height: 7px;
    
    svg {
      width: 100%;
      height: auto;
    }
  }
`

export default ReTable
