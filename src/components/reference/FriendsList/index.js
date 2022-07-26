import React, { memo, useCallback } from "react";
import {
    ComponentDescription, ComponentTabItem,
    ComponentTableWrapper, ComponentTabWrapper,
    ComponentTitle, Pagination
} from "../styledReference";
import { ScaleLoader } from "react-spinners";
import NeedLogin from "../../../components/common/NeedLogin";
import useApp from "../../../hooks/useApp";
import { sortBy } from 'lodash'
import RcTable from 'rc-table'
import { formatNumber, formatTime, getTokenIcon, currencyToText } from "../../../utils/reference-utils"
import { useTranslation } from "next-i18next";

const FRIENDSLIST_SVG = <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.9678 15.9677C20.3771 15.9677 23.9516 12.3932 23.9516 7.98387C23.9516 3.5745 20.3771 0 15.9678 0C11.5584 0 7.98389 3.5745 7.98389 7.98387C7.98389 12.3932 11.5584 15.9677 15.9678 15.9677Z" fill="#00B6C7" />
    <path d="M15.2419 5.80642H16.6935C17.0941 5.80642 17.4193 6.13159 17.4193 6.53223H18.8709C18.8709 5.33175 17.894 4.35481 16.6935 4.35481V2.9032H15.2419V4.35481C14.0414 4.35481 13.0645 5.33175 13.0645 6.53223C13.0645 7.73271 14.0414 8.70965 15.2419 8.70965H16.6935C17.0941 8.70965 17.4193 9.03481 17.4193 9.43546C17.4193 9.8361 17.0941 10.1613 16.6935 10.1613H15.2419C14.8412 10.1613 14.5161 9.8361 14.5161 9.43546H13.0645C13.0645 10.6359 14.0414 11.6129 15.2419 11.6129V13.0645H16.6935V11.6129C17.894 11.6129 18.8709 10.6359 18.8709 9.43546C18.8709 8.23497 17.894 7.25804 16.6935 7.25804H15.2419C14.8412 7.25804 14.5161 6.93288 14.5161 6.53223C14.5161 6.13159 14.8412 5.80642 15.2419 5.80642Z" fill="black" />
    <path d="M28.3063 5.80642H29.7579C30.1586 5.80642 30.4837 6.13159 30.4837 6.53223H31.9354C31.9354 5.33175 30.9584 4.35481 29.7579 4.35481V2.9032H28.3063V4.35481C27.1058 4.35481 26.1289 5.33175 26.1289 6.53223C26.1289 7.73271 27.1058 8.70965 28.3063 8.70965H29.7579C30.1586 8.70965 30.4837 9.03481 30.4837 9.43546C30.4837 9.8361 30.1586 10.1613 29.7579 10.1613H28.3063C27.9057 10.1613 27.5805 9.8361 27.5805 9.43546H26.1289C26.1289 10.6359 27.1058 11.6129 28.3063 11.6129V13.0645H29.7579V11.6129C30.9584 11.6129 31.9354 10.6359 31.9354 9.43546C31.9354 8.23497 30.9584 7.25804 29.7579 7.25804H28.3063C27.9057 7.25804 27.5805 6.93288 27.5805 6.53223C27.5805 6.13159 27.9057 5.80642 28.3063 5.80642Z" fill="black" />
    <path d="M35.5647 14.5161H33.6093C33.6246 14.506 33.6398 14.4973 33.6543 14.4864L32.8124 13.304C31.699 14.0973 30.3918 14.5161 29.0324 14.5161C26.6169 14.5161 24.462 13.2082 23.3138 11.0961C23.7318 10.117 23.9518 9.0646 23.9518 7.98387C23.9518 6.87774 23.7253 5.8246 23.3167 4.86581C24.4656 2.75734 26.6191 1.45161 29.0324 1.45161C32.6346 1.45161 35.5647 4.38169 35.5647 7.98387C35.5647 9.34331 35.1459 10.6505 34.3526 11.7639L35.5349 12.6058C36.5038 11.2449 37.0163 9.64669 37.0163 7.98387C37.0163 3.58185 33.4344 0 29.0324 0C26.3818 0 23.9822 1.28468 22.503 3.41202C21.058 1.35218 18.6693 0 15.9679 0C11.5659 0 7.98401 3.58185 7.98401 7.98387C7.98401 10.6839 9.33474 13.0703 11.3917 14.5161H9.43563C6.63474 14.5161 4.35498 16.7959 4.35498 19.5968V30.4839C4.35498 32.085 5.65708 33.3871 7.25821 33.3871C7.7895 33.3871 8.28087 33.2332 8.70982 32.9836V41.0081C8.70982 43.2087 10.5011 45 12.7018 45C14.0518 45 15.245 44.3243 15.9679 43.2958C16.6908 44.3243 17.884 45 19.234 45C20.584 45 21.7772 44.3243 22.5001 43.2958C23.223 44.3243 24.4163 45 25.7663 45C27.1163 45 28.3095 44.3243 29.0324 43.2958C29.7553 44.3243 30.9485 45 32.2985 45C34.4992 45 36.2905 43.2087 36.2905 41.0081V32.9836C36.7194 33.2332 37.2108 33.3871 37.7421 33.3871C39.3432 33.3871 40.6453 32.085 40.6453 30.4839V19.5968C40.6453 16.7959 38.3655 14.5161 35.5647 14.5161ZM9.43563 7.98387C9.43563 4.38169 12.3657 1.45161 15.9679 1.45161C19.5701 1.45161 22.5001 4.38169 22.5001 7.98387C22.5001 9.34331 22.0814 10.6505 21.288 11.7639L22.4704 12.6058C22.482 12.5891 22.4922 12.5717 22.503 12.5557C23.043 13.3323 23.7093 13.987 24.4627 14.5161H22.5001H20.5448C20.5601 14.506 20.5753 14.4973 20.5898 14.4864L19.7479 13.304C18.6345 14.0973 17.3273 14.5161 15.9679 14.5161C12.3657 14.5161 9.43563 11.586 9.43563 7.98387ZM8.70982 30.4839C8.70982 31.2844 8.05877 31.9355 7.25821 31.9355C6.45764 31.9355 5.80659 31.2844 5.80659 30.4839V26.8548H8.70982V30.4839ZM21.7743 30.4839V31.2097V41.0081C21.7743 42.4089 20.6348 43.5484 19.234 43.5484C17.8332 43.5484 16.6937 42.4089 16.6937 41.0081V31.2097H15.2421V41.0081C15.2421 42.4089 14.1026 43.5484 12.7018 43.5484C11.3009 43.5484 10.1614 42.4089 10.1614 41.0081V31.2097V30.4839V28.3065H21.7743V30.4839ZM21.7743 20.3226V26.8548H10.1614V20.3226H8.70982V25.4032H5.80659V19.5968C5.80659 17.5957 7.43458 15.9677 9.43563 15.9677H18.1453H22.5001C24.5012 15.9677 26.1292 17.5957 26.1292 19.5968V25.4032H23.2259V20.3226H21.7743ZM26.1292 26.8548V30.4839C26.1292 31.2844 25.4781 31.9355 24.6776 31.9355C23.877 31.9355 23.2259 31.2844 23.2259 30.4839V26.8548H26.1292ZM34.8389 30.4839V31.2097V41.0081C34.8389 42.4089 33.6993 43.5484 32.2985 43.5484C30.8977 43.5484 29.7582 42.4089 29.7582 41.0081V31.2097H28.3066V41.0081C28.3066 42.4089 27.1671 43.5484 25.7663 43.5484C24.3655 43.5484 23.2259 42.4089 23.2259 41.0081V32.9836C23.6549 33.2332 24.1463 33.3871 24.6776 33.3871C26.2787 33.3871 27.5808 32.085 27.5808 30.4839V28.3065H34.8389V30.4839ZM39.1937 30.4839C39.1937 31.2844 38.5426 31.9355 37.7421 31.9355C36.9415 31.9355 36.2905 31.2844 36.2905 30.4839V26.8548H39.1937V30.4839ZM39.1937 25.4032H36.2905V20.3226H34.8389V26.8548H27.5808V19.5968C27.5808 18.1756 26.9929 16.891 26.0486 15.9677H35.5647C37.5657 15.9677 39.1937 17.5957 39.1937 19.5968V25.4032Z" fill="black" />
    <path d="M6.53218 7.25806H5.08057V8.70967H6.53218V7.25806Z" fill="black" />
    <path d="M3.62886 7.25806H2.17725V8.70967H3.62886V7.25806Z" fill="black" />
    <path d="M39.9194 7.25806H38.4678V8.70967H39.9194V7.25806Z" fill="black" />
    <path d="M42.8227 7.25806H41.3711V8.70967H42.8227V7.25806Z" fill="black" />
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


