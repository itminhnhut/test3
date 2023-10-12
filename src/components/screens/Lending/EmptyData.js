//** */ Next
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** components
import Button from 'components/common/V2/ButtonV2/Button';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

const EmptyData = ({ isDark, content, textBtn, tabDirect = 'lending' }) => {
    // ** useRouter
    const router = useRouter();

    const handleDirectionUrl = () => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    tab: tabDirect,
                    loanAsset: 'USDT'
                }
            },
            router.pathname,
            { scroll: false }
        );
    };
    return (
        <section className="flex flex-col space-y-3 items-center justify-center py-[50px]">
            {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
            <span className="text-txtSecondary dark:text-darkBlue-5 text-sm sm:text-base !mt-3 !mb-4 !ml-0">{content}</span>
            <Button className="w-max px-6 !m-0" onClick={handleDirectionUrl}>
                {textBtn}
            </Button>
        </section>
    );
};
export default EmptyData;
