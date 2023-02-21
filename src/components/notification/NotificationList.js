import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import debounce from 'lodash/debounce';
import { getNotifications, markAllAsRead, truncateNotifications } from 'src/redux/actions/notification';
import { NotificationStatus } from 'src/redux/actions/const';
import { getTimeAgo, getS3Url } from 'src/redux/actions/utils';
import { IconBell } from '../common/Icons';
import colors from 'styles/colors';
import { useClickAway } from 'react-use';
import { BxsBellIcon } from '../svg/SvgIcon';
import ButtonV2 from 'src/components/common/V2/ButtonV2/Button';

const NOTI_READ = 2;

const IconNoti = {
    0: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')} width={32} height={32} />, // NOTE: ALL
    1: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')} width={32} height={32} />, // NOTE: INDIVIDUAL
    9: <Image src={getS3Url('/images/screen/noti/ic_noti_exchange.png')} width={32} height={32} />, // NOTE: TRANSACTIONS
    14: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')} width={32} height={32} />, // NOTE: EVENTS
    16: <Image src={getS3Url('/images/screen/noti/ic_noti_system.png')} width={32} height={32} />, // NOTE: SYSTEM
    17: <Image src={getS3Url('/images/screen/noti/ic_noti_referral.png')} width={32} height={32} /> // NOTE: COMMISSION
};

