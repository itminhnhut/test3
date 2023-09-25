import React, { useState } from 'react';
import Parser from 'html-react-parser';
import useGhostArticleData from 'hooks/useGhostArticleData';
import Spinner from 'components/svg/Spinner';
import Error404 from 'components/common/404';

const GhostArticle = ({ title, id }) => {
    const { data, isLoading, error } = useGhostArticleData({ id });

    return (
        <div className=" px-4 pb-20 md:pb-[120px]">
            {isLoading ? (
                <div className="flex items-center min-h-[50vh] justify-center text-gray-1 dark:text-darkBlue-5">
                    <Spinner size={50} color="currentColor" />
                </div>
            ) : error ? (
                <Error404 />
            ) : (
                <div id="ghost_global">
                    <div id="ghost_content" className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto flex flex-col items-start">
                        {title}
                        <section className="gh-content w-full mt-4 sm:mt-6 lg:mt-8 !text-xs sm:!text-sm lg:!text-[16px]">{data && Parser(data?.html)}</section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GhostArticle;
