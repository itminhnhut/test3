import { useCallback } from 'react';

import InputV2 from 'components/common/V2/InputV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';

import dynamic from 'next/dynamic';

const FriendList = dynamic(() => import('components/screens/NewReference/desktop/sections/Tables/FriendList'), { ssr: false });
const CommissionHistory = dynamic(() => import('components/screens/NewReference/desktop/sections/Tables/CommissionHistory'), { ssr: false });

import { Search } from 'react-feather';

import classNames from 'classnames';
import PropTypes from 'prop-types';

const Tables = ({ language, t, commisionConfig, id1, id2 }) => {
    return (
        <div className="flex flex-col gap-8">
            <FriendList language={language} t={t} commisionConfig={commisionConfig} id={id1} />
            <CommissionHistory t={t} commisionConfig={commisionConfig} id={id2} />
        </div>
    );
};

export const TableFilter = ({ config, filter, setFilter, resetParentCode }) => {
    const DatePicker = ({ item, filter, key }) => {
        const data = filter?.[key] || {};
        return (
            <DatePickerV2
                month={2}
                hasShadow
                initDate={data?.value}
                wrapperClassname="!w-full !h-12"
                colorX="#8694b2"
                position={item?.position || 'center'}
                onChange={(e) => onChange(e?.selection, key)}
            />
        );
    };
    const Input = ({ item, filter, key }) => {
        const data = filter?.[key] || {};
        return (
            <InputV2
                allowClear
                value={data?.value || ''}
                placeholder={item?.placeholder}
                onChange={(e) => onChange(e, key)}
                className={classNames('w-full tracking-[0.005em] pb-0')}
                classNameInput="!placeholder-gray-1 dark:!placeholder-gray-7"
                prefix={<Search strokeWidth={2} className="text-gray-1 w-4 h-4" />}
            />
        );
    };

    const Reset = ({ item }) => {
        return (
            <button
                onClick={() => setFilter(config)}
                className="whitespace-nowrap !bg-dark-12 dark:!bg-dark-2 hover:bg-gray-6 text-gray-1 dark:hover:bg-dark-5 dark:text-gray-7
                        px-4 rounded-md px-auto py-auto font-semibold h-12"
            >
                {item.title}
            </button>
        );
    };

    const ListFilter = {
        dateRange: (data) => DatePicker(data),
        input: (data) => Input(data),
        reset: (data) => Reset(data)
    };

    const onChange = (value, key) => {
        setFilter({
            ...filter,
            [key]: { ...filter[key], value }
        });
        if (key === 'search') {
            resetParentCode();
        }
    };

    const renderFilter = useCallback(
        (item, key) => {
            return ListFilter[item.type] && ListFilter[item.type].call(this, { item, filter, key });
        },
        [filter]
    );
    const filterArray = Object.keys(config || []);
    return filterArray.map((key) => (
        <div className={`flex flex-col items-start justify-end w-auto ${config[key]?.childClassName || ''}`} key={key}>
            <div className="text-txtSecondary dark:text-txtSecondary-dark mb-3 text-sm">{config[key].label}</div>
            {renderFilter(config[key], key)}
        </div>
    ));
};

const propTypes = {
    introduced_on: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.shape({
            startDate: PropTypes.any,
            endDate: PropTypes.any,
            key: PropTypes.string
        }),
        values: PropTypes.any,
        title: PropTypes.string,
        position: PropTypes.string,
        childClassName: PropTypes.string
    }),
    total_commissions: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.shape({
            startDate: PropTypes.any,
            endDate: PropTypes.any,
            key: PropTypes.string
        }),
        values: PropTypes.any,
        title: PropTypes.string,
        childClassName: PropTypes.string
    }),
    search: PropTypes.shape({
        type: PropTypes.string,
        value: PropTypes.any,
        title: PropTypes.string,
        placeholder: PropTypes.string,
        childClassName: PropTypes.string
    }),
    reset: PropTypes.shape({
        type: PropTypes.string
    })
};

TableFilter.propTypes = {
    config: PropTypes.shape(propTypes),
    filter: PropTypes.shape(propTypes),
    setFilter: PropTypes.func,
    resetSearchByCode: PropTypes.func
};

export default Tables;