const NotificationList = ({ btnClass, navTheme, auth }) => {
    const { t, i18n } = useTranslation(['navbar']);
    const dispatch = useDispatch();

    const ref = useRef(null);

    const [isPopover, setPopover] = useState(false);

    useClickAway(ref, () => {
        closeDropdownPopover();
    });

    const truncateNotificationsDebounce = debounce(() => {
        dispatch(truncateNotifications());
    }, 60000);

    const notificationsMix = useSelector((state) => state.notification.notificationsMix);
    const hasNextNotification = useSelector((state) => state.notification.hasNextNotification);
    const unreadCount = useSelector((state) => state.notification.unreadCount);
    const user = useSelector((state) => state.auth.user) || null;

    const [notificationLoading, setNotificationLoading] = useState(false);

    console.log('hasNextNotification', hasNextNotification);
    const markAsRead = async (ids) => {
        dispatch(await markAllAsRead(ids));
    };

    const fetchNotificationsOnOpen = _.throttle(() => dispatch(getNotifications({ lang: i18n.language })), 1000);

    const loadMoreNotification = () => {
        let prevId;
        if (notificationsMix && notificationsMix.length) {
            prevId = notificationsMix[notificationsMix.length - 1]._id;
        }
        setNotificationLoading(true);
        dispatch(getNotifications({ lang: i18n.language, prevId }, () => setNotificationLoading((prev) => !prev)));
    };

    const openDropdownPopover = () => {
        setPopover(true);
        fetchNotificationsOnOpen();
    };

    const closeDropdownPopover = () => {
        if (isPopover) {
            truncateNotificationsDebounce();
            setPopover(false);
        }
    };

    const handleMarkRead = async (ids, status) => {
        if (status === 2) return;
        markAsRead(ids);
    };

    const handleMarkAllRead = async () => {
        markAsRead();
    };

    let content;
    const mix = notificationsMix;
    // setNotification
    if (mix === null) {
        content = <div className="w-full h-full text-center py-4">{t('navbar:loading')}...</div>;
    } else if (Array.isArray(mix)) {
        if (mix.length) {
            content = (
                <>
                    {mix.map((notification) => (
                        <div
                            className={`py-3 px-4 mx-6 mb-4 flex justify-between items-center rounded-xl group dark:hover:bg-hover-dark hover:bg-hover-1 cursor-pointer ${
                                notification?.status === NotificationStatus.READ ? '' : ''
                            }`}
                            key={notification?._id || notification?.created_at}
                            onClick={() => handleMarkRead(notification?._id, notification.status)}
                        >
                            <div className="mr-3 p-4 bg-hover-1 dark:bg-dark-2 rounded-full w-[58px] h-[58px]">
                                {IconNoti?.[notification?.category] || <IconBell color={colors.teal} />}
                            </div>
                            <div className="mr-3 flex-1">
                                <div className="text-base font-semibold text-txtPrimary dark:text-txtPrimary-dark mb-1.5 line-clamp-2">
                                    {notification.title}
                                </div>
                                <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark mb-2 line-clamp-2">{notification.content}</div>
                                <div
                                    className={`text-xs ${
                                        notification?.status !== NOTI_READ ? 'text-dominant' : 'text-txtSecondary dark:text-txtSecondary-dark'
                                    } `}
                                >
                                    {getTimeAgo(notification.createdAt)}
                                </div>
                            </div>
                            {notification?.status !== NOTI_READ && <div className="ml-3 bg-dominant w-2 h-2 rounded-full" />}
                        </div>
                    ))}
                </>
            );
        }
        if (!content) {
            content = <div className="w-full h-full text-center py-4">{t('navbar:no_noti')}</div>;
        }
    }
    return (
        <>
            <div ref={ref} className="mal-navbar__hamburger__spacing h-full sm:relative">
                <button
                    type="button"
                    className={`!h-full btn btn-clean btn-icon inline-flex items-center focus:outline-none relative mr-6 !p-0 ${btnClass}`}
                    aria-expanded="false"
                    onClick={() => {
                        isPopover ? closeDropdownPopover() : openDropdownPopover();
                    }}
                >
                    <div className={`${isPopover ? 'text-dominant ' : 'text-txtSecondary dark:text-txtSecondary-dark '} hover:!text-dominant relative`}>
                        <BxsBellIcon size={20} />
                        {unreadCount > 0 && <div className="bg-red w-2 h-2 rounded-full absolute top-1 right-0" />}
                    </div>

                    {/* {unreadCount > 0 && (
                        <div className="absolute w-2.5 h-2.5 rounded-full flex items-center justify-center bg-red text-white text-[8px] top-2 right-2	">
                            {unreadCount}
                        </div>
                    )} */}
                </button>

                <div
                    className={
                        (isPopover ? 'block ' : 'hidden ') +
                        'absolute z-10 transform w-screen max-w-[415px] rounded-b-xl border border-t-0  dark:border-divider-dark top-[calc(100%+1px)] right-0 bg-bgPrimary dark:bg-darkBlue-3 shadow-lg text-sm'
                    }
                >
                    <div className="py-6">
                        <div className="flex items-center px-6 justify-between mb-8">
                            <div className="text-[22px] font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:noti')}</div>

                            <ButtonV2 variants="text" className="w-[fit-content] text-sm font-semibold" onClick={handleMarkAllRead}>
                                {t('navbar:delete_noti')}
                            </ButtonV2>
                            {/* {unreadCount > 0 && (
                                <div className="text-sm font-medium text-teal dark:text-teal">
                                    {unreadCount} {t('navbar:unread_noti')}
                                </div>
                            )} */}
                        </div>
                        <div className="max-h-[488px]  min-h-[400px] overflow-y-auto mb-8">{content}</div>

                        <div className="font-semibold px-6">
                            <div className="flex items-center py-3 justify-center">
                                {hasNextNotification ? (
                                    <>
                                        {notificationLoading ? (
                                            <span className="pointer-events-none text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer">
                                                {t('loading')}
                                            </span>
                                        ) : (
                                            <span
                                                onClick={loadMoreNotification}
                                                className="text-dominant dark:text-txtPrimary-dark hover:text-teal cursor-pointer"
                                            >
                                                {t('load_more')}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer">
                                        {t('navbar:read_all_noti')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

NotificationList.defaultProps = {
    btnClass: '',
    navTheme: null
};

export default NotificationList;
