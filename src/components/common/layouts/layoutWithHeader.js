import ReactNotification from 'react-notifications-component';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { sanitize } from 'src/utils/helpers';
import NavBar from '../NavBar';

const LayoutWithHeader = ({ showBanner, children, hidden }) => {
    const _renderNav = useMemo(() => {
        return <NavBar />;
    }, []);
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    return (
        <div className="md:h-screen flex flex-col">
            <ReactNotification />
            { !hidden && _renderNav }
            <>{children}</>
        </div>
    );
};

export default LayoutWithHeader;
