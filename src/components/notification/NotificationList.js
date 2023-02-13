import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { createPopper } from '@popperjs/core';
import debounce from 'lodash/debounce';
import { getNotifications, markAllAsRead, truncateNotifications } from 'src/redux/actions/notification';
import { NotificationStatus } from 'src/redux/actions/const';
import { getTimeAgo } from 'src/redux/actions/utils';
import { IconBell, Notification } from '../common/Icons';
import colors from 'styles/colors';
import { useClickAway, useToggle } from 'react-use';
import Bell from 'components/svg/Bell';
import { BxsBellIcon } from '../svg/SvgIcon';
import TextButton from 'src/components/common/V2/ButtonV2/TextButton';

const NotificationList = ({ btnClass = '', navTheme = null }) => {
    const { t } = useTranslation(['navbar']);
    const dispatch = useDispatch();
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();

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

    const [notificationLoading, setNotificationLoading] = useState(false);

    const markAsRead = async () => {
        try {
            if (!notificationsMix) return;
            const ids = notificationsMix.reduce((prev, curr) => {
                if (curr.status === NotificationStatus.READ) return prev;

                prev.push(curr.id);
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
            prevId = notificationsMix[notificationsMix.length - 1].id;
        }
        setNotificationLoading(true);
        dispatch(getNotifications(prevId, () => setNotificationLoading(false)));
    };

    const openDropdownPopover = () => {
        // createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        //     placement: 'bottom-start'
        // });
        // setDropdownPopoverShow(true);
        setPopover(true);
        fetchNotificationsOnOpen();
    };

    const closeDropdownPopover = () => {
        if (isPopover) {
            markAsRead();
            truncateNotificationsDebounce();
            setPopover(false);
        }
    };
    // const handleClickOutside = (e) => {
    //     if (popoverDropdownRef.current.contains(e.target)) {
    //         return;
    //     }
    //     // outside click
    //     closeDropdownPopover();
    // };

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [popoverDropdownRef]);

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
                    {mix.map((notification) => (
                        <div
                            className={`py-3 px-4 mx-6 mb-4 flex justify-between items-center rounded-xl group hover:bg-hover cursor-pointer ${
                                notification?.status === NotificationStatus.READ ? '' : 'bg-black-5'
                            }`}
                            key={notification?.id || notification?.created_at}
                        >
                            <div className="mr-3 p-4 bg-dark-2 rounded-full">
                                <IconBell color={colors.teal} />
                                {/* <Notification /> */}
                            </div>
                            <div className="mr-3 flex-1">
                                <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark mb-1.5 line-clamp-2">{notification.content}</div>
                                <div
                                    className={`${
                                        notification?.status === NotificationStatus.READ ? 'text-txtSecondary dark:text-txtSecondary-dark' : 'text-dominant'
                                    } `}
                                >
                                    {getTimeAgo(notification.created_at)}
                                </div>
                            </div>
                            {notification?.status === NotificationStatus.EMITTED && <div className="ml-3 bg-dominant w-2 h-2 rounded-full" />}
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
            <div  ref={ref} className="mal-navbar__hamburger__spacing h-full sm:relative">
                <button
                    type="button"
                    className={`!h-full btn btn-clean btn-icon inline-flex items-center focus:outline-none relative mr-6 !p-0 ${btnClass}`}
                    aria-expanded="false"
                    onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        isPopover ? closeDropdownPopover() : openDropdownPopover();
                    }}
                >
                    <div className={`${isPopover ? 'text-dominant ' : 'text-gray-7 '} relative`}>
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

                            <TextButton className="w-[fit-content] text-sm font-semibold">Xoá tất cả</TextButton>
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
                                            <span className="text-txtPrimary dark:text-txtPrimary-dark hover:text-teal cursor-pointer">{t('loading')}</span>
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

export default NotificationList;
