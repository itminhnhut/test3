import { useTranslation } from 'next-i18next';
import { FuturesOrderEnum } from 'redux/actions/const';
import { TypeTable } from 'redux/actions/utils';
import FuturesLeverage from 'components/common/FuturesLeverage'
import { ShareIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const FuturesRecordSymbolItem = ({ symbol, leverage, type, side, onShareModal, specialOrder, onSymbolClick, canShare = false}) => {
    const [currentTheme] = useDarkMode();

    const isDark = currentTheme === THEME_MODE.DARK;

    return (
        <div className="flex flex-col justify-center whitespace-nowrap gap-1 h-full">
            <div className="flex gap-3">
                <div className="font-semibold text-sm text-txtPrimary dark:text-txtPrimary-dark" onClick={onSymbolClick}>{symbol}</div>
                <div className="flex gap-2">
                    {leverage && <FuturesLeverage value={leverage} />}
                    {canShare ? <div onClick={onShareModal}><ShareIcon color={isDark ? '#e2e8f0' : '#1e1e1e'} /></div> : null}
                </div>
            </div>
            <div className={`${side === FuturesOrderEnum.Side.BUY ? 'text-green-3 dark:text-teal' : 'text-red-2 dark:text-red'} font-normal text-xs`}>
                {specialOrder ? `${specialOrder} / ` : null}{side && <TypeTable type="side" data={{ side }} />}&nbsp;/&nbsp;{type && <TypeTable type="type" data={{ type }} />}
            </div>
        </div>
    );
};

export default FuturesRecordSymbolItem
