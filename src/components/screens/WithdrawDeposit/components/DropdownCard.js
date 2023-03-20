import React, { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import NoData from 'components/common/V2/TableV2/NoData';
import ChevronDown from 'components/svg/ChevronDown';
import classNames from 'classnames';
import PopoverSelect from './common/PopoverSelect';
import InfoCard from './common/InfoCard';

const DropdownCard = ({ loading, containerClassname, disabled, label, selected, search, imgSize, setSearch, data, onSelect }) => {
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
            containerClassname={classNames(containerClassname)}
            label={
                <button
                    disabled={disabled || loading}
                    onClick={() => {
                        setVisible((prev) => !prev);
                    }}
                    className={classNames('bg-gray-12 disabled:cursor-default cursor-pointer text-left dark:bg-dark-2 px-4 py-6 rounded-xl w-full', {})}
                >
                    <div className="txtSecond-2 mb-4"> {label}</div>
                    <InfoCard
                        loading={loading}
                        content={selected.content}
                        imgSize={imgSize}
                        endIcon={<ChevronDown className={classNames({ 'rotate-0': isVisible })} color="currentColor" size={24} />}
                    />
                </button>
            }
            value={search}
            onChange={(value) => setSearch(value)}
        >
            <div className="space-y-3 w-full overflow-y-auto max-h-[300px]">
                {loading ? (
                    <>
                        <InfoCard loading />
                        <InfoCard loading />
                        <InfoCard loading />
                        <InfoCard loading />
                    </>
                ) : !data || !data.length ? (
                    <NoData />
                ) : (
                    data?.map((item) => (
                        <button
                            key={item._id}
                            onClick={() => {
                                onSelect(item);
                                setVisible(false);
                            }}
                            disabled={selected?.id === item?._id}
                            className={classNames(
                                'p-3 w-full text-left disabled:cursor-default cursor-pointer hover:bg-hover-1 dark:hover:bg-hover-dark transition'
                            )}
                        >
                            {selected.item(item)}
                        </button>
                    ))
                )}
            </div>
        </PopoverSelect>
    );
};

export default DropdownCard;
