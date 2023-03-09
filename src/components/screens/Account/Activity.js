import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { USER_DEVICES, USER_REVOKE_DEVICE } from 'redux/actions/apis';
import Laptop from 'components/svg/Laptop';
import PhoneMobile from 'components/svg/PhoneMobile';
import Delete from 'components/svg/Delete';
import { USER_DEVICE_STATUS } from 'constants/constants';
import { floor, range } from 'lodash';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import { useRouter } from 'next/router';
import { useWindowSize } from 'react-use';

const { LOGGED_OUT, REVOKED, BANNED, NORMAL } = USER_DEVICE_STATUS;

const DEVICE_TYPE = {
    WEB: 'web',
    MOBILE: 'mobile app'
};

function Activity({ t }) {
    const [data, setData] = useState([]);
    const [revokeDevice, setRevokeDevice] = useState(null);
    const [revoking, setRevoking] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [openRevokeModal, setOpenRevokeModal] = useState(false);

    const [isLoadMore, setIsLoadMore] = useState(false);

    const { width } = useWindowSize();
    const isMobile = width <= 768;

    const router = useRouter();

    const getActivities = () => {
        setFetching(true);
        axios
            .get(USER_DEVICES)
            .then(({ data: res }) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(`Can't get activities log `, err);
            })
            .finally(() => {
                setFetching(false);
            });
    };

    useEffect(() => {
        getActivities();
    }, []);

    const durationToText = (duration) => {
        const minutes = floor(duration / 1000);
        const hours = floor(minutes / 60);
        const days = floor(minutes / 60 / 24);
        return days >= 1 ? days + ' ' + t('common:days') : hours >= 1 ? hours + ' ' + t('common:hours') : minutes + ' ' + t('common:minutes');
    };

    const lastLoggedIn = (lastLogged) => {
        const duration = Date.now() - lastLogged.valueOf();
        return t('profile:last_logged_in', { duration: durationToText(duration) });
    };

    const flag = useRef(false);
    const onRevoke = async (revokeId, isThisDevice = false) => {
        if (!revokeId) return;
        setRevoking(true);
        const id = revokeId === 'all' ? 'all' : revokeId;
        flag.current = true;

        await Axios.post(USER_REVOKE_DEVICE, { id })
            .then(async ({ data }) => {
                if (data?.status === ApiStatus.SUCCESS && (id === 'all' || isThisDevice)) {
                    await router.reload();
                }
            })
            .catch(() => {
                console.log(`Can't revoke device ${revokeId} `, e);
            })
            .finally(() => {
                flag.current = false;
                getActivities();
                setRevokeDevice(null);
                closeRevokeModal();
                setRevoking(false);
            });
    };

    const closeRevokeModal = () => {
        // console.log('_here');
        if (flag.current) return;
        setRevokeDevice(null);
        setOpenRevokeModal(false);
    };

    return (
        <div>
            <AlertModalV2
                isVisible={revokeDevice || openRevokeModal}
                onClose={closeRevokeModal}
                type="warning"
                title={t('profile:revoke_title')}
                message={revokeDevice ? t('profile:revoke_question', { device: revokeDevice?.device_title }) : t('profile:revoke_question_all')}
                textButton={t('common:confirm')}
                customButton={
                    <ButtonV2
                        loading={revoking}
                        onClick={() => {
                            onRevoke(revokeDevice ? revokeDevice.id : 'all', revokeDevice?.this_device);
                        }}
                        className="mt-6"
                    >
                        {t('common:confirm')}
                    </ButtonV2>
                }
                className="w-96"
            />
            <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-xl md:text-2xl">{t('profile:devices')}</span>
                <div onClick={() => setOpenRevokeModal(true)} className="font-medium text-teal cursor-pointer hover:underline">
                    {t('profile:revoke_all_devices')}
                </div>
            </div>
            <div className="md:bg-white md:dark:bg-darkBlue-3 rounded-xl md:px-1 md:py-6">
                <div className="md:h-[33.625rem] overflow-y-auto md:px-5 space-y-6">
                    {
                        // Skeleton
                        fetching &&
                            !data?.length &&
                            range(1, 5).map((e) => {
                                return (
                                    <div key={e} className="animate-pulse flex items-center justify-between">
                                        <div className="rounded-full bg-gray-4 dark:bg-dark-2 h-6 w-6" />
                                        <div className="flex-1 space-y-2">
                                            <div className="mx-4 h-4 w-72 bg-gray-4 dark:bg-dark-2 rounded" />
                                            <div className="mx-4 h-12 w-56 bg-gray-4 dark:bg-dark-2 rounded" />
                                            <div className="mx-4 h-4 w-24 bg-gray-4 dark:bg-dark-2 rounded" />
                                        </div>
                                        <div className="w-10 h-10 bg-gray-4 dark:bg-dark-2 rounded-full" />
                                    </div>
                                );
                            })
                    }
                    {data?.slice(0, isLoadMore || !isMobile ? undefined : 5)?.map((item) => {
                        let statusInner =
                            {
                                [LOGGED_OUT]: <p className="text-red text-sm mt-2">{t('profile:account_status.logged_out')}</p>,
                                [REVOKED]: <p className="text-yellow text-sm mt-2">{t('profile:account_status.revoked')}</p>,
                                [BANNED]: <p className="text-red text-sm mt-2">{t('profile:account_status.banned')}</p>
                            }[item.status] || null;

                        if (item.this_device) {
                            statusInner = <p className="text-teal text-sm mt-2">{t('profile:this_device')}</p>;
                        }

                        return (
                            <div
                                key={item.id}
                                className="md:bg-transparent bg-white dark:bg-darkBlue-3 p-4 md:p-0 flex items-center justify-between rounded-xl"
                            >
                                {item.device_type === DEVICE_TYPE.WEB && <Laptop />}
                                {item.device_type === DEVICE_TYPE.MOBILE && <PhoneMobile />}
                                <div className="flex-1 ml-6 min-w-0 overflow-y-hidden">
                                    <p className="font-semibold mb-2">{item.device_title}</p>
                                    <span className="text-xs md:text-sm text-txtSecondary dark:text-txtSecondary block break-all">
                                        {item.last_ip_address} - {item.last_location}
                                    </span>
                                    <span className="text-xs md:text-sm text-txtSecondary dark:text-txtSecondary">
                                        {lastLoggedIn(new Date(item.last_logged_in))}
                                    </span>
                                    {statusInner}
                                </div>
                                {NORMAL === item.status && (
                                    <div
                                        onClick={() => setRevokeDevice(item)}
                                        className="w-10 h-10 bg-gray-10 dark:bg-dark-2 rounded-full relative cursor-pointer"
                                    >
                                        <Delete className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {!isLoadMore && (
                <div className="text-center mt-6 cursor-pointer py-3 md:hidden" onClick={() => setIsLoadMore(!isLoadMore)}>
                    <span className="text-teal font-semibold">{t('common:read_more')}</span>
                </div>
            )}
        </div>
    );
}

export default Activity;
