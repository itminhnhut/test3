import { useRouter } from 'next/router';

const LuckydrawDefault = ({ token }) => {
    const router = useRouter();
    if (typeof window !== 'undefined') {
        router.push('/luckydraw/frame', undefined, { shallow: true });
    }
    return null;
};

export default LuckydrawDefault;
