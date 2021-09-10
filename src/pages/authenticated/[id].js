import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAsync } from 'react-use';
import fetchAPI from 'src/utils/fetch-api';

const Authenticated = ({}) => {
    const router = useRouter();
    useAsync(async () => {
        console.log('__ check params', router, router.query);
        const res = await fetchAPI({
            url: '/authenticated/nami?authen_token=auth_token%3AhTdWGmrnkIUByCisxQc1je3KtctsOCT0x17mfv4NIEfZGiFF8ReUPPwy1RUF&state=eyJjb2RlIjoic1dCUUFiWXQ4bXdnUm03UnBpZlIiLCJyZWRpcmVjdFRvIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwLyJ9&additional_data_token=auth_token%3AJeu6bmVjuMVhjtAMwgaB&utm_source=web&utm_medium=direct&utm_campaign=attlas.io&utm_content=web_header&mobile_web=false',
            options: {
                method: 'GET',
            },
        });
        console.log('__ chekc ress', res);
    });
    return null;
};

export default (Authenticated);
//
// export default Authenticated;
