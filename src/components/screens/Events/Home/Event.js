import React from 'react';
import EventCarousel from './EventCarousel';
import EventList from './EventList';

const mock = [
    {
        _id: '646ae1663ff694befa57d919',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684726117962_1174046-F7XtFMXJVoJL.png',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684726118004_1174046-F7XtFMXJVoJL.png',
        title: 'namitest2',
        startTime: '2023-05-24T03:28:04.142Z',
        endTime: '2023-05-24T08:32:58.142Z',
        anticipate: false,
        prize: 'hhhdf',
        postLink: 'http://google.com',
        isHot: true,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 0,
        createdAt: '2023-05-22T03:28:38.032Z',
        updatedAt: '2023-05-23T08:34:33.986Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646b26fd3183c4b242550c25',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684743933421_583296-SRxzdXk9YJrw.png',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684743933464_1766343-H5rSCsv5Nsa1.png',
        title: 'Tòa án Israel có thể thu giữ tiền 150 ví nằm trong danh sách đen',
        startTime: '2023-05-22T08:29:42.133Z',
        endTime: '2023-05-31T15:30:49.133Z',
        anticipate: true,
        prize: '150 ví kỹ thuật số',
        postLink: 'https://nami.today/toa-an-israel-phan-quyet-cac-nha-chuc-trach-co-the-thu-giu-tien-dien-tu-trong-150-vi-nam-trong-danh-sach-den/',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 0,
        createdAt: '2023-05-22T08:25:33.524Z',
        updatedAt: '2023-05-23T08:34:36.751Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '6461feb625a9e0c7936289f6',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684143798241_anh-dep-thien-nhien-3.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684143798491_anh-dep-thien-nhien-3.jpg',
        title: 'test3',
        startTime: '2023-05-17T09:43:04.397Z',
        endTime: '2023-05-20T09:43:11.272Z',
        anticipate: true,
        prize: 'test3',
        postLink: 'test3',
        isHot: true,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 3,
        createdAt: '2023-05-15T09:43:18.753Z',
        updatedAt: '2023-05-23T08:34:45.017Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '6461fe9525a9e0c7936289f0',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684143764654_anh-dep-thien-nhien-3.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684143764954_anh-dep-thien-nhien-3.jpg',
        title: 'test2',
        startTime: '2023-05-14T09:42:35.959Z',
        endTime: '2023-05-20T09:42:25.258Z',
        anticipate: false,
        prize: 'test2',
        postLink: 'test2',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 3,
        createdAt: '2023-05-15T09:42:45.201Z',
        updatedAt: '2023-05-23T08:34:46.588Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '6462fcf342ee082a7e009b1e',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684208879712_anh-dep-thien-nhien-3.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684208882217_anh-dep-thien-nhien-3.jpg',
        title: 'test6',
        startTime: '2023-05-18T03:45:06.242Z',
        endTime: '2023-05-26T03:45:10.563Z',
        anticipate: false,
        prize: 'test6',
        postLink: 'test6',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 4,
        createdAt: '2023-05-16T03:48:03.293Z',
        updatedAt: '2023-05-23T08:34:49.606Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646391e7016ac3485a418f56',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684247015392_image4.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684247015655_1684044754040_1045-2.jpg',
        title: 'zzzzz123',
        startTime: '2023-05-16T14:24:09.891Z',
        endTime: '2023-05-18T14:23:24.891Z',
        anticipate: true,
        prize: 'zz',
        postLink: 'zz',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 1000,
        createdAt: '2023-05-16T14:23:35.765Z',
        updatedAt: '2023-05-23T08:34:55.690Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646addbc3ff694befa57d8ac',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684725180673_1174046-F7XtFMXJVoJL.png',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684725180761_583296-SRxzdXk9YJrw.png',
        title: 'namitest1',
        startTime: '2023-05-23T03:12:28.838Z',
        endTime: '2023-05-31T03:12:32.838Z',
        anticipate: false,
        prize: '5000 USDT',
        postLink: 'hgshdjjads',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 99999,
        createdAt: '2023-05-22T03:13:00.815Z',
        updatedAt: '2023-05-23T08:34:57.504Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646b181de52d28fd91271278',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684743678887_1766343-cuopgJUenz9R.png',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684743678985_hinh-anh-dep-1.jpg',
        title: 'test3',
        startTime: '2023-05-22T07:21:43.218Z',
        endTime: '2023-05-23T07:21:45.218Z',
        anticipate: false,
        prize: 'test3',
        postLink: 'http://localhost:6002/marketing/event?pageSize=10&sort[field]=id&sort[order]=descend&current=2',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 99999,
        createdAt: '2023-05-22T07:22:05.269Z',
        updatedAt: '2023-05-23T08:34:59.729Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646b1766e52d28fd91271256',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684739976954_hinh-anh-dep-1.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684739942409_images.jpg',
        title: 'test2',
        startTime: '2023-05-22T07:18:52.094Z',
        endTime: '2023-05-23T07:18:55.094Z',
        anticipate: true,
        prize: 'test2',
        postLink: 'http://localhost:6002/marketing/event?pageSize=10&sort[field]=id&sort[order]=descend&current=1',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 99999,
        createdAt: '2023-05-22T07:19:02.508Z',
        updatedAt: '2023-05-23T08:35:01.692Z',
        __v: 0,
        isHidden: false
    },
    {
        _id: '646b1699e52d28fd91271244',
        thumbnailImgEndpoint: 'nami.exchange/images/marketing/events/thumbnails/1684739734961_hinh-anh-dep-1.jpg',
        bannerImgEndpoint: 'nami.exchange/images/marketing/events/banners/1684739736888_hinh-anh-dep-1.jpg',
        title: 'test',
        startTime: '2023-05-22T07:15:28.442Z',
        endTime: '2023-05-23T07:15:30.442Z',
        anticipate: true,
        prize: 'test',
        postLink: 'http://localhost:6002/marketing/event?pageSize=10&sort[field]=id&sort[order]=descend&current=1',
        isHot: false,
        creatorName: 'NGUYEN DUC TRUNG',
        priority: 99999,
        createdAt: '2023-05-22T07:15:37.531Z',
        updatedAt: '2023-05-23T08:35:03.887Z',
        __v: 0,
        isHidden: false
    }
];

const Event = () => {


    return (
        <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto mb:pb-[7.5rem] pb-20 pt-0 px-4 mb:px-0">
            <div className="py-4 mb:pt-12">
                <EventCarousel data={mock} />
            </div>
            <div className="pt-4 mb:pt-12">
                <EventList data={mock} />
            </div>
        </div>
    );
};

export default Event;
