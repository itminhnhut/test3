const LIST_CATEGORY = [
    {
        name: { vi: 'Tất cả', en: 'All' },
        active: 'all'
    },
    {
        name: { vi: 'Đã sở hữu', en: 'Owned' },
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
        name: { vi: 'Đặc biệt', en: 'Special' },
        active: 'S',
        key: 'rate'
    },
    {
        name: { vi: 'Hiếm', en: 'Rare' },
        active: 'R',
        key: 'super'
    },
    {
        name: { vi: 'Siêu hiếm', en: 'Super Rare' },
        active: 'SR',
        key: 'extremely'
    },
    {
        name: { vi: 'Cực hiếm', en: 'Ultra Rare' },
        active: 'UR',
        key: 'supreme'
    }
];

const TABS = [
    { label: 'WNFT', value: 2 },
    { label: 'SB', value: 1 }
];

const STATUS = {
    0: { key: 'not_active', vi: 'Chưa kích hoạt', en: 'Not activated' },
    1: { key: 'active', vi: 'Đã kích hoạt', en: 'activated' },
    2: { key: 'used', vi: 'Đã sử dụng', en: 'used' }
};

export { LIST_CATEGORY, LIST_TIER, TABS, STATUS };
