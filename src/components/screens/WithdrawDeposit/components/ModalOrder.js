import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { isFunction } from 'redux/actions/utils';
import { BxsInfoCircle, TimeLapseIcon, BxsErrorIcon, CancelIcon,CheckCircleIcon } from 'components/svg/SvgIcon';
import classNames from 'classnames';

export const ORDER_TYPES = {
    CONFIRM: {
        icon: <BxsInfoCircle size={80} color="currentColor" />,
        title: 'Xác nhận giao dịch',
        description: 'Nếu bạn đã chuyển đủ số lượng với thông tin chuyển khoản chính xác, vui lòng xác nhận để đối tác thanh toán cho bạn nhanh nhất.',
        showConfirm: true
    },
    SUCCESS: {
        icon: <CheckCircleIcon size={80} color="currentColor" />,
        title: 'Xác nhận thành công',
        description: 'Bạn đã chuyển thành công +100,000 VNDC vào tài khoản đối tác cho giao dịch 797ECB',
        showConfirm: false
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
        description: (token) => `Bạn có chắc chắn huỷ lệnh nạp ${token}?`,
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

const ModalOrder = ({ isVisible, onClose, loading, type = ORDER_TYPES.CONFIRM, additionalData, onConfirm }) => {
    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            {type && (
                <div className="text-center ">
                    <div className="text-dominant flex justify-center mb-6">{type.icon}</div>
                    <div className="txtPri-3 mb-4">{type.title}</div>
                    <div className="txtSecond-2 ">
                        {isFunction(type.description) ? additionalData && type.description(additionalData) : type.description}
                    </div>
                    {type.showConfirm && (
                        <ButtonV2 loading={loading} disabled={loading} onClick={() => onConfirm?.()} className="transition-all mt-10">
                            Xác nhận
                        </ButtonV2>
                    )}
                </div>
            )}
        </ModalV2>
    );
};

export default ModalOrder;
