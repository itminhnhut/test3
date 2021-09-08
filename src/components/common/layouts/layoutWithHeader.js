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
            {/* { showBanner && !loadingBanner && posts && posts.length ? (
                <div className="hidden bg-black-700 md:flex w-full items-center justify-center py-3 px-10 lg:px-0">
                    <a href={`/blog/${posts?.[0]?.slug}`} target="_blank" rel="noreferrer">
                        <div
                            className="text-white mx-3 cursor-pointer"
                            dangerouslySetInnerHTML={{ __html: sanitize(`${posts?.[0]?.title?.rendered}&nbsp;`) }}
                        />
                    </a>
                </div>
            ) : null} */}
            { !hidden && _renderNav }
            <>{children}</>
        </div>
    );
};

export default LayoutWithHeader;
