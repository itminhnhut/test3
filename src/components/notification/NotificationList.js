import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { createPopper } from '@popperjs/core';
import debounce from 'lodash/debounce';
import { getNotifications, markAllAsRead, truncateNotifications } from 'actions/notification';
import { NotificationStatus } from 'src/redux/actions/const';
import { getTimeAgo } from 'src/redux/actions/utils';
import { IconBell, Notification, NotificationDown, NotificationUp } from '../common/Icons';

const NotificationList = (props) => {
    const { t } = useTranslation(['navbar']);
    const dispatch = useDispatch();
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();

    const truncateNotificationsDebounce = debounce(() => {
        dispatch(truncateNotifications());
    }, 60000);

    const notificationsMix = useSelector(state => state.notification.notificationsMix);
    const hasNextNotification = useSelector(state => state.notification.hasNextNotification);
    const unreadCount = useSelector(state => state.notification.unreadCount);

    const [notificationLoading, setNotificationLoading] = useState(false);

    const markAsRead = async () => {
        try {
            if (!notificationsMix) return;
            const ids = notificationsMix.reduce((prev, curr) => {
                if (curr.status === NotificationStatus.READ) return prev;

                prev.push(curr._id);
                return prev;
            }, []);

            dispatch(await markAllAsRead(ids));
        } catch (er) {
            // console.error(er);
        }
    };

    const fetchNotificationsOnOpen = _.throttle(() => dispatch(getNotifications()), 1000);

    const loadMoreNotification = () => {
        let prevId;
        if (notificationsMix && notificationsMix.length) {
            prevId = notificationsMix[notificationsMix.length - 1]._id;
        }
        setNotificationLoading(true);
        dispatch(getNotifications(prevId, () => setNotificationLoading(false)));
    };

    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: 'bottom-start',
        });
        setDropdownPopoverShow(true);
        fetchNotificationsOnOpen();
    };
    const closeDropdownPopover = () => {
        if (dropdownPopoverShow) {
            markAsRead();
            truncateNotificationsDebounce();
            setDropdownPopoverShow(false);
        }
    };
    const handleClickOutside = e => {
        if (popoverDropdownRef.current.contains(e.target)) {
            return;
        }
        // outside click
        closeDropdownPopover();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverDropdownRef]);

    let content;
    const mix = notificationsMix;
    // setNotification
    if (mix === null) {
        content = <div className="w-full h-full text-center py-4">{t('navbar:loading')}...</div>;
    } else if (Array.isArray(mix)) {
        if (mix.length) {
            content = (
                <>
                    {/* { this._renderNotificationHeader(<Translate id="noti_game.noti_status_unread"/>)} */}
                    {/* { mix.map(notification => this._renderNotificationItem(notification)) } */}
                    {mix.map(notification => (
                        <div
                            className={`px-6 py-2.5 flex group hover:bg-black-200 cursor-pointer ${notification?.status === NotificationStatus.READ ? '' : 'bg-black-5'}`}
                            key={notification?._id || notification?.createdAt}
                        >
                            <div className="mr-3">
                                { notification?.category === 'DEPOSIT' ?
                                    <NotificationUp /> :
                                    notification?.category === 'WITHDRAW' ?
                                        <NotificationDown /> :
                                        <Notification />}
                            </div>
                            <div className="flex-grow">
                                <div className="flex text-sm font-medium mb-1 items-center justify-between">
                                    <div className="line-clamp-1">{notification.title}</div>
                                    {
                                        notification?.status !== NotificationStatus.READ && (
                                            <div className="ml-3 w-1.5 h-1.5 bg-black rounded-full">
                                                <div />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="text-sm text-black-600 mb-1.5 line-clamp-2">
                                    {notification.content}
                                </div>
                                <div className="text-black-500">
                                    {getTimeAgo(notification.createdAt)}
                                </div>
                            </div>
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
            <div className="relative">
                <button
                    type="button"
                    className="btn btn-clean btn-icon inline-flex items-center focus:outline-none relative mr-7"
                    aria-expanded="false"
                    ref={btnDropdownRef}
                    onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        dropdownPopoverShow
                            ? closeDropdownPopover()
                            : openDropdownPopover();
                    }}
                >
                    <IconBell />
                    {unreadCount > 0
                    && (
                        <div
                            className="absolute w-4 h-4 rounded-full flex items-center justify-center bg-red text-white text-xxs top-1 right-2	"
                        >{unreadCount}
                        </div>
                    )}

                </button>

                <div
                    ref={popoverDropdownRef}
                    className={
                        (dropdownPopoverShow ? 'block ' : 'hidden ')
                        + 'absolute z-10 transform w-screen max-w-[385px] rounded border border-black-200 right-0 bg-white shadow-xl text-sm'
                    }
                >
                    <div className="">
                        <div className="px-6 pt-6 pb-2 flex items-center">
                            <div className="text-lg font-bold">{t('navbar:noti')}</div>
                        </div>
                        <div className="lg:max-h-[400px] lg:min-h-[350px] max-h-[300px] min-h-[250px] overflow-y-auto">
                            {content}
                        </div>

                        <div className="border-0 border-t border-black-200 font-medium">

                            <div className="p-2.5 flex items-center justify-center">
                                {
                                    hasNextNotification
                                        ?
                                        (
                                            <>
                                                {
                                                    notificationLoading ?
                                                        <span className="ml-3 text-black-700 hover:text-teal-700 cursor-pointer">
                                                            {t('loading')}
                                                        </span>
                                                        : (
                                                            <span
                                                                onClick={loadMoreNotification}
                                                                className="ml-3 text-black-700 hover:text-teal-700 cursor-pointer"
                                                            >
                                                                {t('load_more')}
                                                            </span>
                                                        )
                                                }
                                            </>
                                        )
                                        :
                                        (
                                            <span className="ml-3 text-black-700 hover:text-teal-700 cursor-pointer">
                                                {t('navbar:read_all_noti')}
                                            </span>
                                        )
                                }

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationList;
