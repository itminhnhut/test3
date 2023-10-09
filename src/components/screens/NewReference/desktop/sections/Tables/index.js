import { useCallback } from 'react';

import InputV2 from 'components/common/V2/InputV2';
import SelectV2 from 'components/common/V2/SelectV2';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import dynamic from 'next/dynamic';

const FriendList = dynamic(() => import('components/screens/NewReference/desktop/sections/Tables/FriendList'), { ssr: false });
const CommissionHistory = dynamic(() => import('components/screens/NewReference/desktop/sections/Tables/CommissionHistory'), { ssr: false });

import { Search } from 'react-feather';

import { CheckCircleIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import AssetFilter from 'components/screens/TransactionHistory/TransactionFilter/AssetFilter';

const Tables = ({ language, t, commisionConfig, id1, id2 }) => {
    return (
        <div className="flex flex-col gap-8">
            <FriendList language={language} t={t} commisionConfig={commisionConfig} id={id1} />
            <CommissionHistory t={t} commisionConfig={commisionConfig} id={id2} />
        </div>
    );
};

export const TableFilter = ({ config, filter, setFilter, resetParentCode, type, resetPagination }) => {
    const DatePicker = ({ item, filter, key }) => {
        const data = filter?.[key] || {};
        return (
            <DatePickerV2
                month={item.months ?? 2}
                hasShadow
                initDate={data?.value}
                wrapperClassname="!w-full !h-11"
                colorX="#8694b2"
                wrapperClassNameDate={item.wrapperDate}
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

    const Select = ({ item, filter, key }) => {
        const data = filter?.[key] || {};
        return (
            <SelectV2
                name="customer"
                keyExpr="value"
                popoverPanelClassName="top-auto"
                className={classNames(item.selectClassName)}
                value={data?.value || item.values[0]?.value}
                options={item.values}
                popoverClassName="min-w-[240px] w-full"
                onChange={(e) => onChange(e, key)}
                activeIcon={<CheckCircleIcon color="currentColor" size={16} />}
                wrapperClassName="flex flex-row gap-3 flex-col py-4"
                optionClassName="flex flex-row items-center justify-between text-gray-1 dark:text-gray-4 text-base py-3 hover:bg-dark-13 dark:hover:bg-hover-dark"
            />
        );
    };

    const onChangeAsset = (key, value) => {
        resetPagination?.();
        setFilter((old) => ({ ...old, [key]: { ...old[key], value } }));
    };
    const AssetFilterFunc = ({ item, filter, key }) => {
        const data = filter?.[key] || {};
        // only use when setFilter is React setState function due to useCallback cache
        return (
            <AssetFilter
                showLableIcon={item?.showLableIcon ?? true}
                hasOptionAll={item?.hasOptionAll ?? true}
                title={item?.title}
                asset={data.value}
                labelClassName="hidden"
                className={item.className}
                setAsset={(value) => onChangeAsset(key, value)}
            />
        );
    };

    const Reset = ({ item }) => {
        return (
            <ButtonV2 onClick={() => setFilter(config)} variants="reset" className={classNames(item?.buttonClassName)}>
                {item.title}
            </ButtonV2>
        );
    };

    const ListFilter = {
        dateRange: (data) => DatePicker(data),
        input: (data) => Input(data),
        select: (data) => Select(data),
        reset: (data) => Reset(data),
        assetFilter: (data) => AssetFilterFunc(data)
    };

    const onChange = (value, key) => {
        setFilter({
            ...filter,
            [key]: { ...filter[key], value }
        });
        if (key === 'search') {
            resetParentCode();
        }
        resetPagination?.();
    };

    const renderFilter = useCallback(
        (item, key) => {
            return ListFilter[item.type] && ListFilter[item.type].call(this, { item, filter, key });
        },
        [filter]
    );
    const filterArray = Object.keys(config || []);
    return filterArray.map((key) => (
        <div className={`flex flex-col items-start w-auto ${config[key]?.childClassName || ''}`} key={key}>
            <div
                className={classNames('text-txtSecondary dark:text-txtSecondary-dark mb-2 text-sm', {
                    hidden: config[key].label === '',
                    'text-xs': type === 'history'
                })}
            >
                {config[key].label}
            </div>
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
