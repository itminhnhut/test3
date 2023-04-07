import classNames from 'classnames';
import { BxsInfoCircle } from 'components/svg/SvgIcon';

const DarkNote = ({ className = '', iconClassName = '', labelClassName = '', variants = 'primary', title = '' }) => (
    <div
        className={classNames(
            'flex items-center space-x-2',
            {
                'text-gray-15 dark:text-gray-4 text-base font-semibold': variants === 'primary',
                'text-gray-1 dark:text-gray-7 text-xs': variants === 'secondary'
            },
            className
        )}
    >
        <BxsInfoCircle size={16} fill={'currentColor'} fillInside={'currentColor'} />
        <span className={labelClassName}>{title}</span>
    </div>
);

export default DarkNote;
