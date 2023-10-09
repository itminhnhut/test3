//** */ Next
import Link from 'next/link';

// ** components
import Button from 'components/common/V2/ButtonV2/Button';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

const EmptyData = ({ isDark, content, textBtn, link }) => {
    return (
        <section className="flex flex-col space-y-3 items-center justify-center">
            {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
            <span className="text-txtSecondary dark:text-darkBlue-5 text-sm sm:text-base">{content}</span>
            <Button>
                <Link href={link}>{textBtn}</Link>
            </Button>
        </section>
    );
};
export default EmptyData;
