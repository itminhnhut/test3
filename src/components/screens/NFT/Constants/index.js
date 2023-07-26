const LIST_CATEGORY = [
    {
        name: { vi: 'Tất cả', en: 'All' },
        active: 'all'
    },
    {
        name: { vi: 'Bộ sưu tập của tôi', en: 'My collection' },
        active: 'me'
    }
];

const LIST_TIER = [
    {
        name: { vi: 'Bình thường', en: 'Common' },
        active: 'C',
        key: 'normal'
    },
    {
        name: { vi: 'Hiếm', en: 'Rate' },
        active: 'R',
        key: 'rate'
    },
    {
        name: { vi: 'Siêu hiếm', en: 'Epic' },
        active: 'SR',
        key: 'super'
    },
    {
        name: { vi: 'Cực hiếm', en: 'Legendary' },
        active: 'UR',
        key: 'extremely'
    },
    {
        name: { vi: 'Tối thượng', en: 'Mythic' },
        active: 'UL',
        key: 'supreme'
    }
];

const TABS = [
    { label: 'NFT', value: 2 },
    { label: 'Voucher', value: 1 }
];

const STATUS = {
    0: { key: 'not_active', vi: 'Chưa kích hoạt', en: 'Not activated' },
    1: { key: 'active', vi: 'Đã kích hoạt', en: 'activated' },
    2: { key: 'used', vi: 'Đã sử dụng', en: 'used' }
};

export { LIST_CATEGORY, LIST_TIER, TABS, STATUS };
