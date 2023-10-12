import dynamic from 'next/dynamic';
import LoadingPage from 'components/screens/Nao_futures/LoadingPage'
import { isMobile } from 'react-device-detect';
export default dynamic(
    () => Promise.resolve(({ children }) => <>{children}</>),
    { ssr: false, loading: () => isMobile && <LoadingPage /> }
)
