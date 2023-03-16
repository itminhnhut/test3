export const listTimeFilter = [
    { localized: 'common:global_label:time:week', value: 1 },
    { localized: 'common:global_label:time:1month', value: 2 },
    { localized: 'common:global_label:time:all', value: 3 }
];

const GroupFilterTime = ({ className = '', curFilter = listTimeFilter[0]?.value, setCurFilter, GroupKey, t }) => {
    return (
        <div className={`flex items-center gap-3 md:gap-4 text-sm md:text-base font-normal text-gray-1 dark:text-gray-7 ${className}`}>
            {listTimeFilter.map((item) => (
                <button
                    key={GroupKey + 'filter_' + item?.value}
                    onClick={() => setCurFilter(item?.value)}
                    className={curFilter === item?.value && 'text-green-3 dark:text-green-2 font-semibold'}
                >
                    {t(`${item.localized ? item.localized : item.title}`)}
                </button>
            ))}
        </div>
    );
};
export default GroupFilterTime;
