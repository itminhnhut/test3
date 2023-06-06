import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import styled from 'styled-components';

const STATUSES = {
    ALL: 0,
    UPCOMING: 1,
    ONGOING: 2,
    ENDED: 3
};

const StatusFilter = styled.div`
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
`;

const EventList = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState({
        status: STATUSES.ALL
    });

    return (
        <div className="">
            <h1 className="font-semibold text-xl mb:text-4xl">{t('marketing_events:title')}</h1>
            <StatusFilter className="py-3 mb:py-6">
                {Object.keys(STATUSES).map((status, idx) => (
                    <button
                        type="BUTTON"
                        className={classNames(
                            'flex flex-col justify-center h-full px-4 text-sm sm:text-base rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                            { '!border-teal bg-teal/10 !text-teal font-semibold': filter.status === idx }
                        )}
                    >
                        Futures VNDC
                    </button>
                ))}
            </StatusFilter>
        </div>
    );
};

export default EventList;
