import { PATHS } from 'constants/paths';

const index = () => {
    return null;
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: PATHS.INSURANCE.RULES,
            permanent: false
        }
    };
};
