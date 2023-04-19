import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import RatingStars from 'components/common/V2/RatingStars';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { ApiStatus, DefaultAvatar } from 'redux/actions/const';
import { ratingOrder } from 'redux/actions/withdrawDeposit';
import toast from 'utils/toast';

const ModalRating = ({ isVisible, onClose, orderDetail }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const onRatingHandler = async (rating) => {
        try {
            setLoading(true);
            const data = await ratingOrder({ displayingId: orderDetail?.displayingId, rating });
            if (data && data?.status === ApiStatus.SUCCESS) {
                toast({ text: t('dw_partner:rating_modal.rated_success'), type: 'success' });
                onClose();
            } else {
                toast({ text: t('common:global_notice.unknown_error'), type: 'success' });
            }
        } catch (error) {
            toast({ text: t('common:global_notice.unknown_error'), type: 'success' });
        } finally {
            setLoading(false);
        }
    };
    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            {orderDetail && (
                <>
                    <div className="txtPri-3 mb-6">{t('dw_partner:rating_modal.title')}</div>
                    <div className="flex flex-col items-center mb-6">
                        <img src={orderDetail?.[`partnerMetadata`]?.avatar || DefaultAvatar} className="mb-4 w-20 h-20 rounded-full" />
                        <div className="txtPri-1 capitalize font-semibold mb-3">{orderDetail && orderDetail?.[`partnerMetadata`]?.name?.toLowerCase()}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="txtSecond-2 mb-4">{t('dw_partner:rating_modal.description')}</div>
                        <RatingStars>
                            {(hoverStars) => (
                                <div className="mt-10 w-full">
                                    <Button loading={loading} disabled={!hoverStars} onClick={() => onRatingHandler(hoverStars)}>
                                        {t('dw_partner:rating_modal.submit')}
                                    </Button>
                                </div>
                            )}
                        </RatingStars>
                    </div>
                </>
            )}
        </ModalV2>
    );
};

export default ModalRating;
