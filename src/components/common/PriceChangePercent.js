import classNames from 'classnames';
import { formatNumber } from 'redux/actions/utils';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import { roundTo } from 'round-to';
import colors from 'styles/colors';

const PriceChangePercent = ({ priceChangePercent, className, ...props }) => (
    <div
        {...props}
        className={classNames(
            'flex items-center justify-end text-right text-dominant text-xs leading-4', //text-darkBlue-5 dark:text-darkBlue-5
            {
                '!text-red-2': priceChangePercent < 0
            },
            className
        )}
    >
        {priceChangePercent && (
            <ArrowDropDownIcon color={priceChangePercent > 0 ? colors.teal : colors.red2} size={16} className={`${priceChangePercent > 0 && 'rotate-180'}`} />
        )}

        {priceChangePercent ? formatNumber(roundTo(Math.abs(priceChangePercent) * 100, 2), 2, 2, true) + '%' : '--'}
    </div>
);

export default PriceChangePercent;
