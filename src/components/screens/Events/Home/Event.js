import React, { useEffect } from 'react';
import EventCarousel from './EventCarousel';
import EventList from './EventList';

const Event = () => {
    return (
        <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto mb:pb-[7.5rem] pb-20 pt-0 px-4 v3:px-0">
            <div className="py-4 mb:pt-12">
                <EventCarousel />
            </div>
            <div className="pt-4 mb:pt-12">
                <EventList />
            </div>
        </div>
    );
};

export default Event;
