import { BxsInfoCircle } from 'components/svg/SvgIcon';

const DarkNote = ({ iconClassName = '', labelClassName = '', title, ...props }) => (
    <div className="flex font-semibold items-center space-x-2 text-xs text-gray-1 dark:text-gray-7">
        <BxsInfoCircle size={16} fill={'currentColor'} fillInside={'currentColor'} />
        <span className={labelClassName}>{title}</span>
    </div>
);

export default DarkNote;
