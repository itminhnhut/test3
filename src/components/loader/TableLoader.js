import { IconLoading } from 'src/components/common/Icons';
import ContentLoader from 'react-content-loader';

const TableLoader = (props) => {
    return (
        <div className="absolute w-full h-full bg-white z-10 flex justify-center items-center">
            <IconLoading color="#00C8BC" />
        </div>

    );
};

export default TableLoader;
