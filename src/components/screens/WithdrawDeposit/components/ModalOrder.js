import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { isFunction } from 'redux/actions/utils';
import classNames from 'classnames';
import { ORDER_TYPES } from '../constants';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const ModalOrder = ({ mode, isVisible, onClose, loading, type = ORDER_TYPES.CONFIRM, additionalData, onConfirm }) => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <ModalV2
            // isVisible={true}
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            {type && (
                <div className="text-center ">
                    <div className="text-dominant flex justify-center mb-6">{type.icon}</div>
                    <div className="txtPri-3 mb-4">{type.title(t, mode)}</div>
                    <div className="txtSecond-2 ">{type.description({ ...additionalData, mode , t})}</div>
                    {type.showConfirm && isFunction(type.showConfirm) ? (
                        type.showConfirm(router, t)
                    ) : (
                        <ButtonV2 loading={loading} disabled={loading} onClick={!onConfirm ? onClose : () => onConfirm?.()} className="transition-all mt-10">
                            {t('common:confirm')}
                        </ButtonV2>
                    )}
                </div>
            )}
        </ModalV2>
    );
};

export default ModalOrder;
