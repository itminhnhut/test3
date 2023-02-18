import classNames from "classnames"
import { VndcFutureOrderType } from "components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType"

const OrderStatusLabel = ({ type, className, t }) => {
    let bgColor
    let textColor
    let content
    switch (type) {
        // lenh hoan tat
        case VndcFutureOrderType.ReasonCloseCode.HIT_SL:
        case VndcFutureOrderType.ReasonCloseCode.HIT_TP:
        case VndcFutureOrderType.ReasonCloseCode.LIQUIDATE: {
            bgColor = 'bg-teal/[0.1]'
            textColor = 'text-teal'
            content = t('futures:mobile:adjust_margin.order_completed')
            break;
        }

        // lenh huy
        case VndcFutureOrderType.ReasonCloseCode.PARTIAL_CLOSE:
        case VndcFutureOrderType.ReasonCloseCode.NORMAL: {
            bgColor = 'bg-divider-dark/[0.5]'
            textColor = 'text-darkBlue-5'
            content = t('futures:order_canceled')
            break;
        }
    }

    return <div className={classNames('px-4 py-1 font-normal text-sm rounded-[80px] text-center', bgColor, textColor, className)}>{content}</div>
}

export default OrderStatusLabel