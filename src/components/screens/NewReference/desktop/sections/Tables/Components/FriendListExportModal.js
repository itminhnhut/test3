import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

const FriendListExportModal = ({ show = false, onClose = () => {} }) => {
    const { t } = useTranslation();
    const [refRange, setRefRange] = useState({
        startDate: null,
        endDate: new Date(),
        key: 'selection'
    });
    const [commissionRange, setCommisionRange] = useState({
        startDate: null,
        endDate: new Date(),
        key: 'selection'
    });

    return (
        <ModalV2 isVisible={show} className="w-[30.5rem] overflow-auto" onBackdropCb={onClose}>
            <h3 className="text-2xl mb-6 font-semibold">{t('reference:friend_list.filter.export')}</h3>
            <div className="mt-6">
                <label className="text-txtSecondary dark:text-txtSecondary-dark text-sm mb-2" htmlFor="">
                    {t('reference:friend_list.filter.referral_date')}
                </label>
                <DatePickerV2
                    date={refRange}
                    onChange={(e) =>
                        setRefRange({
                            startDate: e?.selection?.startDate ?? null,
                            endDate: e?.selection?.endDate ?? null,
                            key: 'selection'
                        })
                    }
                    month={1}
                />
            </div>
            <div className="mt-6">
                <label className="text-txtSecondary dark:text-txtSecondary-dark text-sm mb-2" htmlFor="">
                    {t('reference:friend_list.filter.total_commissions')}
                </label>
                <DatePickerV2
                    date={commissionRange}
                    onChange={(e) =>
                        setCommisionRange({
                            startDate: e?.selection?.startDate ?? null,
                            endDate: e?.selection?.endDate ?? null,
                            key: 'selection'
                        })
                    }
                    month={1}
                />
            </div>
        </ModalV2>
    );
};

export default FriendListExportModal;
