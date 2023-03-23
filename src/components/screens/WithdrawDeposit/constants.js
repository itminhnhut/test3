import { TYPES } from 'components/common/V2/TagV2';
import { PartnerOrderStatus } from 'redux/actions/const';

export const TABS = [
    {
        key: 0,
        localized: 'Tất cả'
    },
    {
        key: 1,
        localized: 'Thành công',
        status: PartnerOrderStatus.SUCCESS,
        type: TYPES.SUCCESS
    },
    {
        key: 2,
        localized: 'Đang xử lý',
        status: PartnerOrderStatus.PENDING,
        type: TYPES.WARNING
    },
    {
        key: 3,
        localized: 'Đã từ chối',
        status: PartnerOrderStatus.REJECTED,
        type: TYPES.FAILED
    },
    {
        key: 4,
        localized: 'Đang tranh chấp',
        status: PartnerOrderStatus.DISPUTED,
        type: TYPES.FAILED
    }
];

export const data = [
    {
        _id: '62033c410d1ede70d3c62bc9',
        status: 1,
        userStatus: 1,
        partnerStatus: 1,
        displayingId: '455HPC',
        userId: 583079,
        side: 'BUY',
        baseQty: 100000,
        baseAssetId: 72,
        quoteQty: 100000,
        quoteAssetId: 24,
        price: 1,
        partnerUserId: 18,
        from: {
            name: 'Nguyễn Đức Trung',
            code: 'Nami88888888888'
        },
        to: {
            name: 'NGUYEN DUC TRUNG',
            code: 'Nami852TPE2694'
        },
        amount: 2000000,
        currency: 72,
        created_at: '2022-02-09T04:00:01.076Z',
        updatedAt: '2022-02-09T04:00:51.111Z'
    }
];
