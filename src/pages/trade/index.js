import { useRouter } from 'next/router';

const SpotDefault = ({ token }) => {
    // const router = useRouter();
    // if (typeof window !== 'undefined') {
    //     router.push('/trade/BTC-USDT', undefined, { shallow: true });
    // }
    return null;
};

export default SpotDefault;
//
export async function getServerSideProps(context) {
    return {
        redirect: {
            destination: '/trade/BTC-USDT',
            permanent: false,
        },
    };
}

//
// export default Authenticated;
