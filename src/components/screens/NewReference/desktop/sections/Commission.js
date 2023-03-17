import classNames from 'classnames';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_NEW_COMMISSIONS, API_NEW_REFERRAL_NEW_FRIENDS } from 'redux/actions/apis';
import { Line, NoData } from 'components/screens/NewReference/mobile';
import { formatNumber, formatTime } from 'redux/actions/utils';
import React, { useEffect, useState, useMemo } from 'react';
import RefCard from '../../RefCard';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { BxsInfoCircle, BxsUserCircle } from 'components/svg/SvgIcon';

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
        FetchApi({
            url: API_NEW_REFERRAL_NEW_COMMISSIONS,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setLastedCommissions(data);
            } else {
                setLastedCommissions([]);
            }
        });
        FetchApi({
            url: API_NEW_REFERRAL_NEW_FRIENDS,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setLastedFriends(data);
            } else {
                setLastedFriends([]);
            }
        });
    }, []);

    const renderNewFriends = useMemo(() => {
        return !lastedFriends.length ? (
            <>
                <NoData className="my-20" text={t('reference:referral.no_friends')} />
            </>
        ) : (
            lastedFriends.map((data) => (
                <div key={data.userId} className="p-4 bg-gray-13 dark:bg-dark-2 rounded-xl">
                    <div className="flex gap-2 mb-6">
                        <BxsUserCircle />
                        <p className="font-semibold">
                            {t('reference:referral.new_friend')}: {data.code}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                <span>Nami ID </span>
                                <span className="text-xs">({t('reference:referral:referrer')})</span>
                            </span>
                            <span className="float-right text-teal font-semibold">{data.code}</span>
                        </div>
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral:level')}</span>
                            <span className="float-right">{data.level}</span>
                        </div>
                        <div>
                            <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral:ranking')}</span>
                            <span className="float-right">{tier[data.rank][language]}</span>
                        </div>
                    </div>
                </div>
            ))
        );
    }, [lastedFriends]);

    const renderLastedCommissions = useMemo(() => {
        return !lastedCommissions.length ? (
            <>
                <NoData className="my-20" text={t('reference:referral.no_commission')} />
            </>
        ) : (
            lastedCommissions.map((data, index) => (
                <div key={index}>
                    <div className="flex flex-col gap-1">
                        <div className="flex w-full justify-between items-center font-semibold leading-6">
                            <div>
                                {data.formUserCode} ({t('reference:referral.level')} {data.level < 10 ? 0 : null}
                                {data.level})
                            </div>
                            <div className="text-teal">+{formatNumber(data.value, 2)} VNDC</div>
                        </div>
                        <div className="flex w-full justify-between items-center text-txtSecondary dark:text-txtSecondary-dark text-sm">
                            <div>{formatTime(data.createdAt, 'dd/MM/yyyy HH:mm:ss')}</div>
                            <div>
                                {t('reference:referral.type')}: <span className="capitalize">{data.kind?.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        );
    }, [lastedCommissions]);

    return (
        <div className="flex gap-8 w-full" id={id}>
            <RefCard wrapperClassName="!py-6 px-8 w-full max-h-[624px]" isBlack={theme === THEME_MODE.DARK}>
                <div className="font-semibold text-[22px] leading-7 py-3 mb-6">{t('futures:mobile.commission')}</div>
                <div className="max-h-[calc(624px-124px)] overflow-y-auto pr-5 -mr-5 space-y-8">{renderLastedCommissions}</div>
            </RefCard>
            <RefCard wrapperClassName="!py-6 px-8 w-full max-h-[624px]" isBlack={theme === THEME_MODE.DARK}>
                <div className="font-semibold text-[22px] leading-7 py-3 mb-6">{t('reference:referral.new_friends')}</div>
                <div className="max-h-[calc(624px-124px)] overflow-y-auto pr-5 -mr-5 space-y-8">{renderNewFriends}</div>
            </RefCard>
        </div>
    );
};

export default Commission;
