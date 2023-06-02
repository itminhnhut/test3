import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { IconSearch } from 'src/components/common/Icons';
import { X } from 'react-feather';
import colors from 'styles/colors';
import classNames from 'classnames';

const SearchInput = ({ placeholder, customStyle, handleFilterCategoryList, handleFilterAssetsList, customWrapperStyle, parentState }) => {
    const [debouncedValue, setDebouncedValue] = useState('');
    const [queryFilter, setQueryFilter] = useState('');
    const [focus, setFocus] = useState(false);

    useDebounce(
        () => {
            setDebouncedValue(queryFilter);
        },
        600,
        [queryFilter]
    );

    useEffect(() => {
        if (handleFilterCategoryList && typeof handleFilterCategoryList === 'function') {
            handleFilterCategoryList(debouncedValue);
        }
        if (handleFilterAssetsList && typeof handleFilterAssetsList === 'function') {
            handleFilterAssetsList(debouncedValue);
        }
    }, [debouncedValue]);

    const onChange = (value) => {
        setQueryFilter(value);
        if (parentState) parentState(value);
    };

    return (
        <div className="w-full" style={customWrapperStyle}>
            <div
                className={classNames('bg-bgInput dark:!bg-dark-2 border border-transparent px-3 flex items-center justify-between h-11 sm:h-12 rounded-md', {
                    '!border-teal': focus
                })}
            >
                <div className="flex items-center space-x-2 h-full w-full">
                    <span className="text-txtSecondary flex items-center">
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        placeholder={placeholder}
                        onChange={({ currentTarget }) => onChange(currentTarget.value)}
                        value={queryFilter}
                        className="bg-transparent text-txtPrimary dark:text-white text-sm sm:text-base h-full w-full"
                        style={customStyle}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                    />
                </div>
                {queryFilter && <X className="cursor-pointer" size={16} color={colors.darkBlue5} onClick={() => onChange('')} />}
            </div>
        </div>
    );
};

export default SearchInput;
