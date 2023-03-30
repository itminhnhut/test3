import { useTranslation } from 'next-i18next';
import { PartnerOrderStatus } from 'redux/actions/const';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import SvgCancelCircle from 'components/svg/CancelCircle';

import { BxsErrorAltIcon, CancelCircleFillIcon } from 'components/svg/SvgIcon';
import Skeletor from './Skeletor';
import { isNull, isUndefined } from 'lodash';

const OrderStatusTag = ({ icon = true, className, status }) => {
    if(!status) return null;
    const { t } = useTranslation();

    const { PENDING, SUCCESS, REJECTED, DISPUTED } = PartnerOrderStatus;
    let type = '';
    let label = '';
    switch (status) {
        case PENDING:
            type = TYPES.WARNING;
            label = t('common:processing');
            break;
        case SUCCESS:
            type = TYPES.SUCCESS;
            label = t('common:success');
            break;
        case REJECTED:
            type = TYPES.FAILED;
            label = (
                <div className="flex items-center gap-x-2">
                    <CancelCircleFillIcon size={16} /> {t('common:denined')}
                </div>
            );
            break;
        case DISPUTED:
            type = TYPES.FAILED;
            label = (
                <div className="flex items-center gap-x-2">
                    <BxsErrorAltIcon size={16} /> {t('common:disputing')}
                </div>
            );
            break;
        default:
            break;
    }

    return (
        <TagV2 icon={icon} className={`ml-auto ${className}`} type={type}>
            {label}
        </TagV2>
    );
};

export default OrderStatusTag;
