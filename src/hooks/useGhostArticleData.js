import React, { useEffect, useState } from 'react';
import { ghost } from 'utils';

const useGhostArticleData = ({ id, slug }) => {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let postQueryObject;
        if (id) {
            postQueryObject = { id };
        }
        if (slug) {
            postQueryObject = { slug };
        }

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const content = await ghost.posts.read({ ...postQueryObject, ...{ include: 'authors' } });
                setData(content);
            } catch (error) {
                setError(JSON.stringify(error));
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, slug]);

    return { data, isLoading, error };
};

export default useGhostArticleData;