const ReferralFriendsList = memo((props) => {
    const { width, typeSort, setTypeSort, friendsList, pageSize, page, setPage, data, user } = props
    const isApp = useApp()

    const { t } = useTranslation('reference')

    const renderTypeSelect = useCallback(() => {
        const { friendsList } = typeSort || {}

        return (
            <ComponentTabWrapper>
                {/*<ComponentTabItem active={friendsList === 1} onClick={() => setTypeSort({...typeSort, friendsList: 1})}>*/}
                {/*    <Translate id='referral_pages.time_sort.all'/>*/}
                {/*</ComponentTabItem>*/}
                <ComponentTabItem active={friendsList === 2} onClick={() => {
                    setTypeSort({ ...typeSort, friendsList: 2 })
                    setPage(0)
                }}>
                    Exchange
                </ComponentTabItem>
                <ComponentTabItem active={friendsList === 3} onClick={() => {
                    setTypeSort({ ...typeSort, friendsList: 3 })
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
                    <i className='ci-short_left' />
                </span>
                <div>
                    {t('global_pagination.pages')}{" "}
                    <b>{page + 1}</b>{" "}
                    {/*<Translate id='global_pagination.of'/>{" "}*/}
                    {/*{page+2}*/}
                </div>
                <span className={isEnd && 'disabled'}
                    onClick={() => setPage(prevState => prevState + 1)}>
                    <i className='ci-short_right' />
                </span>
            </Pagination>
        )
    }, [data, pageSize, page, setPage])

    const renderTable = useCallback(() => {
        if (!data) return <ScaleLoader size={2} color='#03BBCC' />
        const { friendsList } = typeSort || {}
        const tableData = []
        const columns = [
            {
                title: t('referral_pages.table.friends_id'),
                dataIndex: 'code',
                key: 'code',
                width: 'fit-content',
                align: 'left'

            },
            {
                title: <div>{t('referral_pages.table.friends_username')}
                </div>,
                dataIndex: 'name',
                key: 'name',
                width: 'auto',
                align: 'left'

            },
            {
                title: <div>{t('referral_pages.table.kyc_status')}
                    {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                </div>,
                dataIndex: 'is_verified',
                key: 'is_verified',
                width: 'auto',
                align: 'left'

            },
            {
                title: friendsList === 2 ? t('referral_pages.table.total_bonus_earned') : t('referral_pages.table.traded'),
                dataIndex: friendsList === 2 ? 'earned' : 'has_trade',
                key: friendsList === 2 ? 'earned' : 'has_trade',
                width: 'auto',
                align: 'left'

            },
            {
                title: <div> {t('referral_pages.table.reg_time')}
                    {/*<SortIcon>{SORT_SVG}</SortIcon>*/}
                </div>,
                dataIndex: 'created_at',
                key: 'created_at',
                width: 'auto',
                align: 'left'

            }
        ]
        data.map(friend => {
            const code = (friend.hasOwnProperty('code') && friend.code) || '---'
            const name = (friend.hasOwnProperty('name') && friend.name) || '---'
            const created_at = (friend.hasOwnProperty('created_at') && friend.created_at) || null
            const spot_metadata = (friend.hasOwnProperty('spot_metadata') && friend.spot_metadata) || {}
            const futures_metadata = (friend.hasOwnProperty('futures_metadata') && friend.futures_metadata) || {}

            const has_trade = (futures_metadata.hasOwnProperty('has_trade') && futures_metadata.has_trade) || false
            const estimate_value = (spot_metadata.hasOwnProperty('estimate_value') && spot_metadata.estimate_value) || 0
            const estimate_currency = (spot_metadata.hasOwnProperty('estimate_currency') && spot_metadata.estimate_currency) || 0
            const is_verified = (friend.hasOwnProperty('is_verified') && friend.is_verified) || false
            const earned_value = estimate_value ? formatNumber(estimate_value, 6) : 0
            tableData.push({
                code, name, created_at: formatTime(created_at, 'HH:mm DD/MM/YYYY'),
                earned: `${earned_value} ${currencyToText(estimate_currency)}`, has_trade: has_trade ? 'Traded' : 'No Trade',
                is_verified: is_verified ? t('referral_pages.table.verified') : t('referral_pages.table.not_verify')

            })
        })

        return <RcTable columns={columns} data={sortBy(tableData, 'code')} />
    }, [data, typeSort])

    // side effect
    // useEffect(() => {
    //     console.log('namidev-DEBUG: FRIENDSLIST ', data)
    // }, [data, typeSort.friendsList])

    return (
        <>
            <ComponentTitle>
                {FRIENDSLIST_SVG}
                <div>
                    {t('referral_pages.categories.friends_list')}
                </div>
            </ComponentTitle>
            {renderTypeSelect()}
            <ComponentDescription>
                <div>
                    * {t('referral_pages.addition_info.friendslist')}
                </div>
                <div style={{ visibility: 'hidden' }}>
                    {width >= 768 &&
                        <>
                            <span>
                                {props.ExportSvg}
                            </span> {t('referral_pages.utils.export_friendslist')}
                        </>
                    }
                </div>
            </ComponentDescription>
            <ComponentTableWrapper>
                {user ? renderTable()
                    : <div style={width <= 1200 ? { fontSize: 16, fontWeight: 600 } : { fontSize: 18, fontWeight: 600 }}>
                        <NeedLogin>
                            <a href='javascript:void(0)' onClick={() => handleLogin(isApp)}>
                                {t('user.login_to_view')}
                            </a>
                        </NeedLogin>
                    </div>}
            </ComponentTableWrapper>
            {renderPageControl()}
        </>
    )
})

export default ReferralFriendsList;
