import React, {memo, useCallback} from "react";
import {
    ComponentDescription,
    ComponentTabItem,
    ComponentTableWrapper,
    ComponentTabWrapper,
    ComponentTitle, Pagination, ReferralNote,
    SortIcon
} from "../styledReference";
import { formatNumber, formatTime, getTokenIcon, currencyToText } from "../../../utils/reference-utils"

import RcTable from "rc-table";
import { useTranslation } from "next-i18next";
import {ScaleLoader} from "react-spinners";
import useApp from "../../../hooks/useApp";
import NeedLogin from "../../../components/common/NeedLogin";

const COMMISSION_SVG = <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.9531 40.0781C16.2247 40.0781 19.6875 36.6153 19.6875 32.3438C19.6875 28.0722 16.2247 24.6094 11.9531 24.6094C7.68155 24.6094 4.21875 28.0722 4.21875 32.3438C4.21875 36.6153 7.68155 40.0781 11.9531 40.0781Z" fill="#00B6C7"/>
    <path d="M30.9375 9.14062C23.5709 9.14062 17.5781 15.1334 17.5781 22.5C17.5781 23.0407 17.6168 23.5912 17.6892 24.1467L20.4919 28.0005C20.8877 28.5448 21.1472 29.1755 21.2498 29.8406L21.5817 31.9985C24.0757 34.4559 27.4247 35.8594 30.9375 35.8594C38.3041 35.8594 44.2969 29.8666 44.2969 22.5C44.2969 15.1334 38.3041 9.14062 30.9375 9.14062ZM30.9375 32.3438C25.5009 32.3438 21.0937 27.9366 21.0937 22.5C21.0937 17.0634 25.5009 12.6562 30.9375 12.6562C36.3741 12.6562 40.7812 17.0634 40.7812 22.5C40.7812 27.9366 36.3741 32.3438 30.9375 32.3438Z" fill="#00B6C7"/>
    <path d="M15.4688 37.2656V34.4531C15.4688 32.902 14.2073 31.6406 12.6562 31.6406H11.25C10.4745 31.6406 9.84375 31.0099 9.84375 30.2344V28.8281H12.6562C13.4318 28.8281 14.0625 29.4588 14.0625 30.2344H15.4688C15.4688 28.6833 14.2073 27.4219 12.6562 27.4219V26.0156H11.25V27.4219H8.4375V30.2344C8.4375 31.7855 9.69891 33.0469 11.25 33.0469H12.6562C13.4318 33.0469 14.0625 33.6776 14.0625 34.4531V35.8594H11.25C10.4745 35.8594 9.84375 35.2287 9.84375 34.4531H8.4375C8.4375 36.0042 9.69891 37.2656 11.25 37.2656V38.6719H12.6562V37.2656H15.4688Z" fill="black"/>
    <path d="M30.034 24.3984C30.3089 24.5299 30.6127 24.6094 30.9375 24.6094C31.2624 24.6094 31.5661 24.5299 31.8411 24.3977L33.2529 25.8096L34.2471 24.8154L32.8353 23.4035C32.9675 23.1286 33.0469 22.8248 33.0469 22.5C33.0469 21.337 32.1005 20.3906 30.9375 20.3906C29.7746 20.3906 28.8282 21.337 28.8282 22.5C28.8282 22.8248 28.9083 23.1286 29.0398 23.4042L26.9248 25.5185L27.919 26.5127L30.034 24.3984ZM30.9375 21.7969C31.325 21.7969 31.6407 22.1119 31.6407 22.5C31.6407 22.8881 31.325 23.2031 30.9375 23.2031C30.5501 23.2031 30.2344 22.8881 30.2344 22.5C30.2344 22.1119 30.5501 21.7969 30.9375 21.7969Z" fill="black"/>
    <path d="M21.0601 27.5864L16.6044 21.4594C17.188 21.0839 17.5783 20.4321 17.5783 19.6875C17.5783 18.9591 17.207 18.3164 16.6445 17.9374L18.4881 15.6333C18.808 15.2325 18.9845 14.7298 18.9845 14.2179C18.9845 12.9684 17.9685 11.9531 16.7197 11.9531H14.5942C14.2743 11.1755 13.5325 10.6235 12.6564 10.5623V9.14062V8.4375V6.32812H16.172C18.8861 6.32812 21.0939 4.11961 21.0939 1.40625V0.703125H16.172C13.6562 0.703125 11.5778 2.60227 11.2881 5.04141C10.3916 4.10344 9.13162 3.51562 7.73451 3.51562H2.81264V4.21875C2.81264 6.93211 5.02045 9.14062 7.73451 9.14062H11.2501V10.5469H7.18678C5.93803 10.5469 4.92201 11.5622 4.92201 12.8116V12.9445C4.92201 13.3383 5.02467 13.7264 5.22014 14.0681L7.39068 17.8671C6.75928 18.232 6.32826 18.907 6.32826 19.6875C6.32826 20.4321 6.7185 21.0839 7.30209 21.4594L2.84568 27.5864C2.38654 28.2178 2.08068 28.961 1.96186 29.733L0.677246 38.0827L0.77709 38.283C0.900137 38.5291 3.87717 44.2969 11.9533 44.2969C20.0294 44.2969 23.0064 38.5291 23.1294 38.283L23.2293 38.0827L21.9447 29.733C21.8258 28.961 21.52 28.2185 21.0601 27.5864ZM16.172 2.10938H19.6166C19.2904 3.7118 17.8701 4.92188 16.172 4.92188H12.7274C13.0537 3.31945 14.474 2.10938 16.172 2.10938ZM7.73451 7.73438C6.03647 7.73438 4.61615 6.5243 4.2899 4.92188H7.73451C9.43256 4.92188 10.8529 6.13195 11.1791 7.73438H7.73451ZM8.43764 20.3906C8.05022 20.3906 7.73451 20.0756 7.73451 19.6875C7.73451 19.2994 8.05022 18.9844 8.43764 18.9844H15.4689C15.8563 18.9844 16.172 19.2994 16.172 19.6875C16.172 20.0756 15.8563 20.3906 15.4689 20.3906H8.43764ZM6.32826 12.9445V12.8116C6.32826 12.3384 6.71357 11.9531 7.18678 11.9531H12.5017C12.9742 11.9531 13.3595 12.3384 13.3595 12.8116V14.7656H14.7658V13.3594H16.7197C17.193 13.3594 17.5783 13.7447 17.5783 14.2179C17.5783 14.412 17.5115 14.6025 17.3898 14.7544L15.1307 17.5781H8.84545L6.44076 13.3706C6.36764 13.2413 6.32826 13.0936 6.32826 12.9445ZM11.9533 42.8906C5.46272 42.8906 2.68959 38.7837 2.13764 37.8394L3.35193 29.9468C3.43701 29.3948 3.65498 28.8647 3.98334 28.4126L8.79553 21.7969H15.111L19.9225 28.4133C20.2508 28.8654 20.4695 29.3948 20.5539 29.9475L21.7682 37.8394C21.2148 38.7872 18.441 42.8906 11.9533 42.8906Z" fill="black"/>
    <path d="M41.4844 22.5C41.4844 16.6845 36.753 11.9531 30.9375 11.9531C25.122 11.9531 20.3906 16.6845 20.3906 22.5C20.3906 28.3155 25.122 33.0469 30.9375 33.0469C36.753 33.0469 41.4844 28.3155 41.4844 22.5ZM25.9657 26.4776L24.0033 28.4393C22.7749 27.0077 21.9846 25.1944 21.832 23.2031H24.6094V21.7969H21.8327C21.9853 19.8049 22.7756 17.9923 24.004 16.5607L25.9664 18.5224L26.9606 17.5282L24.9982 15.5665C26.4298 14.3381 28.2431 13.5478 30.2344 13.3952V16.1719H31.6406V13.3952C33.6326 13.5478 35.4452 14.3381 36.8768 15.5665L34.9144 17.5282L35.9086 18.5224L37.871 16.5607C39.0994 17.9923 39.8897 19.8056 40.0423 21.7969H37.2656V23.2031H40.0423C39.8897 25.1951 39.0994 27.0077 37.871 28.4393L35.9086 26.4776L34.9144 27.4718L36.8768 29.4335C35.4452 30.6619 33.6319 31.4522 31.6406 31.6048V28.8281H30.2344V31.6048C28.2424 31.4522 26.4298 30.6619 24.9982 29.4335L26.9606 27.4718L25.9657 26.4776Z" fill="black"/>
    <path d="M42.1874 33.75C41.0245 33.75 40.078 34.6964 40.078 35.8594C40.078 36.116 40.1308 36.3586 40.2152 36.5864C37.4603 38.4082 34.2773 39.375 30.9374 39.375C28.8421 39.375 26.7981 38.996 24.8624 38.2486L24.3555 39.5599C26.4543 40.3706 28.6684 40.7812 30.9374 40.7812C34.6091 40.7812 38.1058 39.6998 41.1208 37.6685C41.4351 37.8548 41.7965 37.9688 42.1874 37.9688C43.3504 37.9688 44.2968 37.0223 44.2968 35.8594C44.2968 34.6964 43.3504 33.75 42.1874 33.75ZM42.1874 36.5625C41.8 36.5625 41.4843 36.2475 41.4843 35.8594C41.4843 35.4713 41.8 35.1562 42.1874 35.1562C42.5748 35.1562 42.8905 35.4713 42.8905 35.8594C42.8905 36.2475 42.5748 36.5625 42.1874 36.5625Z" fill="black"/>
    <path d="M21.0938 5.625C19.9308 5.625 18.9844 6.57141 18.9844 7.73438C18.9844 8.89734 19.9308 9.84375 21.0938 9.84375C22.2567 9.84375 23.2031 8.89734 23.2031 7.73438C23.2031 7.66055 23.1891 7.59023 23.1813 7.51852C25.5635 6.28313 28.2347 5.625 30.9375 5.625C35.562 5.625 39.877 7.45875 43.0882 10.7902L44.1 9.81352C40.6216 6.20578 35.9473 4.21875 30.9375 4.21875C28.0294 4.21875 25.1543 4.92258 22.5851 6.24445C22.2033 5.86195 21.6759 5.625 21.0938 5.625ZM21.0938 8.4375C20.7063 8.4375 20.3906 8.1225 20.3906 7.73438C20.3906 7.34625 20.7063 7.03125 21.0938 7.03125C21.4812 7.03125 21.7969 7.34625 21.7969 7.73438C21.7969 8.1225 21.4812 8.4375 21.0938 8.4375Z" fill="black"/>
