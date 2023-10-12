import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    ComponentSortItem,
    ComponentSortWrapper,
    ComponentTabItem,
    ComponentTabWrapper,
    ComponentTitle,
    DateRange,
    ReferralNote,
    TimeRange
} from '../styledReference';
import { DashboardGraphics, DashboardItem, DashboardWrapper } from './styledDashboard';
import { formatNumber, formatTime } from '../../../utils/reference-utils';
import { isEmpty } from 'lodash';
import { PulseLoader } from 'react-spinners';
import useApp from '../../../hooks/useApp';
import NeedLogin from '../../../components/common/NeedLogin';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import find from 'lodash/find';

const DASHBOARD_SVG = <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M33.0469 40.0781C29.1698 40.0781 26.0156 36.9239 26.0156 33.0469C26.0156 29.1698 29.1698 26.0156 33.0469 26.0156C36.9239 26.0156 40.0781 29.1698 40.0781 33.0469C40.0781 36.9239 36.9239 40.0781 33.0469 40.0781ZM33.0469 29.5312C31.1084 29.5312 29.5312 31.1084 29.5312 33.0469C29.5312 34.9854 31.1084 36.5625 33.0469 36.5625C34.9854 36.5625 36.5625 34.9854 36.5625 33.0469C36.5625 31.1084 34.9854 29.5312 33.0469 29.5312Z"
        fill="#00B6C7"/>
    <path d="M3.51562 8.4375H16.1719V18.2812H3.51562V8.4375Z" fill="#00B6C7"/>
    <path
        d="M33.0469 28.8281C30.7202 28.8281 28.8281 30.7202 28.8281 33.0469C28.8281 35.3735 30.7202 37.2656 33.0469 37.2656C35.3735 37.2656 37.2656 35.3735 37.2656 33.0469C37.2656 30.7202 35.3735 28.8281 33.0469 28.8281ZM33.0469 35.8594C31.4958 35.8594 30.2344 34.598 30.2344 33.0469C30.2344 31.4958 31.4958 30.2344 33.0469 30.2344C34.598 30.2344 35.8594 31.4958 35.8594 33.0469C35.8594 34.598 34.598 35.8594 33.0469 35.8594Z"
        fill="black"/>
    <path
        d="M40.0781 24.2789V10.4906C42.4596 10.1475 44.2969 8.0993 44.2969 5.625C44.2969 2.91164 42.0891 0.703125 39.375 0.703125C36.6609 0.703125 34.4531 2.91164 34.4531 5.625H0.703125V33.75H21.8327C22.1984 39.6253 27.0816 44.2969 33.0469 44.2969C39.2498 44.2969 44.2969 39.2498 44.2969 33.0469C44.2969 29.5038 42.6466 26.3426 40.0781 24.2789ZM39.375 2.10938C41.3135 2.10938 42.8906 3.68648 42.8906 5.625C42.8906 7.56352 41.3135 9.14062 39.375 9.14062C37.4365 9.14062 35.8594 7.56352 35.8594 5.625C35.8594 3.68648 37.4365 2.10938 39.375 2.10938ZM21.8327 32.3438H2.10938V7.03125H34.6605C34.8286 7.59234 35.0958 8.10914 35.4389 8.56758L31.1386 12.8679C30.863 12.7357 30.5592 12.6562 30.2344 12.6562C29.9095 12.6562 29.6058 12.7357 29.3309 12.8679L27.9141 11.4511C28.0455 11.1755 28.125 10.8717 28.125 10.5469C28.125 9.38391 27.1786 8.4375 26.0156 8.4375C24.8527 8.4375 23.9062 9.38391 23.9062 10.5469C23.9062 10.8717 23.9857 11.1755 24.1179 11.4504L20.5917 14.9766C20.3161 14.8451 20.0123 14.7656 19.6875 14.7656C18.5245 14.7656 17.5781 15.712 17.5781 16.875C17.5781 18.038 18.5245 18.9844 19.6875 18.9844C20.8505 18.9844 21.7969 18.038 21.7969 16.875C21.7969 16.5502 21.7174 16.2464 21.5852 15.9715L25.1114 12.4453C25.387 12.5768 25.6908 12.6562 26.0156 12.6562C26.3405 12.6562 26.6442 12.5768 26.9191 12.4446L28.3359 13.8614C28.2045 14.137 28.125 14.4408 28.125 14.7656C28.125 15.9286 29.0714 16.875 30.2344 16.875C31.3973 16.875 32.3438 15.9286 32.3438 14.7656C32.3438 14.4408 32.2643 14.137 32.1321 13.8621L36.4331 9.5618C37.0765 10.0441 37.8401 10.3711 38.6719 10.4913V23.3198C37.0146 22.3573 35.0972 21.7969 33.0469 21.7969C29.6859 21.7969 26.6723 23.2861 24.6094 25.631V22.5H20.3906V30.9375H22.0022C21.9143 31.3966 21.8623 31.867 21.8327 32.3438ZM30.9375 14.7656C30.9375 15.1538 30.6218 15.4688 30.2344 15.4688C29.847 15.4688 29.5312 15.1538 29.5312 14.7656C29.5312 14.3775 29.847 14.0625 30.2344 14.0625C30.6218 14.0625 30.9375 14.3775 30.9375 14.7656ZM26.7188 10.5469C26.7188 10.935 26.403 11.25 26.0156 11.25C25.6282 11.25 25.3125 10.935 25.3125 10.5469C25.3125 10.1587 25.6282 9.84375 26.0156 9.84375C26.403 9.84375 26.7188 10.1587 26.7188 10.5469ZM20.3906 16.875C20.3906 17.2631 20.0749 17.5781 19.6875 17.5781C19.3001 17.5781 18.9844 17.2631 18.9844 16.875C18.9844 16.4869 19.3001 16.1719 19.6875 16.1719C20.0749 16.1719 20.3906 16.4869 20.3906 16.875ZM21.7969 29.5312V23.9062H23.2031V27.6124C22.8663 28.2199 22.5879 28.8619 22.3671 29.5312H21.7969ZM41.8908 37.3409L39.4516 35.9325C39.2569 36.3635 39.0192 36.7692 38.7457 37.1489L41.1947 38.5629C39.4228 41.1729 36.4317 42.8906 33.0469 42.8906C29.662 42.8906 26.6709 41.1729 24.8991 38.5629L27.348 37.1489C27.0738 36.7692 26.8369 36.3628 26.6421 35.9325L24.203 37.3409C23.5688 36.0415 23.2031 34.5874 23.2031 33.0469C23.2031 27.8564 27.244 23.6018 32.3438 23.239V26.0515C32.5751 26.0283 32.8092 26.0156 33.0469 26.0156C33.2845 26.0156 33.5187 26.0283 33.75 26.0515V23.239C38.8498 23.6018 42.8906 27.8564 42.8906 33.0469C42.8906 34.5874 42.525 36.0415 41.8908 37.3409Z"
        fill="black"/>
    <path d="M3.51562 8.4375H4.92188V9.84375H3.51562V8.4375Z" fill="black"/>
    <path d="M6.32812 8.4375H16.1719V9.84375H6.32812V8.4375Z" fill="black"/>
    <path d="M3.51562 11.25H4.92188V12.6562H3.51562V11.25Z" fill="black"/>
    <path d="M6.32812 11.25H16.1719V12.6562H6.32812V11.25Z" fill="black"/>
    <path d="M3.51562 14.0625H4.92188V15.4688H3.51562V14.0625Z" fill="black"/>
    <path d="M6.32812 14.0625H16.1719V15.4688H6.32812V14.0625Z" fill="black"/>
    <path d="M3.51562 16.875H4.92188V18.2812H3.51562V16.875Z" fill="black"/>
    <path d="M6.32812 16.875H16.1719V18.2812H6.32812V16.875Z" fill="black"/>
    <path d="M3.51562 30.9375H7.73438V23.9062H3.51562V30.9375ZM4.92188 25.3125H6.32812V29.5312H4.92188V25.3125Z"
          fill="black"/>
    <path d="M9.14062 30.9375H13.3594V25.3125H9.14062V30.9375ZM10.5469 26.7188H11.9531V29.5312H10.5469V26.7188Z"
          fill="black"/>
    <path d="M14.7656 30.9375H18.9844V19.6875H14.7656V30.9375ZM16.1719 21.0938H17.5781V29.5312H16.1719V21.0938Z"
          fill="black"/>
