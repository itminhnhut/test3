import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SwitchV2 from 'components/common/V2/SwitchV2';
import React, { useCallback, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import ModalEditDWConfig from './ModalEditDWConfig';
import { editPartnerConfig } from 'redux/actions/withdrawDeposit';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import classNames from 'classnames';

const ProfileSetting = ({ partner, t, loadingPartner, refetchPartner }) => {
    const [modal, setModal] = useState({
        isOpen: false,
        side: null
    });

    const [loading, setLoading] = useState(false);

    const onOpenModal = (side) => setModal({ isOpen: true, side });
    const onCloseModal = () => setModal({ isOpen: false, side: null });

    const onEditOrderConfig = async ({ side, min, max, status }) => {
        setLoading(true);
        try {
            const editResponse = await editPartnerConfig({ side, min, max, status });
            const isDeactivateSide = status === 0;
            const orderConfig = partner?.orderConfig?.[side?.toLowerCase()];

            if (editResponse && editResponse.status === ApiStatus.SUCCESS) {
                refetchPartner();
                if (min === orderConfig?.min && max === orderConfig?.max) {
                    toast({
                        text: t(`dw_partner:${isDeactivateSide ? 'de' : ''}activated_side`, { side: t(`common:${side?.toLowerCase()}`) }),
                        type: 'success'
                    });
                } else {
                    toast({
                        text: t('common:success'),
                        type: 'success'
                    });
                }
                onCloseModal();
            } else {
                toast({ text: t('common:feedback_sent_failed'), type: 'warning' });
            }
        } catch (error) {
            toast({ text: t('common:feedback_sent_failed'), type: 'warning' });
        } finally {
            setLoading(false);
        }
    };

    const editDWConfig = useCallback(
        ({ side, onOpenModal, onChange, loading }) => {
            const orderConfig = partner?.orderConfig?.[side?.toLowerCase()];

            return (
                <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] ">
                            {t(`dw_partner:${side.toLowerCase()}_transaction`)}
                        </div>
                        <SwitchV2
                            disabled={loading}
                            checked={orderConfig?.status === 1}
                            onChange={() => {
                                onChange({ side: side.toLowerCase(), status: orderConfig?.status === 1 ? 0 : 1, min: orderConfig?.min, max: orderConfig?.max });
                            }}
                        />
                    </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm mb-1">{t('dw_partner:order_vol_limit')}</div>
                    <div className="flex items-center justify-between">
                        <div className={classNames('flex items-center space-x-1')}>
                            <span className={classNames('text-dominant ')}>{formatNumber(orderConfig?.min)}</span>
                            <span>-</span>
                            <span className={classNames('text-dominant ')}>{formatNumber(orderConfig?.max)} </span>
                            <span>VND</span>
                        </div>
                        <ButtonV2 onClick={() => onOpenModal(side)} className="disabled:!bg-transparent !w-auto !py-0 !h-auto" variants="text">
                            {t('common:edit')}
                        </ButtonV2>
                    </div>
                </div>
            );
        },
        [partner, t]
    );
    return (
        <div className="mt-20">
            <div className="mb-8 text-txtPrimary dark:text-txtPrimary-dark text-2xl font-semibold">{t('common:status')}</div>
            <div className="flex flex-wrap -m-3 items-center">
                <div className="p-3 w-full md:w-1/2">
                    {editDWConfig({ side: SIDE.BUY, onOpenModal, onChange: onEditOrderConfig, loading: loading || loadingPartner })}
                </div>
                <div className="p-3 w-full md:w-1/2">
                    {editDWConfig({ side: SIDE.SELL, onOpenModal, onChange: onEditOrderConfig, loading: loading || loadingPartner })}
                </div>
            </div>
            <ModalEditDWConfig
                partner={partner}
                isVisible={modal.isOpen}
                side={modal.side}
                loading={loading || loadingPartner}
                onConfirm={onEditOrderConfig}
                onClose={onCloseModal}
            />
        </div>
    );
};

export default ProfileSetting;
