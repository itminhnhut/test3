import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { isFunction } from 'redux/actions/utils';
import { BxsInfoCircle, TimeLapseIcon, BxsErrorIcon, CancelIcon } from 'components/svg/SvgIcon';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from 'redux/actions/withdrawDeposit';

export const ORDER_TYPES = {
    CONFIRM: {
        icon: <BxsInfoCircle size={80} color="currentColor" />,
        title: 'Xác nhận giao dịch',
        description: 'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất.',
        showConfirm: true
    },
    TIMEOUT: {
        icon: <TimeLapseIcon size={80} />,
        title: 'Thời gian xử lý giao dịch sắp kết thúc',
        description:
            'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất. Nếu không, lệnh mua VNDC của bạn sẽ bị huỷ.',
        showConfirm: true
    },
    CANCEL_ORDER: {
        icon: <BxsErrorIcon size={80} />,
        title: 'Huỷ giao dịch.',
        description: 'Bạn có chắc chắn huỷ lệnh nạp VNDC?',
        showConfirm: true
    },
    REPORT: {
        icon: <BxsErrorIcon size={80} />,
        title: 'Khiếu nại',
        description: (displayingId) =>
            `Khiếu nại sẽ chuyển trạng thái của lệnh #${displayingId} sang trạng thái Đang tranh chấp, người dùng bắt buộc phải cung cấp các bằng chứng liên quan đến giao dịch như hình ảnh, tin nhắn,... `,
        showConfirm: true
    },
    ERROR: {
        icon: <CancelIcon size={80} />,
        title: 'Không thể thực hiện',
        description: (errorMsg) => errorMsg || `Bạn đã đạt giới hạn rút VNDC trong ngày. Vui lòng thử lại vào ngày mai, xin cảm ơn.`,
        showConfirm: false
    }
};

const OrderModal = () => {
    const { modal } = useSelector((state) => state.withdrawDeposit);
    const dispatch = useDispatch();

    return (
        <ModalV2
            isVisible={modal?.isVisible}
            wrapClassName=""
            onBackdropCb={!modal?.loading ? () => dispatch(closeModal()) : undefined}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            {modal?.type && (
                <div className="text-center ">
                    <div className="text-dominant flex justify-center mb-6">{modal.type.icon}</div>
                    <div className="txtPri-3 mb-4">{modal.type.title}</div>
                    <div className="txtSecond-2 mb-10">
                        {isFunction(modal.type.description) ? additionalData && modal.type.description(additionalData) : modal.type.description}
                    </div>
                    {modal.type.showConfirm && (
                        <ButtonV2 loading={modal.loading} disabled={modal.loading} onClick={() => modal?.confirmFunction?.()} className="transition-all">
                            Xác nhận
                        </ButtonV2>
                    )}
                </div>
            )}
        </ModalV2>
    );
};

export default OrderModal;