</svg>

const SORT_SVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="css-1iztezc">
    <path opacity="0.5" d="M9 10.153V8.5L12.25 5l3.25 3.501v1.652H9z"
          fill="#848E9C"></path>
    <path d="M15.5 13.257v1.652l-3.25 3.5L9 14.91v-1.652h6.5z"
          fill="url(#sorting-down-color-s24_svg__paint0_linear)"></path>
    <defs>
        <linearGradient id="sorting-down-color-s24_svg__paint0_linear" x1="9"
                        y1="18.41" x2="15.5" y2="18.41"
                        gradientUnits="userSpaceOnUse">
            <stop stopColor="#00B6C7"></stop>
            <stop offset="1" stopColor="#00B6C7"></stop>
        </linearGradient>
    </defs>
</svg>

const ReferralCommission = memo((props) => {
    const {width, typeSort, setTypeSort, commission, pageSize, page, setPage, data, user} = props;
    const isApp = useApp()

    const { t } = useTranslation('reference')

    const renderTypeSelect = useCallback(() => {
        const {commissionHistory} = typeSort || {};

        return (
            <ComponentTabWrapper>
                {/*<ComponentTabItem active={commissionHistory === 1} onClick={() => setTypeSort({...typeSort, commissionHistory: 1})}>*/}
                {/*    <Translate id='referral_pages.time_sort.all'/>*/}
                {/*</ComponentTabItem>*/}
                <ComponentTabItem active={commissionHistory === 2} onClick={() => {
                    setTypeSort({...typeSort, commissionHistory: 2})
                    setPage(0)
                }}>
                    Exchange
                </ComponentTabItem>
                <ComponentTabItem active={commissionHistory === 3} onClick={() => {
                    setTypeSort({...typeSort, commissionHistory: 3})
                    setPage(0)
                }}>
                    Futures
                </ComponentTabItem>
            </ComponentTabWrapper>
        )
    }, [typeSort])

    const renderPageControl = useCallback(() => {
        if (!data) return null
        let isEnd = false;
        let isBegin = false;
        // let convertedSize = pageSize;
        if (data.length === 0) isEnd = true;
        if (page === 0) isBegin = true;
        // let totalPage = Math.ceil(data.length / convertedSize);

        return (
            <Pagination>
                <span className={isBegin && 'disabled'}
                      onClick={() => setPage(prevState => prevState - 1)}>
                    <i className='ci-short_left'/>
                </span>
                <div>
                    {t('global_pagination.pages')} {" "}
                    <b>{page+1}</b>{" "}
                    {/*<Translate id='global_pagination.of'/>{" "}*/}
                    {/*{page+2}*/}
                </div>
                <span className={isEnd && 'disabled'}
                      onClick={() => setPage(prevState => prevState + 1)}>
                    <i className='ci-short_right'/>
                </span>
            </Pagination>
        )
    }, [data, pageSize, page, setPage])

    const renderExchangeMode = useCallback(() => {
        if (!data) return <ScaleLoader size={2} color='#03BBCC'/>
        const tableData = []

        const columns = [
            {
                title: t('referral_pages.table.friends_id'),
                dataIndex: 'code',
                key: 'code',
                width: 'fit-content',
            },
            {
                title: <div>{t('referral_pages.table.friends_username')}
                           {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                       </div>,
                dataIndex: 'name',
                key: 'name',
                width: 'auto',
            },
            {
                title: t('referral_pages.table.commission_earned'),
                dataIndex: 'earned',
                key:  'earned',
                width: 'auto',
            },
            {
                title: <div>{t('referral_pages.table.commission_time')}
                        {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                        </div>,
                dataIndex: 'created_at',
                key: 'created_at',
                width: 'auto'
            }
        ]

        data.map(commission => {
            const code = (commission.hasOwnProperty('code') && commission.code) || '---'
            const name = (commission.hasOwnProperty('name') && commission.name) || '---'
            const created_at = (commission.hasOwnProperty('created_at') && commission.created_at) || null
            const metadata = (commission.hasOwnProperty('metadata') && commission.metadata) || {}
            tableData.push({code, name, created_at: formatTime(created_at, 'HH:mm DD/MM/YYYY'),
                earned: `${formatNumber(+Object.values(metadata)[0], 6)} ${currencyToText(+Object.keys(metadata)[0])}`})
        })

        return <RcTable columns={columns} data={tableData}/>
    }, [data, typeSort])

    const renderFuturesMode = useCallback(() => {
        if (!data) return <ScaleLoader size={2} color='#03BBCC'/>
        const tableData = []

        const columns = [
            {
                title: t('referral_pages.table.volume'),
                dataIndex: 'volume',
                key: 'volume',
                width: 'fit-content',
            },
            {
                title: <div>{t('referral_pages.table.order_count')}
                    {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                </div>,
                dataIndex: 'order_count',
                key: 'order_count',
                width: 'auto',
            },
            {
                title: t('referral_pages.table.commission_earned'),
                dataIndex: 'earned',
                key:  'earned',
                width: 'auto',
            },
            {
                title: <div>{t('referral_pages.table.commission_time')}
                    {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                </div>,
                dataIndex: 'log_time',
                key: 'log_time',
                width: 'auto'
            }
        ]

        // gain: {1: 204.8208128823167}
        // log_time: "2020-03-24T14:00:00.000Z"
        // volume_v2: {72: 138103734.9}

        data.map(commission => {
            const volume = (commission.hasOwnProperty('volume_v2') && commission.volume_v2) || {}
            const gain = (commission.hasOwnProperty('gain') && commission.gain) || {}
            const log_time = (commission.hasOwnProperty('log_time') && commission.log_time) || null
            const order_count_v2 = (commission.hasOwnProperty('order_count_v2') && commission.order_count_v2) || {}

            tableData.push({
                volume: `${formatNumber(+Object.values(volume)[0], 6)} ${currencyToText(+Object.keys(volume)[0])}`,
                earned: `${formatNumber(+Object.values(gain)[0], 6)} ${currencyToText(+Object.keys(gain)[0])}`,
                log_time: formatTime(log_time, 'HH:mm DD/MM/YYYY'),
                order_count: `${!isNaN(+Object.values(order_count_v2)[0]) ? +Object.values(order_count_v2)[0] : '---'} (${currencyToText(+Object.keys(order_count_v2)[0])} Futures)`
            })
        })

        return <RcTable columns={columns} data={tableData}/>
    }, [data, typeSort])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: COMMISSION!!! ', data)
    // }, [data])

    return (
        <>
            <ComponentTitle>
                {COMMISSION_SVG}
                <div>{t('referral_pages.categories.commission_history')}</div>
            </ComponentTitle>
            {renderTypeSelect()}
            <ComponentDescription>
                <div>
                   * {t('referral_pages.addition_info.commission')}
                </div>
                <div style={{visibility: 'hidden'}}>
                    {width >= 768 &&
                    <>
                            <span>
                                {props.ExportSvg}
                            </span>{t('referral_pages.utils.export_commission_history')}
                    </>
                    }
                </div>
            </ComponentDescription>
            <ComponentTableWrapper>
                {user ?
                    <>
                        {typeSort.commissionHistory === 2 ? renderExchangeMode() : renderFuturesMode()}
                    </>
                    : <div style={width <= 1200 ? {fontSize: 16, fontWeight: 600} : {fontSize: 18, fontWeight: 600}}>
                        <NeedLogin>
                            <a href='javascript:void(0)' onClick={() => handleLogin(isApp)}>
                                {t('user.login_to_view')}
                            </a>
                        </NeedLogin>
                    </div>
                }
            </ComponentTableWrapper>
            {renderPageControl()}
        </>
    )
})

export default ReferralCommission;
