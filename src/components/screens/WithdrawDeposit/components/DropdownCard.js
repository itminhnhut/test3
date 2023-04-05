import React, { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import NoData from 'components/common/V2/TableV2/NoData';
import ChevronDown from 'components/svg/ChevronDown';
import classNames from 'classnames';
import PopoverSelect from './common/PopoverSelect';
import InfoCard from './common/InfoCard';
import Spinner from 'components/svg/Spinner';

const DropdownCard = ({
    loading,
    loadingList,
    containerClassname,
    disabled,
    label,
    selected,
    search,
    imgSize,
    setSearch,
    data,
    onSelect,
    additionalActions,
    showDropdownIcon = true
}) => {
    const cardRef = useRef(null);
    const [isVisible, setVisible] = useState(false);
    useClickAway(cardRef, () => {
        if (isVisible) {
            setVisible(false);
        }
    });
    return (
        <PopoverSelect
            ref={cardRef}
            open={isVisible}
            containerClassname={{ [containerClassname]: isVisible }}
            hasSearchBox
            label={
                <div className="bg-gray-12  dark:bg-dark-2 px-4 py-6 rounded-xl w-full">
                    <div className="txtSecond-2 mb-4"> {label}</div>
                    <button
                        disabled={disabled || loading || loadingList}
                        className="w-full disabled:cursor-default cursor-pointer text-left"
                        onClick={() => {
                            setVisible((prev) => !prev);
                        }}
                    >
                        <InfoCard
                            loading={loading}
                            content={selected.content}
                            emptyContent={selected.emptyContent}
                            imgSize={imgSize}
                            endIcon={
                                loadingList ? (
                                    <Spinner size={20} color="currentColor" />
                                ) : showDropdownIcon ? (
                                    <ChevronDown className={classNames({ 'rotate-0': isVisible })} color="currentColor" size={24} />
                                ) : null
                            }
                        />
                    </button>
                </div>
            }
            value={search}
            onChange={(value) => setSearch(value)}
        >
            {loadingList ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Spinner size={60} color="currentColor" />
                </div>
            ) : !data || !data.length ? (
                <NoData isSearch />
            ) : (
                <>
                    <div className="space-y-3 w-full overflow-y-auto max-h-[300px]">
                        {data?.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => {
                                    if (onSelect) {
                                        onSelect(item);
                                        setVisible(false);
                                    }
                                }}
                                disabled={selected?.id === item?._id}
                                className={classNames('p-3 w-full text-left disabled:cursor-default  transition', {
                                    'cursor-pointer hover:bg-hover-1 dark:hover:bg-hover-dark': Boolean(onSelect),
                                    '!cursor-default': !Boolean(onSelect)
                                })}
                            >
                                {selected.item(item)}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {additionalActions}
        </PopoverSelect>
    );
};

export default DropdownCard;
