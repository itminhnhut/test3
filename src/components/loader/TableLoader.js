import ContentLoader from 'react-content-loader';

const TableLoader = (props) => {
    if (props.records === 10) {
        return (
            <ContentLoader height={600} width="100%" {...props}>
                <rect x="0" y="0" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="60" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="120" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="180" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="240" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="300" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="360" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="420" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="480" rx="5" ry="5" width="100%" height="48" />
                <rect x="0" y="540" rx="5" ry="5" width="100%" height="48" />
            </ContentLoader>
        );
    }
    return (
        <ContentLoader height={300} width="100%" {...props}>
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="48" />
            <rect x="0" y="60" rx="5" ry="5" width="100%" height="48" />
            <rect x="0" y="120" rx="5" ry="5" width="100%" height="48" />
            <rect x="0" y="180" rx="5" ry="5" width="100%" height="48" />
            <rect x="0" y="240" rx="5" ry="5" width="100%" height="48" />
        </ContentLoader>
    );
};

export default TableLoader;
