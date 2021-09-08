import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isAndroid, isIOS } from 'react-device-detect';
import { DOWNLOAD_APP_LINK } from 'src/redux/actions/const';

const Apps = ({ token }) => {
    const router = useRouter();
    useEffect(() => {
        if (isIOS) {
            router.push(DOWNLOAD_APP_LINK.IOS);
        } else if (isAndroid) {
            router.push(DOWNLOAD_APP_LINK.ANDROID);
        } else {
            router.push('/');
        }
    }, []);
    return null;
};

export default Apps;
