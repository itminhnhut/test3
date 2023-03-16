import React from 'react';
import InfoCard from './InfoCard';
import ChevronDown from 'components/svg/ChevronDown';

const SelectCard = ({ title, info }) => {
    return (
        <div className="bg-gray-12 dark:bg-dark-2 px-4 py-6 rounded-xl">
            <div className="txtSecond-2 mb-4">{title}</div>
            <InfoCard mainContent={info.name} subContent={info.subInfo} endIcon={<ChevronDown color="currentColor" size={24} />} />
        </div>
    );
};

export default SelectCard;
