import { FEE_TABLE } from 'constants/constants';
import { formatNumber } from 'redux/actions/utils';

export default function ExchangeFeeMobileList({ t }) {
    return <div className='divide-y divide-divider dark:divide-divider-dark space-y-8'>
        {FEE_TABLE.map(item => {
            return <div key={item.level} className='pt-8'>
                <div className='flex justify-between mb-6'>
                    <div>
                        <p className='text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1'>{t('common:fee_level')}</p>
                        <span className='font-semibold'>VIP {item.level}</span>
                    </div>
                    <div>
                        <p className='text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1'>NAMI</p>
                        <span
                            className='font-semibold'>≥ {formatNumber(item.nami_holding, 0)} NAMI</span>
                    </div>
                </div>

                <div className='flex justify-between items-center text-sm mb-3'>
                    <div className='text-txtSecondary dark:text-txtSecondary-dark'>Maker/Taker</div>
                    <div>{item.maker_taker}</div>
                </div>

                <div className='flex justify-between items-center text-sm'>
                    <div className='text-txtSecondary dark:text-txtSecondary-dark'>
                        <span>Maker/Taker </span>
                        <span
                            className='text-teal whitespace-nowrap'>({t('fee-structure:use_asset_deduction', {
                            value: '25%',
                            asset: 'NAMI'
                        })})</span>
                    </div>
                    <p className='whitespace-nowrap'>{item.maker_taker_deducted}</p>
                </div>
            </div>;
        })}
    </div>;
};

