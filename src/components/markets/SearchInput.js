import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { IconSearch } from 'src/components/common/Icons';
import { log } from 'utils'

const SearchInput = ({ placeholder, customStyle, handleFilterCategoryList, handleFilterAssetsList, customWrapperStyle, parentState }) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    const [queryFilter, setQueryFilter] = useState('');

    useDebounce(
        () => {
            setDebouncedValue(queryFilter);
        },
        600,
        [queryFilter],
    );

    useEffect(() => {
        if (handleFilterCategoryList && typeof handleFilterCategoryList === 'function') {
            handleFilterCategoryList(debouncedValue);
        }
        if (handleFilterAssetsList && typeof handleFilterAssetsList === 'function') {
            handleFilterAssetsList(debouncedValue);
        }
    }, [debouncedValue]);

    return (
        <div className="form-group" style={customWrapperStyle}>
            <div className="input-group border-divider dark:border-divider-dark">
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={({ currentTarget }) => {
                        // log.d('Check input ____ ', currentTarget.value)
                        setQueryFilter(currentTarget.value)
                        parentState && parentState(currentTarget.value)
                    }}
                    value={queryFilter}
                    className="form-control form-control-sm bg-transparent text-txtPrimary dark:text-txtPrimary-dark"
                    style={customStyle}
                />

                <div
                    className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                >
                    <span className="input-group-text text-black-500">
                        <IconSearch />
                    </span>
                </div>
            </div>
        </div>

    );
};

export default SearchInput;
