import React, { useState } from 'react';
import SessionGeneral from './SessionGeneral';
import SessionChart from './SessionChart';

const TabStatistic = () => {
    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: null,
            interval: 'd',
            key: 'selection'
        }
    });
    return (
        <div>
            <SessionGeneral filter={filter} setFilter={setFilter} />
            <SessionChart filter={filter} setFilter={setFilter} />
        </div>
    );
};

export default TabStatistic;
