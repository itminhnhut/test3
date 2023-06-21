import useQuery from "hooks/useQuery";
import { useRouter } from "next/router";
import { API_MARKETING_EVENTS } from "redux/actions/apis";
import FetchApi from "utils/fetch-api";

function useCurrentPosts() {
    const router = useRouter();
    return useQuery(
        ['event_carousel', router.locale],
        async ({ signal }) => {
            const res = await FetchApi({
                url: API_MARKETING_EVENTS,
                options: {
                    method: 'GET',
                    signal
                },
                params: {
                    pageSize: 6,
                    locale: router.locale.toUpperCase()
                }
            });
            return res.data.events;
        },
        {
            persist: true,
            ttl: '2h'
        }
    );
}

export default useCurrentPosts;
