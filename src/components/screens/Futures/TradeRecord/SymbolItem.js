import { useTranslation } from 'next-i18next';
import { FuturesOrderEnum } from 'redux/actions/const';
import { TypeTable } from 'redux/actions/utils';
import FuturesLeverage from 'components/common/FuturesLeverage'

const FuturesRecordSymbolItem = ({ symbol, leverage, type, side, onShareModal }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col justify-center whitespace-nowrap gap-1">
            <div className="flex gap-3">
                <div className="font-semibold text-sm">{symbol}</div>
                <div className="flex gap-2">
                    {leverage && <FuturesLeverage value={leverage} />}
                    <div onClick={onShareModal}>✿</div>
                </div>
            </div>
            <div className={`${side === FuturesOrderEnum.Side.BUY ? 'text-teal' : 'text-red'} font-normal text-xs`}>
                {side && <TypeTable type="side" data={{ side }} />}&nbsp;/&nbsp;{type && <TypeTable type="type" data={{ type }} />}
            </div>
        </div>
    );
};

export default FuturesRecordSymbolItem
