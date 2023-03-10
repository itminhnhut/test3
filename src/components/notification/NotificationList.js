import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import debounce from 'lodash/debounce';
import { getNotifications, markAllAsRead, getNotificationsUnreadCount } from 'src/redux/actions/notification';
import { NotificationStatus } from 'src/redux/actions/const';
import { getTimeAgo, getS3Url } from 'src/redux/actions/utils';
import { IconBell } from '../common/Icons';
import colors from 'styles/colors';
import { useClickAway } from 'react-use';
import { BxsBellIcon } from '../svg/SvgIcon';
import classNames from 'classnames';

const NOTI_READ = NotificationStatus.DELETED;

const IconNoti = {
    0: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')}  width={32} height={32} />, // NOTE: ALL
    1: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')} width={32} height={32} />, // NOTE: INDIVIDUAL
    9: <Image src={getS3Url('/images/screen/noti/ic_noti_exchange.png')} width={32} height={32} />, // NOTE: TRANSACTIONS
    14: <Image src={getS3Url('/images/screen/noti/ic_noti_events.png')} width={32} height={32} />, // NOTE: EVENTS
    16: <Image src={getS3Url('/images/screen/noti/ic_noti_system.png')} width={32} height={32} />, // NOTE: SYSTEM
    17: <Image src={getS3Url('/images/screen/noti/ic_noti_referral.png')} width={32} height={32} /> // NOTE: COMMISSION
};

const CONTENT_SLICE_LENGTH = 50;

const NotificationList = ({ btnClass }) => {
    const { t, i18n } = useTranslation(['navbar']);
    const dispatch = useDispatch();

    const ref = useRef(null);

    const [isPopover, setPopover] = useState(false);

    useClickAway(ref, () => {
        closeDropdownPopover();
    });

    // const truncateNotificationsDebounce = debounce(() => {
    //     dispatch(truncateNotifications());
    // }, 60000);

    const notificationsMix = useSelector((state) => state.notification.notificationsMix);
    console.log('notificationsMix:', notificationsMix);
    const hasNextNotification = useSelector((state) => state.notification.hasNextNotification);
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    useEffect(() => {
        dispatch(getNotifications({ lang: i18n.language }));
    }, [i18n, dispatch]);

    const [notificationLoading, setNotificationLoading] = useState(false);

    const markAsRead = async (ids) => {
        dispatch(await markAllAsRead(ids));
    };

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
    };

    const closeDropdownPopover = () => {
        if (isPopover) {
            // truncateNotificationsDebounce();
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
                            className={classNames(
                                'py-3 px-4 mx-6 flex justify-between items-center rounded-xl group dark:hover:bg-hover-dark hover:bg-hover-1',
                                {
                                    'cursor-pointer ': notification?.status === NotificationStatus.READ
                                }
                            )}
                            key={notification?._id || notification?.created_at}
                            onClick={() => handleMarkRead(notification?._id, notification.status)}
                        >
                            <div className="min-w-[48px] min-h-[48px] mr-4 p-2 sm:p-3 bg-hover-1 dark:bg-dark-2 rounded-full flex justify-center items-center ">
                                {IconNoti?.[notification?.category] || <IconBell size={24} color={colors.teal} />}
                            </div>
                            <div className="mr-3 flex-1">
                                <div className="text-base font-semibold text-txtPrimary dark:text-txtPrimary-dark mb-1.5 break-words">{notification.title}</div>

                                <div className={classNames('mb-2 text-sm text-txtPrimary dark:text-txtPrimary-dark  break-words')}>{notification.content}</div>

                                <div
                                    className={`text-xs ${
                                        notification?.status !== NOTI_READ ? 'text-dominant' : 'text-txtSecondary dark:text-txtSecondary-dark'
                                    } `}
                                >
                                    {getTimeAgo(notification.createdAt)}
                                </div>
                            </div>
                            <div
                                className={classNames('ml-3 bg-dominant w-2 h-2 rounded-full', {
                                    hidden: notification?.status === NOTI_READ
                                })}
                            />
                        </div>
                    ))}
                </>
            );
        }
        if (!content) {
            content = <div className="w-full  h-full text-center py-4">{t('navbar:no_noti')}</div>;
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
                    <div
                        className={`${
                            isPopover ? 'text-dominant ' : 'text-txtSecondary dark:text-txtPrimary-dark lg:dark:text-txtSecondary-dark'
                        } hover:!text-dominant relative`}
                    >
                        <BxsBellIcon size={24} />
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
                        'absolute z-10 transform w-screen max-w-[358px] sm:max-w-[448px] rounded-b-xl border border-t-0  dark:border-divider-dark top-[calc(100%+1px)] right-0 bg-bgPrimary dark:bg-darkBlue-3 shadow-lg text-sm'
                    }
                >
                    <div className="py-6">
                        <div className="flex items-center px-6 justify-between mb-8">
                            <div className="text-[22px] font-semibold text-txtPrimary dark:text-txtPrimary-dark">{t('navbar:noti')}</div>

                            <div
                                onClick={handleMarkAllRead}
                                className={classNames('text-sm font-semibold', {
                                    'cursor-pointer  hover:opacity-70 transition-opacity text-teal': unreadCount > 0,
                                    'pointer-events-none text-txtDisabled dark:text-txtDisabled-dark': !unreadCount
                                })}
                            >
                                {t('navbar:mark_read')}
                            </div>

                            {/* {unreadCount > 0 && (
                                <div className="text-sm font-medium text-teal dark:text-teal">
                                    {unreadCount} {t('navbar:unread_noti')}
                                </div>
                            )} */}
                        </div>
                        <div className="max-h-[400px] sm:max-h-[488px] min-h-[400px] space-y-4 overflow-y-auto mb-8">{content}</div>

                        <div className="font-semibold px-6 mb-2">
                            <div className="flex items-center justify-center">
                                {hasNextNotification ? (
                                    <>
                                        {notificationLoading ? (
                                            <span className="pointer-events-none text-txtPrimary dark:text-txtPrimary-dark">{t('loading')}</span>
                                        ) : (
                                            <span
                                                onClick={loadMoreNotification}
                                                className="text-dominant hover:opacity-70 transition-opacity  hover:text-teal cursor-pointer"
                                            >
                                                {t('load_more')}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="opacity-0 pointer-events-none cursor-default text-txtPrimary dark:text-txtPrimary-dark">
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
