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
        name: { vi: 'Phổ biến (C)', en: 'Common (C)' },
        active: 'C',
        key: 'normal'
    },
    {
        name: { vi: 'Độc đáo (S)', en: 'Special (S)' },
        active: 'S',
        key: 'rate'
    },
    {
        name: { vi: 'Hiếm (R)', en: 'Rare (R)' },
        active: 'R',
        key: 'super'
    },
    {
        name: { vi: 'Siêu hiếm (SR)', en: 'Super Rare (SR)' },
        active: 'SR',
        key: 'extremely'
    },
    {
        name: { vi: 'Cực hiếm (UR)', en: 'Ultra Rare (UR)' },
        active: 'UR',
        key: 'supreme'
    }
];

const TABS = [
    { label: 'WNFT', value: 2 },
    { label: 'Skynamia Badges', value: 1 }
];

const STATUS = {
    0: { key: 'not_active', vi: 'Còn hiệu lực', en: 'Available' },
    1: { key: 'active', vi: 'Đã kích hoạt', en: 'Activated' },
    2: { key: 'used', vi: 'Hết hạn', en: 'Expired' }
};

export { LIST_CATEGORY, LIST_TIER, TABS, STATUS };
