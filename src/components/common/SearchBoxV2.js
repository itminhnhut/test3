import { Search } from 'react-feather';
import { useTranslation } from 'next-i18next';
import { CloseIcon } from 'components/svg/SvgIcon';

const SearchBoxV2 = ({ wrapperClassname = '', inputClassname = '', value, onChange, onFocus, width, placeholder }) => {
    const { t } = useTranslation();

    return (
        <div
            className={
                'p-3 w-full flex items-center rounded-md bg-gray-10 dark:bg-dark-2 border border-transparent focus-within:border-teal ' + wrapperClassname
            }
        >
            <Search size={width && width >= 768 ? 20 : 16} className="text-txtSecondary dark:text-txtSecondary-dark" />
            <input
                className={
                    'text-sm md:text-base font-normal w-full px-2 text-txtPrimary dark:text-txtPrimary-dark placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark ' +
                    inputClassname
                }
                value={value}
                onChange={(e) => {
                    onChange(e?.target?.value);
                }}
                placeholder={placeholder || t('common:search')}
                onFocus={onFocus}
            />
            <CloseIcon
                size={width ? (width >= 768 ? 20 : 16) : 20}
                className={`cursor-pointer ${value ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => onChange('')}
            />
        </div>
    );
};

export default SearchBoxV2;
