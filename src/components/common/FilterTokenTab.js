import { useTranslation } from 'next-i18next';
import { fiatFilter } from 'components/screens/WithdrawDeposit/constants';
import classNames from 'classnames';

const FilterTokenTab = ({ curToken, setCurToken, className }) => {
    const { t } = useTranslation();

    return (
        <div className={`flex gap-2 ${className}`}>
            {fiatFilter.map((item) => {
                if (!item.key) return null;
                return (
                    <div
                        key={item.value}
                        onClick={() => setCurToken(item.value)}
                        className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                            'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': curToken !== item.value,
                            'text-teal border-teal bg-teal/[.1] !font-semibold': curToken === item.value
                        })}
                    >
                        {t(item.localized)}
                    </div>
                );
            })}
        </div>
    );
};

export default FilterTokenTab;
