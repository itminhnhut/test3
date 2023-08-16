import { useTranslation } from 'next-i18next';

import RadioBox2 from 'components/common/RadioBox2';

import { LIST_CATEGORY } from 'components/screens/NFT/Constants';

const CategoryFilter = ({ onChangeCategory, isDark, category }) => {
    const {
        i18n: { language }
    } = useTranslation();

    return (
        <>
            {LIST_CATEGORY?.map((item) => {
                return (
                    <RadioBox2
                        isDark={isDark}
                        classNameInput="w-6 h-6"
                        key={item.name?.[language]}
                        id={item.name?.[language]}
                        label={item.name?.[language]}
                        checked={item?.active === category}
                        onChange={() => onChangeCategory(item?.active)}
                    />
                );
            })}
            <div className="my-6 h-[1px] bg-divider dark:bg-divider-dark" />
        </>
    );
};
export default CategoryFilter;
