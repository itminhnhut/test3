import React, { useState } from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useTranslation } from 'next-i18next';
import { TIME_FILTER } from '../../constants';
import classNames from 'classnames';
import CardWrapper from 'components/common/CardWrapper';
import SessionGeneral from './SessionGeneral';

const TabStatistic = () => {
    return (
        <div>
            <SessionGeneral />
        </div>
    );
};

export default TabStatistic;
