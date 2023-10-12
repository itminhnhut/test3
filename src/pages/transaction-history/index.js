const index = () => {
    return null
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        redirect: {
            destination: `/transaction-history/all`,
            permanent: false
        }
    };
};