</svg>;
const EARNED = {
    nami: 6868,
    vndc: 200,
    usdt: 101.98
};

const ReferralDashboard = memo((props) => {
    // @ts-ignore
    const {
        width,
        timeSort,
        setTimeSort,
        typeSort,
        setTypeSort,
        data,
        user
    } = props;

    const { t } = useTranslation('reference');

    // initial state
    const [earnedValue, setEarnedValue] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const isApp = useApp();

    const assetConfig = useSelector(state => state.utils.assetConfig);

    // helper

    // render handler
    const renderEarnedCommissionToken = useCallback(() => {
        // const {nami, vndc, usdt} = earnedValue || {};
        const dashboard_type = typeSort && typeSort.hasOwnProperty('dashboard') && typeSort.dashboard;
        let commission = {};
        const inner = [];

        if (dashboard_type === 3) {
            const futures_metadata = (data && data.hasOwnProperty('futures_metadata') && data.futures_metadata) || {};
            commission = (futures_metadata.hasOwnProperty('commission') && futures_metadata.commission) || {};
        } else if (dashboard_type === 2) {
            const spot_metadata = (data && data.hasOwnProperty('spot_metadata') && data.spot_metadata) || {};
            commission = (spot_metadata.hasOwnProperty('commission') && spot_metadata.commission) || {};
        }

        // console.log(commission)
        for (const [key, value] of Object.entries(commission)) {
            const filter = {};
            filter.id = +key;
            const config = find(assetConfig, filter);
            const logoUrl = getS3Url(`/images/coins/64/${config?.id}.png`);
            inner.push(
                <DashboardItem>
                    <div>
                        {t('referral_pages.dashboard.you_earned')}
                        {/* <AssetLogo assetId={key} size={14} /> */}
                        <img src={logoUrl} width={14} height={14}/>
                    </div>
                    <div>
                        {value ? formatNumber(value, 6) : 0.0000}
                    </div>
                </DashboardItem>
            );
        }

        return (
            <>
                {inner}
                {/*<DashboardItem>*/}
                {/*    <div><Translate id='referral_pages.dashboard.you_earned'/> {getTokenIcon(WalletCurrency.NAMI, 14)}</div>*/}
                {/*    <div>*/}
                {/*        {loaded ? <CountUp end={nami}/> : 0}*/}
                {/*    </div>*/}
                {/*</DashboardItem>*/}
                {/*<DashboardItem>*/}
                {/*    <div><Translate id='referral_pages.dashboard.you_earned'/> {getTokenIcon(WalletCurrency.VNDC, 14)}</div>*/}
                {/*    <div>{loaded ? <CountUp end={vndc}/> : 0}</div>*/}
                {/*</DashboardItem>*/}
                {/*<DashboardItem>*/}
                {/*    <div><Translate id='referral_pages.dashboard.you_earned'/> {getTokenIcon(WalletCurrency.USDT, 14)}</div>*/}
                {/*    <div>{loaded ? <CountUp end={usdt}/> : 0}</div>*/}
                {/*</DashboardItem>*/}
            </>
        );
    }, [earnedValue, loaded, typeSort]);

    const renderFriends = useCallback(() => {
        const dashboard_type = typeSort && typeSort.hasOwnProperty('dashboard') && typeSort.dashboard;
        const total_friends = data && data.hasOwnProperty('total_friends') && data.total_friends;
        let traded_user = null;

        if (dashboard_type === 3) {
            const futures_metadata = (data && data.hasOwnProperty('futures_metadata') && data.futures_metadata) || {};
            traded_user = (futures_metadata && futures_metadata.hasOwnProperty('count_traded_user')
                && futures_metadata.count_traded_user) || 0;
        } else if (dashboard_type === 2) {
            const spot_metadata = (data && data.hasOwnProperty('spot_metadata') && data.spot_metadata) || {};
            traded_user = (spot_metadata && spot_metadata.hasOwnProperty('count_traded_user')
                && spot_metadata.count_traded_user) || 0;
        }

        return (
            <>
                <DashboardItem>
                    <div>
                        {t('referral_pages.dashboard.total_of_friends')}

                    </div>
                    <div>{total_friends ? formatNumber(total_friends, 0) : 0}</div>
                </DashboardItem>
                <DashboardItem>
                    <div>
                        {t('referral_pages.dashboard.total_of_traded_friends')}

                    </div>
                    <div>{traded_user ? formatNumber(traded_user, 0) : 0}</div>
                </DashboardItem>
            </>
        );
    }, [data, typeSort]);

    const renderTimeSelect = useCallback(() => {
        return (
            <ComponentSortWrapper>
                <ComponentSortItem active={timeSort === 1} onClick={() => setTimeSort(1)}>
                    {t('referral_pages.time_sort.all')}
                </ComponentSortItem>
                {/*<ComponentSortItem active={timeSort === 2} onClick={() => setTimeSort(2)}>*/}
                {/*    <Translate id='referral_pages.time_sort.yesterday'/>*/}
                {/*</ComponentSortItem>*/}
                {/*<ComponentSortItem active={timeSort === 3} onClick={() => setTimeSort(3)}>*/}
                {/*    <Translate id='referral_pages.time_sort.this_week'/>*/}
                {/*</ComponentSortItem>*/}
                {/*<ComponentSortItem active={timeSort === 4} onClick={() => setTimeSort(4)}>*/}
                {/*    <Translate id='referral_pages.time_sort.this_month'/>*/}
                {/*</ComponentSortItem>*/}
            </ComponentSortWrapper>
        );
    }, [timeSort]);

    const renderTypeSelect = useCallback(() => {
        const { dashboard } = typeSort || {};

        return (
            <ComponentTabWrapper>
                {/*<ComponentTabItem active={dashboard === 1} onClick={() => setTypeSort({...typeSort, dashboard: 1})}>*/}
                {/*    <Translate id='referral_pages.time_sort.all'/>*/}
                {/*</ComponentTabItem>*/}
                <ComponentTabItem active={dashboard === 2} onClick={() => setTypeSort({
                    ...typeSort,
                    dashboard: 2
                })}>
                    Exchange
                </ComponentTabItem>
                <ComponentTabItem active={dashboard === 3} onClick={() => setTypeSort({
                    ...typeSort,
                    dashboard: 3
                })}>
                    Futures
                </ComponentTabItem>
            </ComponentTabWrapper>
        );
    }, [typeSort]);

    const renderTime = useCallback(() => {
        const updated_at = data && data.hasOwnProperty('updated_at') && data.updated_at;

        return (
            <DateRange>
                {updated_at ?
                    <>
                        {t('referral_pages.time_sort.date_range')}: {width < 768 ? <br/> : <span className="pl-1"/>}
                        <span>{t('referral_pages.time_sort.until')} {formatTime(updated_at, 'HH:mm DD/MM/YYYY')}</span>
                    </>
                    : <PulseLoader size={3} color="#03BBCC"/>
                }
            </DateRange>
        );
    }, [data]);

    // side effect
    useEffect(() => {
        setEarnedValue(data);
    }, [data]);

    useEffect(() => {
        if (!isEmpty(earnedValue)) {
            setTimeout(() => {
                setLoaded(true);
            }, 1200);
        }
    }, [earnedValue]);

    return (
        <>
            <ComponentTitle>
                {DASHBOARD_SVG}
                <div>
                    {t('referral_pages.categories.dashboard')}
                </div>
            </ComponentTitle>
            {renderTypeSelect()}
            <TimeRange>
                {renderTimeSelect()}
                {user && renderTime()}
            </TimeRange>
            <DashboardWrapper>
                {!user ?
                    <div className="w-full justify-center items-center h-full" style={width <= 1200 ? {
                        fontSize: 16,
                        fontWeight: 600
                    } : {
                        fontSize: 18,
                        fontWeight: 600
                    }}>
                        <NeedLogin message={t('user.login_to_view')}/>
                    </div>
                    : <>
                        {renderEarnedCommissionToken()}
                        <div className="w-full"/>
                        {renderFriends()}
                    </>
                }
                <DashboardGraphics>
                    <img src={getS3Url('/images/reference/dashboard_graphics.png')} alt=""/>
                </DashboardGraphics>
            </DashboardWrapper>
            <ReferralNote>
                {t('referral_pages.addition_info.dashboard')}
            </ReferralNote>
        </>
    );
});

export default ReferralDashboard;

// <DashboardItem id='rank-item'>
//     <div>Your Ranking</div>
//     <div>7910</div>
// </DashboardItem>
