import React, { useRef, useState } from 'react';
import PopoverSelect from './PopoverSelect';
import AssetLogo from '../../wallet/AssetLogo';
import DatePicker from 'components/common/DatePicker/DatePicker';
import classNames from 'classnames';

const TransactionFilter = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="flex w-full">
            <AssetFilter />

            <DatePicker
                date={filter.range}
                onChange={(e) =>
                    setFilter({
                        range: {
                            startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                            endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                            key: 'selection'
                        }
                    })
                }
                month={2}
                hasShadow
                text={
                    <div onClick={() => setTimeTab('custom')} className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {})}>
                        {t('reference:referral.custom')}
                    </div>
                }
            />
        </div>
    );
};

const AssetFilter = ({ search, setSearch }) => {
    const popoverRef = useRef(null);

    return (
        <div className="text-txtSecondary dark:text-txtSecondary-dark w-full max-w-[240px]">
            <div className="text-xs mb-3">Loại tài sản</div>
            <div>
                <PopoverSelect
                    className="min-w-[400px] rounded-xl !left-0 !translate-x-0"
                    labelValue={'Loại tài sản'}
                    ref={popoverRef}
                    value={search}
                    onChange={(value) => setSearch(value)}
                >
                    {[...Array(10).keys()].map((e) => (
                        <div key={e} className="flex items-center px-4 py-3 space-x-2">
                            <AssetLogo size={24} assetCode={'BNB'} />
                            <div className="text-txtPrimary dark:text-txtPrimary-dark">BNB</div>

                            <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">Avocado DAO token</div>
                        </div>
                    ))}
                </PopoverSelect>
            </div>
        </div>
    );
};

export default TransactionFilter;
