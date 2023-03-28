import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_NEW_COMMISSIONS, API_NEW_REFERRAL_NEW_FRIENDS } from 'redux/actions/apis';
import { NoData } from 'components/screens/NewReference/mobile';
import { formatNumber, formatTime } from 'redux/actions/utils';
import React, { useEffect, useState, useMemo } from 'react';
import RefCard from '../../RefCard';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import UserCircle from 'components/svg/UserCircle';

const tier = {
    1: {
        vi: 'Thường',
        en: 'Normal'
    },
    2: {
        vi: 'Chính thức',
        en: 'Offical'
    },
    3: {
        en: 'Gold',
        vi: 'Vàng'
    },
    4: {
        vi: 'Bạch Kim',
        en: 'Platinum'
    },
    5: {
        en: 'Diamond',
        vi: 'Kim Cương'
    }
};
const languages = {
    newUser: {
        en: 'New Friend',
        vi: 'Bạn bè mới'
    },
    refUser: {
        en: 'Referrer',
        vi: 'Người giới thiệu'
    },
    level: {
        en: 'Level',
        vi: 'Cấp bậc'
    },
    tier: {
        en: 'Ranking',
        vi: 'Hạng'
    }
};

const Commission = ({ t, language, id }) => {
    const [lastedCommissions, setLastedCommissions] = useState([]);
    const [lastedFriends, setLastedFriends] = useState([]);
    const [theme] = useDarkMode();

    useEffect(() => {
        handleAPI();
    }, []);

    const handleAPI = () => {
        const commission = FetchApi({
            url: API_NEW_REFERRAL_NEW_COMMISSIONS,
            options: {
                method: 'GET'
            }
        });
        const newFriend = FetchApi({
            url: API_NEW_REFERRAL_NEW_FRIENDS,
            options: {
                method: 'GET'
            }
        });
        Promise.all([commission, newFriend])
            .then((values) => {
                const [commissions = {}, friends = {}] = values || [];
                setLastedCommissions(commissions?.data || []);
                setLastedFriends(friends?.data || []);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const renderNewFriends = useMemo(() => {
        return !lastedFriends.length ? (
            <NoData className="my-20 !text-base" text={t('reference:referral.no_friends')} />
        ) : (
            lastedFriends.map((data) => (
                <div key={data.userId} className="p-4 bg-gray-13 dark:bg-dark-2 rounded-xl">
                    <div className="flex gap-2 mb-6 items-center">
                        <UserCircle size={32} />
                        <div>
                            <p className="font-semibold text-darkBlue dark:text-gray-4">{data.name || '_'}</p>
                            <div className="text-tiny flex flex-row  text-gray-1 dark:text-gray-7 items-center">
                                <p>{data?.code || '_'}</p>
                                <span className="mx-2 w-1 h-1 rounded-full bg-gray-1 dark:bg-gray-7" />
                                <p>{formatTime(data?.invitedAt, 'HH:mm dd/MM/yyyy') || '_'}</p>
                            </div>
                        </div>
                        {/* <p className="font-semibold">
                            {t('reference:referral.new_friend')}: {data.code}
                        </p> */}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral:referrer')}</span>
                            <span className="float-right text-txtPrimary dark:text-gray-4 font-semibold">{data?.invitedBy?.name || '_'}</span>
                        </div>
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">ID người giới thiệu</span>
                            <span className="float-right text-txtPrimary dark:text-gray-4 font-semibold">{data?.invitedBy?.code || '_'}</span>
                        </div>
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral:level')}</span>
                            <span className="float-right text-txtPrimary dark:text-gray-4 font-semibold">{`F${data?.level - 1}`}</span>
                        </div>
                    </div>
                </div>
            ))
        );
    }, [lastedFriends]);

    const renderLastedCommissions = useMemo(() => {
        return !lastedCommissions.length ? (
            <NoData className="my-20 !text-base" text={t('reference:referral.no_commission')} />
        ) : (
            lastedCommissions.map((data, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-1">
                        <div className="flex w-full justify-between items-center font-semibold leading-6">
                            <div>{`${data.formUserCode} (${t('reference:referral.level')} F${data?.level || 0})`}</div>
                            <div className="text-teal">+{formatNumber(data.value, 2)} VNDC</div>
                        </div>
                        <div className="flex w-full justify-between items-center text-txtSecondary dark:text-txtSecondary-dark text-sm">
                            <div>{formatTime(data.createdAt, 'dd/MM/yyyy HH:mm:ss')}</div>
                            <div>
                                {t('reference:referral.type_commission')}: <span className="capitalize">{data.kind?.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        );
    }, [lastedCommissions]);

    return (
        <div className="flex gap-6 w-full" id={id}>
            {/* Hoa hồng */}
            <RefCard wrapperClassName="!py-6 px-8 w-full max-h-[624px]" isBlack={theme === THEME_MODE.DARK}>
                <div className="font-semibold text-[22px] leading-7 py-3 mb-6">{t('reference:referral.reward_commission')}</div>
                <div className="max-h-[calc(624px-124px)] overflow-y-auto pr-5 -mr-5 space-y-8">{renderLastedCommissions}</div>
            </RefCard>
            {/* Bạn bè mới */}
            <RefCard wrapperClassName="!py-6 px-8 w-full max-h-[624px]" isBlack={theme === THEME_MODE.DARK}>
                <div className="font-semibold text-[22px] leading-7 py-3 mb-6">{t('reference:referral.new_friends')}</div>
                <div className="max-h-[calc(624px-124px)] overflow-y-auto pr-5 -mr-5 space-y-4">{renderNewFriends}</div>
            </RefCard>
        </div>
    );
};

export default Commission;
