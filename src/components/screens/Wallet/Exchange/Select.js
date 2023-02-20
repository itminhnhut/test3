import useOutsideClick from 'hooks/useOutsideClick';
import ChevronDown from 'components/svg/ChevronDown';
import colors from 'styles/colors';
import classNames from 'classnames';
import { Search } from 'react-feather';
import { isFunction } from 'lodash';
import { useRef, useState } from 'react';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

export default function Select({
    children,
    content,
    value,
    contentClassName = '',
    label
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const refContent = useRef();
    const [currentTheme] = useDarkMode();

    useOutsideClick(refContent, () => setOpen(!open));

    return <div className='relative'>
        <div
            className='bg-gray-13 dark:bg-darkBlue-3 rounded-xl px-4 pt-5 pb-6 cursor-pointer select-none'
            onClick={() => setOpen(true)}
        >
            <p className='text-txtSecondary dark:text-txtSecondary-dark mb-2 leading-6'>{label ? label : null}</p>
            <div className='flex items-center justify-between'>
                {children}
                <ChevronDown
                    className={open ? 'rotate-0' : ''}
                    size={16}
                    color={currentTheme === THEME_MODE.DARK ? colors.gray['4'] : colors.darkBlue}
                />
            </div>
        </div>
        {
            open &&
            <div
                className={classNames(
                    'absolute z-10 inset-x-0 mt-2 flex flex-col bg-white py-4 space-y-6 max-h-[436px] min-h-[200px]',
                    'rounded-xl shadow-common overflow-hidden',
                    'bg-white nami-light-shadow',
                    'dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark ',
                    contentClassName
                )}
                ref={refContent}
            >
                <div className='px-4'>
                    <div className='bg-gray-10 dark:bg-dark-2 h-12 flex items-center px-3 rounded-md'>
                        <Search color={colors.darkBlue5} size={16} className='mr-2' />
                        <input
                            type='text'
                            value={search}
                            placeholder='Tìm kiếm'
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
                {isFunction(content) ? content({
                    search,
                    open,
                    setOpen,
                    value
                }) : content}
            </div>
        }
    </div>;
};
