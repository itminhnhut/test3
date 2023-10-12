import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const SvgLookup = ({ size, className = '' }) => {
    const [currentTheme, ] = useDarkMode()

    if (currentTheme === THEME_MODE.DARK) {
        return (
            <svg width={size || '130'} height={size || '130'} viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                <g clipPath="url(#clip0_1194_6932)">
                    <path d="M62.7793 28.6492L45.8018 112.381L108.004 125.07L124.982 41.3388L62.7793 28.6492Z" fill="#1A2440"/>
                    <path d="M123.457 37.8361L61.2539 25.1465L44.2763 108.878L106.479 121.568L123.457 37.8361Z" fill="#263459"/>
                    <g opacity="0.2">
                        <path d="M66.4507 34.4213L66.125 36.0278L92.4785 41.4041L92.8042 39.7976L66.4507 34.4213Z" fill="#00040F"/>
                        <path d="M65.1529 40.8095L64.8271 42.416L97.3142 49.0435L97.6399 47.437L65.1529 40.8095Z" fill="#00040F"/>
                        <path d="M65.7671 37.7807L65.4414 39.3872L81.6138 42.6865L81.9395 41.08L65.7671 37.7807Z" fill="#00040F"/>
                        <path d="M83.9019 41.4824L83.5762 43.0889L99.7486 46.3881L100.074 44.7816L83.9019 41.4824Z" fill="#00040F"/>
                        <path d="M64.5396 43.8364L64.2139 45.4429L73.1966 47.2754L73.5223 45.6689L64.5396 43.8364Z" fill="#00040F"/>
                        <path d="M89.2554 52.0263L88.9297 53.6328L97.9124 55.4653L98.2382 53.8588L89.2554 52.0263Z" fill="#00040F"/>
                        <path d="M63.9273 46.8588L63.6016 48.4653L86.1576 53.0669L86.4833 51.4604L63.9273 46.8588Z" fill="#00040F"/>
                        <path d="M75.3453 46.0376L75.0195 47.644L98.5238 52.439L98.8495 50.8325L75.3453 46.0376Z" fill="#00040F"/>
                    </g>
                    <g opacity="0.2">
                        <path d="M62.7329 62.016C61.1473 61.6937 60.117 60.1334 60.438 58.5449C60.7589 56.9563 62.3157 55.9247 63.9012 56.247C65.4868 56.5693 66.5171 58.1296 66.1961 59.7181C65.8752 61.3067 64.3184 62.3383 62.7329 62.016ZM63.7679 56.9096C62.5449 56.6617 61.3505 57.4529 61.1037 58.6782C60.8568 59.9036 61.647 61.1007 62.87 61.3486C64.0931 61.5965 65.2875 60.8053 65.5343 59.5799C65.7768 58.355 64.9866 57.158 63.7679 56.9096Z" fill="#00040F"/>
                        <path d="M63.1076 60.1553C63.0216 60.1384 62.9404 60.0855 62.8917 60.0067L61.8735 58.4361C61.7717 58.2791 61.8145 58.0702 61.9707 57.9639C62.1274 57.862 62.3358 57.905 62.442 58.0615L63.2887 59.3676L66.9332 57.3419C67.0957 57.2526 67.3057 57.3088 67.3954 57.4761C67.4846 57.639 67.4281 57.845 67.2617 57.9391L63.3378 60.116C63.2674 60.1595 63.1844 60.1688 63.1076 60.1553Z" fill="#00040F"/>
                        <path d="M70.0931 58.2017L69.918 59.0654L111.487 67.5457L111.662 66.682L70.0931 58.2017Z" fill="#00040F"/>
                        <path d="M83.0491 62.7066L82.874 63.5703L111.128 69.3343L111.304 68.4706L83.0491 62.7066Z" fill="#00040F"/>
                        <path d="M69.3685 61.7755L69.1934 62.6392L94.8399 67.8712L95.0151 67.0075L69.3685 61.7755Z" fill="#00040F"/>
                        <path d="M81.502 62.3892L69.7305 59.9878L69.5553 60.8515L81.3269 63.2529L81.502 62.3892Z" fill="#00040F"/>
                        <path d="M110.931 70.2548L96.2715 67.2642L96.0964 68.1279L110.756 71.1185L110.931 70.2548Z" fill="#00040F"/>
                    </g>
                    <g opacity="0.2">
                        <path d="M60.6704 72.1747C59.0848 71.8524 58.0545 70.2921 58.3755 68.7036C58.6964 67.115 60.2532 66.0834 61.8387 66.4057C63.4243 66.728 64.4546 68.2883 64.1336 69.8768C63.8132 71.4698 62.2608 72.5009 60.6704 72.1747ZM61.7059 67.0726C60.4829 66.8248 59.2885 67.6159 59.0417 68.8413C58.7948 70.0667 59.585 71.2638 60.808 71.5116C62.0311 71.7595 63.2254 70.9684 63.4723 69.743C63.7191 68.5176 62.929 67.3205 61.7059 67.0726Z" fill="#00040F"/>
                        <path d="M61.049 70.3135C60.963 70.2966 60.8818 70.2436 60.8331 70.1649L59.8149 68.5943C59.7131 68.4373 59.7559 68.2284 59.9121 68.1221C60.0688 68.0202 60.2773 68.0632 60.3834 68.2197L61.2301 69.5258L64.8746 67.5001C65.0371 67.4108 65.2427 67.4675 65.3368 67.6343C65.426 67.7972 65.3695 68.0032 65.2031 68.0973L61.2792 70.2742C61.2093 70.322 61.1263 70.3314 61.049 70.3135Z" fill="#00040F"/>
                        <path d="M68.0345 68.3677L67.8594 69.2314L109.428 77.7117L109.603 76.848L68.0345 68.3677Z" fill="#00040F"/>
                        <path d="M80.9837 72.8692L80.8086 73.7329L109.063 79.4969L109.238 78.6332L80.9837 72.8692Z" fill="#00040F"/>
                        <path d="M67.302 71.9405L67.127 72.8042L92.7732 78.0336L92.9483 77.1699L67.302 71.9405Z" fill="#00040F"/>
                        <path d="M79.4396 72.5514L67.668 70.1499L67.4928 71.0136L79.2644 73.4151L79.4396 72.5514Z" fill="#00040F"/>
                        <path d="M108.873 80.4174L94.2139 77.4268L94.0387 78.2905L108.698 81.2811L108.873 80.4174Z" fill="#00040F"/>
                    </g>
                    <g opacity="0.2">
                        <path d="M58.6118 82.3378C57.0262 82.0155 55.9959 80.4552 56.3169 78.8666C56.6378 77.2781 58.1946 76.2465 59.7801 76.5688C61.3657 76.8911 62.396 78.4514 62.075 80.0399C61.7546 81.6328 60.1978 82.6645 58.6118 82.3378ZM59.6473 77.2357C58.4243 76.9878 57.2299 77.779 56.9831 79.0044C56.7362 80.2298 57.5264 81.4268 58.7494 81.6747C59.9725 81.9226 61.1668 81.1314 61.4137 79.9061C61.6561 78.6812 60.866 77.4841 59.6473 77.2357Z" fill="#00040F"/>
                        <path d="M58.9865 80.4771C58.9005 80.4602 58.8193 80.4072 58.7706 80.3285L57.7524 78.7579C57.6506 78.6009 57.6934 78.392 57.8496 78.2857C58.0063 78.1837 58.2148 78.2268 58.3209 78.3833L59.1676 79.6893L62.8121 77.6637C62.9746 77.5744 63.1802 77.6311 63.2743 77.7979C63.3635 77.9608 63.307 78.1667 63.1406 78.2609L59.2167 80.4378C59.1463 80.4812 59.0638 80.495 58.9865 80.4771Z" fill="#00040F"/>
                        <path d="M65.9749 78.5289L65.7998 79.3926L107.369 87.8728L107.544 87.0091L65.9749 78.5289Z" fill="#00040F"/>
                        <path d="M78.9241 83.0303L78.749 83.894L107.003 89.658L107.178 88.7943L78.9241 83.0303Z" fill="#00040F"/>
                        <path d="M65.2484 82.1016L65.0732 82.9653L90.7198 88.1974L90.8949 87.3337L65.2484 82.1016Z" fill="#00040F"/>
                        <path d="M77.38 82.7154L65.6084 80.314L65.4333 81.1777L77.2049 83.5791L77.38 82.7154Z" fill="#00040F"/>
                        <path d="M106.811 90.5765L92.1514 87.5859L91.9762 88.4496L106.636 91.4403L106.811 90.5765Z" fill="#00040F"/>
                    </g>
                    <g opacity="0.2">
                        <path d="M105.568 96.7109L67.7705 89L67.5534 90.071L105.351 97.7819L105.568 96.7109Z" fill="#00040F"/>
                        <path d="M105.039 99.3273L54.2627 88.9688L54.0455 90.0397L104.821 100.398L105.039 99.3273Z" fill="#00040F"/>
                        <path d="M83.7258 97.7038L53.7344 91.5854L53.5172 92.6564L83.5086 98.7748L83.7258 97.7038Z" fill="#00040F"/>
                        <path d="M103.978 104.561L53.2021 94.2026L52.985 95.2736L103.761 105.632L103.978 104.561Z" fill="#00040F"/>
                        <path d="M103.447 107.178L80.7656 102.551L80.5485 103.622L103.23 108.249L103.447 107.178Z" fill="#00040F"/>
                        <path d="M102.917 109.795L52.1416 99.436L51.9244 100.507L102.7 110.866L102.917 109.795Z" fill="#00040F"/>
                        <path d="M88.5304 109.587L51.6123 102.055L51.3951 103.126L88.3132 110.658L88.5304 109.587Z" fill="#00040F"/>
                        <path d="M102.389 112.409L90.7852 110.042L90.568 111.113L102.171 113.48L102.389 112.409Z" fill="#00040F"/>
                        <path d="M76.966 101.776L52.6729 96.8203L52.4557 97.8913L76.7488 102.847L76.966 101.776Z" fill="#00040F"/>
                        <path d="M104.509 101.944L85.9834 98.1646L85.7662 99.2355L104.292 103.015L104.509 101.944Z" fill="#00040F"/>
                    </g>
                    <path d="M71.4503 3.4681L8.2666 10.9351L18.1799 95.9506L81.3636 88.4836L71.4503 3.4681Z" fill="#202C4C"/>
                    <path d="M69.667 5.7933L6.4834 13.2603L16.3967 98.2757L79.5804 90.8088L69.667 5.7933Z" fill="#445271"/>
                    <g opacity="0.3">
                        <path d="M57.1855 36.4625L14.9648 41.4521L15.0671 42.3291L57.2878 37.3395L57.1855 36.4625Z" fill="#202C4C"/>
                        <path d="M57.3993 38.2762L28.7031 41.6675L28.8054 42.5444L57.5016 39.1531L57.3993 38.2762Z" fill="#202C4C"/>
                        <path d="M41.4417 42.0008L15.3896 45.0796L15.4919 45.9565L41.5439 42.8777L41.4417 42.0008Z" fill="#202C4C"/>
                        <path d="M27.1311 41.8557L15.1758 43.2686L15.278 44.1455L27.2333 42.7326L27.1311 41.8557Z" fill="#202C4C"/>
                        <path d="M57.6097 40.0929L42.7197 41.8525L42.822 42.7295L57.7119 40.9698L57.6097 40.0929Z" fill="#202C4C"/>
                    </g>
                    <g opacity="0.3">
                        <path d="M58.3896 46.7824L16.1689 51.772L16.2712 52.6489L58.4919 47.6593L58.3896 46.7824Z" fill="#202C4C"/>
                        <path d="M58.6034 48.5961L29.9072 51.9873L30.0095 52.8642L58.7057 49.473L58.6034 48.5961Z" fill="#202C4C"/>
                        <path d="M42.6458 52.3206L16.5938 55.3994L16.696 56.2764L42.748 53.1976L42.6458 52.3206Z" fill="#202C4C"/>
                        <path d="M28.3352 52.1707L16.3799 53.5835L16.4821 54.4604L28.4374 53.0476L28.3352 52.1707Z" fill="#202C4C"/>
                        <path d="M58.8128 50.4083L43.9229 52.168L44.0251 53.0449L58.915 51.2852L58.8128 50.4083Z" fill="#202C4C"/>
                    </g>
                    <g opacity="0.3">
                        <path d="M59.5928 57.0983L17.3721 62.0879L17.4743 62.9648L59.695 57.9752L59.5928 57.0983Z" fill="#202C4C"/>
                        <path d="M59.8026 58.9124L31.1064 62.3037L31.2087 63.1807L59.9049 59.7894L59.8026 58.9124Z" fill="#202C4C"/>
                        <path d="M43.8406 62.6371L17.793 65.7153L17.8952 66.5923L43.9429 63.514L43.8406 62.6371Z" fill="#202C4C"/>
                        <path d="M29.5383 62.4909L17.583 63.9038L17.6853 64.7808L29.6406 63.3679L29.5383 62.4909Z" fill="#202C4C"/>
                        <path d="M60.0169 60.7286L45.127 62.4883L45.2292 63.3652L60.1192 61.6056L60.0169 60.7286Z" fill="#202C4C"/>
                    </g>
                    <g opacity="0.3">
                        <path d="M70.9702 67.4452L32.5771 71.9824L32.7037 73.0677L71.0968 68.5305L70.9702 67.4452Z" fill="#202C4C"/>
                        <path d="M71.2802 70.1007L19.7051 76.1958L19.8316 77.2811L71.4067 71.186L71.2802 70.1007Z" fill="#202C4C"/>
                        <path d="M50.4741 75.2538L20.0137 78.8535L20.1402 79.9388L50.6006 76.3391L50.4741 75.2538Z" fill="#202C4C"/>
                        <path d="M71.8983 75.4142L20.3232 81.5093L20.4498 82.5946L72.0249 76.4996L71.8983 75.4142Z" fill="#202C4C"/>
                        <path d="M72.2073 78.0712L49.168 80.7939L49.2945 81.8793L72.3338 79.1565L72.2073 78.0712Z" fill="#202C4C"/>
                        <path d="M72.5214 80.7272L20.9463 86.8223L21.0728 87.9076L72.6479 81.8125L72.5214 80.7272Z" fill="#202C4C"/>
                        <path d="M58.754 85.0453L21.2539 89.4771L21.3805 90.5624L58.8806 86.1307L58.754 85.0453Z" fill="#202C4C"/>
                        <path d="M72.8292 83.3854L61.043 84.7783L61.1695 85.8637L72.9558 84.4707L72.8292 83.3854Z" fill="#202C4C"/>
                        <path d="M45.3126 81.2506L20.6348 84.167L20.7613 85.2523L45.4392 82.3359L45.3126 81.2506Z" fill="#202C4C"/>
                        <path d="M71.5887 72.7586L52.7715 74.9824L52.898 76.0677L71.7153 73.844L71.5887 72.7586Z" fill="#202C4C"/>
                    </g>
                    <g opacity="0.3">
                        <path d="M39.275 18.6059L12.5078 21.769L12.6982 23.4016L39.4654 20.2385L39.275 18.6059Z" fill="#202C4C"/>
                        <path d="M46.2599 24.3517L13.2637 28.251L13.454 29.8835L46.4503 25.9843L46.2599 24.3517Z" fill="#202C4C"/>
                        <path d="M29.336 23.2364L12.9072 25.1777L13.0976 26.8102L29.5263 24.8689L29.336 23.2364Z" fill="#202C4C"/>
                        <path d="M47.7539 21.0596L31.3252 23.001L31.5156 24.6335L47.9443 22.6921L47.7539 21.0596Z" fill="#202C4C"/>
                        <path d="M22.7467 30.248L13.6221 31.3262L13.8124 32.9586L22.9371 31.8804L22.7467 30.248Z" fill="#202C4C"/>
                        <path d="M48.8298 30.2772L39.7051 31.3555L39.8954 32.9879L49.0201 31.9097L48.8298 30.2772Z" fill="#202C4C"/>
                        <path d="M36.8897 31.6888L13.9805 34.396L14.1708 36.0285L37.0801 33.3213L36.8897 31.6888Z" fill="#202C4C"/>
                        <path d="M48.4706 27.2044L24.5947 30.0259L24.7851 31.6584L48.661 28.837L48.4706 27.2044Z" fill="#202C4C"/>
                    </g>
                    <path d="M61.9745 84.3297L58.9619 81.6772L46.6442 95.7052L49.6568 98.3577L61.9745 84.3297Z" fill="#00C8BC"/>
                    <path d="M89.2953 50.1757C79.652 41.6845 64.9233 42.6231 56.458 52.2631C47.9927 61.903 48.9532 76.6463 58.5946 85.1339C68.238 93.6251 82.963 92.6884 91.4246 83.0505C99.8899 73.4105 98.9367 58.6633 89.2953 50.1757ZM61.1858 82.1851C53.1687 75.1272 52.3751 62.8744 59.4078 54.8622C66.4405 46.8499 78.6835 46.0685 86.7005 53.1264C94.7176 60.1843 95.5095 72.4428 88.4731 80.457C81.4368 88.4712 69.2028 89.243 61.1858 82.1851Z" fill="#00C8BC"/>
                    <path d="M88.1008 51.5352C79.2116 43.7073 65.6273 44.568 57.8196 53.456C50.0156 62.3422 50.9039 75.9451 59.7932 83.773C68.6881 91.6026 82.2668 90.7402 90.0708 81.8541C97.8784 72.966 96.9921 59.3668 88.1008 51.5352ZM61.186 82.1854C53.169 75.1275 52.3753 62.8747 59.408 54.8624C66.4407 46.8502 78.6836 46.0688 86.7007 53.1267C94.7177 60.1846 95.5097 72.443 88.4733 80.4572C81.437 88.4715 69.2031 89.2433 61.186 82.1854Z" fill="#F2F4F6"/>
                    <path opacity="0.1" d="M92.4524 73.3026C95.5503 63.0743 89.7751 52.2544 79.5531 49.1357C69.3311 46.017 58.5332 51.7805 55.4354 62.0088C52.3375 72.2371 58.1127 83.057 68.3347 86.1757C78.5567 89.2944 89.3546 83.5309 92.4524 73.3026Z" fill="#00C8BC"/>
                    <path d="M29.5539 118.211C27.9391 116.791 27.7805 114.333 29.1987 112.723L48.8754 90.3171L54.7158 95.4573L35.0391 117.863C33.6173 119.475 31.165 119.634 29.5539 118.211Z" fill="#00C8BC"/>
                    <path opacity="0.3" d="M71.7786 50.2633C65.7076 51.4099 60.7311 55.1272 58.5857 61.0449C57.3093 64.5699 62.5901 67.1981 63.8875 63.6242C65.2643 59.8287 68.0757 56.9133 72.163 56.1417C75.8439 55.455 75.4981 49.5607 71.7786 50.2633Z" fill="white"/>
                </g>
                <defs>
                    <clipPath id="clip0_1194_6932">
                        <rect width="130" height="130" fill="white"/>
                    </clipPath>
                </defs>
            </svg>

        )
    }

    return (
        <svg width={size || '130'} height={size || '130'} viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1194_6802)">
                <path d="M62.7796 28.6492L45.802 112.381L108.005 125.07L124.982 41.3388L62.7796 28.6492Z"
                      fill="#F2F4F6"/>
                <path d="M123.457 37.8361L61.2539 25.1465L44.2763 108.878L106.479 121.568L123.457 37.8361Z"
                      fill="#F2F4F6"/>
                <path d="M66.4507 34.4213L66.125 36.0278L92.4785 41.4041L92.8042 39.7976L66.4507 34.4213Z"
                      fill="#F8F9FA"/>
                <path d="M65.1534 40.8095L64.8276 42.416L97.3147 49.0435L97.6404 47.437L65.1534 40.8095Z"
                      fill="#F8F9FA"/>
                <path d="M65.7671 37.7807L65.4414 39.3872L81.6138 42.6865L81.9395 41.08L65.7671 37.7807Z"
                      fill="#F8F9FA"/>
                <path d="M83.9024 41.4824L83.5767 43.0889L99.7491 46.3881L100.075 44.7816L83.9024 41.4824Z"
                      fill="#F8F9FA"/>
                <path d="M64.5401 43.8364L64.2144 45.4429L73.1971 47.2754L73.5228 45.6689L64.5401 43.8364Z"
                      fill="#F8F9FA"/>
                <path d="M89.2557 52.0263L88.9299 53.6328L97.9127 55.4653L98.2384 53.8589L89.2557 52.0263Z"
                      fill="#F8F9FA"/>
                <path d="M63.928 46.8593L63.6023 48.4658L86.1583 53.0674L86.484 51.4609L63.928 46.8593Z"
                      fill="#F8F9FA"/>
                <path d="M75.346 46.0376L75.0203 47.644L98.5245 52.439L98.8503 50.8325L75.346 46.0376Z" fill="#F8F9FA"/>
                <path
                    d="M62.7329 62.016C61.1473 61.6937 60.117 60.1334 60.438 58.5449C60.7589 56.9563 62.3157 55.9247 63.9012 56.247C65.4868 56.5693 66.5171 58.1296 66.1961 59.7181C65.8752 61.3067 64.3184 62.3383 62.7329 62.016ZM63.7679 56.9096C62.5449 56.6617 61.3505 57.4529 61.1037 58.6782C60.8568 59.9036 61.647 61.1007 62.87 61.3486C64.0931 61.5965 65.2874 60.8053 65.5343 59.5799C65.7768 58.355 64.9866 57.1579 63.7679 56.9096Z"
                    fill="#F8F9FA"/>
                <path
                    d="M63.1071 60.1553C63.0211 60.1384 62.9399 60.0855 62.8912 60.0067L61.873 58.4361C61.7712 58.2791 61.814 58.0702 61.9702 57.9639C62.1269 57.862 62.3354 57.905 62.4416 58.0615L63.2882 59.3676L66.9327 57.3419C67.0953 57.2526 67.3052 57.3088 67.3949 57.4761C67.4841 57.639 67.4276 57.845 67.2612 57.9391L63.3373 60.116C63.2669 60.1594 63.1839 60.1688 63.1071 60.1553Z"
                    fill="#F8F9FA"/>
                <path d="M70.0929 58.2022L69.9177 59.0659L111.487 67.5462L111.662 66.6825L70.0929 58.2022Z"
                      fill="#F8F9FA"/>
                <path d="M83.0489 62.7071L82.8738 63.5708L111.128 69.3348L111.303 68.4711L83.0489 62.7071Z"
                      fill="#F8F9FA"/>
                <path d="M69.3675 61.7759L69.1924 62.6396L94.8389 67.8717L95.0141 67.008L69.3675 61.7759Z"
                      fill="#F8F9FA"/>
                <path d="M81.5013 62.3897L69.7297 59.9883L69.5546 60.852L81.3262 63.2534L81.5013 62.3897Z"
                      fill="#F8F9FA"/>
                <path d="M110.931 70.2553L96.2715 67.2646L96.0964 68.1284L110.756 71.119L110.931 70.2553Z"
                      fill="#F8F9FA"/>
                <path
                    d="M60.6699 72.1752C59.0843 71.8529 58.054 70.2926 58.375 68.7041C58.6959 67.1155 60.2527 66.0839 61.8382 66.4062C63.4238 66.7285 64.4541 68.2888 64.1331 69.8773C63.8127 71.4702 62.2603 72.5014 60.6699 72.1752ZM61.7054 67.0731C60.4824 66.8253 59.288 67.6164 59.0412 68.8418C58.7943 70.0672 59.5845 71.2642 60.8075 71.5121C62.0306 71.76 63.2249 70.9688 63.4718 69.7435C63.7186 68.5181 62.9285 67.321 61.7054 67.0731Z"
                    fill="#F8F9FA"/>
                <path
                    d="M61.0485 70.314C60.9625 70.2971 60.8813 70.2441 60.8326 70.1654L59.8144 68.5948C59.7126 68.4378 59.7554 68.2289 59.9116 68.1226C60.0683 68.0206 60.2768 68.0637 60.383 68.2202L61.2296 69.5262L64.8741 67.5006C65.0366 67.4113 65.2422 67.468 65.3363 67.6348C65.4255 67.7977 65.369 68.0036 65.2026 68.0978L61.2787 70.2747C61.2088 70.3225 61.1258 70.3319 61.0485 70.314Z"
                    fill="#F8F9FA"/>
                <path d="M68.0343 68.3687L67.8591 69.2324L109.428 77.7127L109.603 76.849L68.0343 68.3687Z"
                      fill="#F8F9FA"/>
                <path d="M80.983 72.8702L80.8079 73.7339L109.062 79.4979L109.237 78.6342L80.983 72.8702Z"
                      fill="#F8F9FA"/>
                <path d="M67.3017 71.9415L67.1267 72.8052L92.773 78.0346L92.948 77.1709L67.3017 71.9415Z"
                      fill="#F8F9FA"/>
                <path d="M79.4383 72.5523L67.6667 70.1509L67.4916 71.0146L79.2632 73.416L79.4383 72.5523Z"
                      fill="#F8F9FA"/>
                <path d="M108.873 80.4183L94.2131 77.4277L94.038 78.2914L108.697 81.282L108.873 80.4183Z"
                      fill="#F8F9FA"/>
                <path
                    d="M58.6118 82.3378C57.0262 82.0155 55.9959 80.4552 56.3169 78.8667C56.6378 77.2781 58.1946 76.2465 59.7801 76.5688C61.3657 76.8911 62.396 78.4514 62.075 80.0399C61.7546 81.6329 60.1978 82.6645 58.6118 82.3378ZM59.6473 77.2357C58.4243 76.9879 57.2299 77.779 56.9831 79.0044C56.7362 80.2298 57.5264 81.4269 58.7494 81.6747C59.9725 81.9226 61.1668 81.1315 61.4137 79.9061C61.6561 78.6812 60.866 77.4841 59.6473 77.2357Z"
                    fill="#F8F9FA"/>
                <path
                    d="M58.9863 80.4771C58.9003 80.4602 58.819 80.4072 58.7703 80.3285L57.7521 78.7579C57.6503 78.6009 57.6932 78.392 57.8494 78.2857C58.0061 78.1837 58.2145 78.2268 58.3207 78.3833L59.1674 79.6893L62.8118 77.6637C62.9744 77.5744 63.18 77.6311 63.274 77.7979C63.3632 77.9608 63.3068 78.1667 63.1404 78.2609L59.2164 80.4378C59.1461 80.4812 59.0635 80.495 58.9863 80.4771Z"
                    fill="#F8F9FA"/>
                <path d="M65.9747 78.5289L65.7996 79.3926L107.369 87.8728L107.544 87.0091L65.9747 78.5289Z"
                      fill="#F8F9FA"/>
                <path d="M78.9237 83.0303L78.7485 83.894L107.003 89.658L107.178 88.7943L78.9237 83.0303Z"
                      fill="#F8F9FA"/>
                <path d="M65.2484 82.1016L65.0732 82.9653L90.7198 88.1974L90.8949 87.3337L65.2484 82.1016Z"
                      fill="#F8F9FA"/>
                <path d="M77.3795 82.7154L65.6079 80.314L65.4328 81.1777L77.2044 83.5791L77.3795 82.7154Z"
                      fill="#F8F9FA"/>
                <path d="M106.81 90.5766L92.1509 87.5859L91.9758 88.4496L106.635 91.4403L106.81 90.5766Z"
                      fill="#F8F9FA"/>
                <path d="M105.568 96.7104L67.7705 88.9995L67.5534 90.0705L105.351 97.7814L105.568 96.7104Z"
                      fill="#F8F9FA"/>
                <path d="M105.039 99.3273L54.2634 88.9688L54.0463 90.0397L104.822 100.398L105.039 99.3273Z"
                      fill="#F8F9FA"/>
                <path d="M83.7263 97.7033L53.7349 91.585L53.5177 92.6559L83.5091 98.7743L83.7263 97.7033Z"
                      fill="#F8F9FA"/>
                <path d="M103.978 104.561L53.2026 94.2026L52.9855 95.2736L103.761 105.632L103.978 104.561Z"
                      fill="#F8F9FA"/>
                <path d="M103.447 107.178L80.7659 102.551L80.5487 103.622L103.23 108.249L103.447 107.178Z"
                      fill="#F8F9FA"/>
                <path d="M102.918 109.795L52.1418 99.436L51.9247 100.507L102.701 110.866L102.918 109.795Z"
                      fill="#F8F9FA"/>
                <path d="M88.5311 109.586L51.613 102.055L51.3959 103.126L88.314 110.657L88.5311 109.586Z"
                      fill="#F8F9FA"/>
                <path d="M102.389 112.409L90.7854 110.042L90.5682 111.113L102.172 113.48L102.389 112.409Z"
                      fill="#F8F9FA"/>
                <path d="M76.9664 101.776L52.6733 96.8203L52.4562 97.8913L76.7493 102.847L76.9664 101.776Z"
                      fill="#F8F9FA"/>
                <path d="M104.51 101.943L85.9839 98.1641L85.7667 99.2351L104.293 103.014L104.51 101.943Z"
                      fill="#F8F9FA"/>
                <path d="M71.4498 3.46859L8.26611 10.9355L18.1795 95.951L81.3631 88.4841L71.4498 3.46859Z"
                      fill="#F2F4F6"/>
                <path d="M69.6668 5.7933L6.48315 13.2603L16.3965 98.2757L79.5801 90.8088L69.6668 5.7933Z"
                      fill="#F2F4F6"/>
                <path d="M57.1843 36.4625L14.9636 41.4521L15.0659 42.3291L57.2866 37.3395L57.1843 36.4625Z"
                      fill="#FCFCFC"/>
                <path d="M57.3986 38.2762L28.7024 41.6675L28.8046 42.5444L57.5008 39.1531L57.3986 38.2762Z"
                      fill="#FCFCFC"/>
                <path d="M41.4409 42.0013L15.3889 45.0801L15.4912 45.957L41.5432 42.8782L41.4409 42.0013Z"
                      fill="#FCFCFC"/>
                <path d="M27.1298 41.8557L15.1746 43.2686L15.2768 44.1455L27.2321 42.7326L27.1298 41.8557Z"
                      fill="#FCFCFC"/>
                <path d="M57.6089 40.0929L42.719 41.8525L42.8213 42.7295L57.7112 40.9698L57.6089 40.0929Z"
                      fill="#FCFCFC"/>
                <path d="M58.3884 46.7824L16.1677 51.772L16.27 52.6489L58.4906 47.6593L58.3884 46.7824Z"
                      fill="#FCFCFC"/>
                <path d="M58.6027 48.5961L29.9065 51.9873L30.0088 52.8642L58.7049 49.473L58.6027 48.5961Z"
                      fill="#FCFCFC"/>
                <path d="M42.645 52.3206L16.593 55.3994L16.6953 56.2764L42.7473 53.1975L42.645 52.3206Z"
                      fill="#FCFCFC"/>
                <path d="M28.334 52.1711L16.3787 53.584L16.4809 54.4609L28.4362 53.0481L28.334 52.1711Z"
                      fill="#FCFCFC"/>
                <path d="M58.8123 50.4083L43.9224 52.168L44.0246 53.0449L58.9146 51.2852L58.8123 50.4083Z"
                      fill="#FCFCFC"/>
                <path d="M59.5918 57.0983L17.3711 62.0879L17.4734 62.9648L59.694 57.9752L59.5918 57.0983Z"
                      fill="#FCFCFC"/>
                <path d="M59.8017 58.9129L31.1055 62.3042L31.2077 63.1811L59.9039 59.7899L59.8017 58.9129Z"
                      fill="#FCFCFC"/>
                <path d="M43.8404 62.6375L17.7927 65.7158L17.895 66.5928L43.9426 63.5145L43.8404 62.6375Z"
                      fill="#FCFCFC"/>
                <path d="M29.5383 62.4914L17.583 63.9043L17.6853 64.7812L29.6406 63.3684L29.5383 62.4914Z"
                      fill="#FCFCFC"/>
                <path d="M60.0164 60.7286L45.1265 62.4883L45.2287 63.3652L60.1187 61.6056L60.0164 60.7286Z"
                      fill="#FCFCFC"/>
                <path d="M70.9702 67.4452L32.5771 71.9824L32.7037 73.0677L71.0968 68.5305L70.9702 67.4452Z"
                      fill="#FCFCFC"/>
                <path d="M71.2804 70.1007L19.7053 76.1958L19.8319 77.2811L71.407 71.186L71.2804 70.1007Z"
                      fill="#FCFCFC"/>
                <path d="M50.4746 75.2538L20.0142 78.8535L20.1407 79.9388L50.6011 76.3391L50.4746 75.2538Z"
                      fill="#FCFCFC"/>
                <path d="M71.8983 75.4142L20.3232 81.5093L20.4498 82.5946L72.0249 76.4996L71.8983 75.4142Z"
                      fill="#FCFCFC"/>
                <path d="M72.2075 78.0707L49.1682 80.7935L49.2948 81.8788L72.3341 79.156L72.2075 78.0707Z"
                      fill="#FCFCFC"/>
                <path d="M72.5209 80.7272L20.9458 86.8223L21.0724 87.9076L72.6475 81.8125L72.5209 80.7272Z"
                      fill="#FCFCFC"/>
                <path d="M58.7538 85.0453L21.2537 89.4771L21.3802 90.5624L58.8803 86.1306L58.7538 85.0453Z"
                      fill="#FCFCFC"/>
                <path d="M72.8292 83.3854L61.043 84.7783L61.1695 85.8636L72.9558 84.4707L72.8292 83.3854Z"
                      fill="#FCFCFC"/>
                <path d="M45.3121 81.2506L20.6343 84.167L20.7608 85.2523L45.4387 82.3359L45.3121 81.2506Z"
                      fill="#FCFCFC"/>
                <path d="M71.589 72.7581L52.7717 74.9819L52.8983 76.0673L71.7155 73.8435L71.589 72.7581Z"
                      fill="#FCFCFC"/>
                <path d="M39.2755 18.6059L12.5083 21.769L12.6987 23.4016L39.4659 20.2385L39.2755 18.6059Z"
                      fill="#FCFCFC"/>
                <path d="M46.2597 24.3522L13.2634 28.2515L13.4538 29.884L46.4501 25.9847L46.2597 24.3522Z"
                      fill="#FCFCFC"/>
                <path d="M29.3365 23.2369L12.9077 25.1782L13.0981 26.8107L29.5268 24.8693L29.3365 23.2369Z"
                      fill="#FCFCFC"/>
                <path d="M47.7544 21.0601L31.3257 23.0015L31.5161 24.634L47.9448 22.6926L47.7544 21.0601Z"
                      fill="#FCFCFC"/>
                <path d="M22.7472 30.248L13.6226 31.3262L13.8129 32.9586L22.9376 31.8804L22.7472 30.248Z"
                      fill="#FCFCFC"/>
                <path d="M48.83 30.2777L39.7053 31.356L39.8957 32.9884L49.0204 31.9102L48.83 30.2777Z" fill="#FCFCFC"/>
                <path d="M36.8897 31.6888L13.9805 34.396L14.1708 36.0285L37.0801 33.3213L36.8897 31.6888Z"
                      fill="#FCFCFC"/>
                <path d="M48.4711 27.2044L24.5952 30.0259L24.7856 31.6584L48.6615 28.837L48.4711 27.2044Z"
                      fill="#FCFCFC"/>
                <path d="M61.9748 84.3297L58.9622 81.6772L46.6445 95.7052L49.6571 98.3577L61.9748 84.3297Z"
                      fill="#00C8BC"/>
                <path
                    d="M89.2958 50.1757C79.6525 41.6845 64.9238 42.6231 56.4585 52.2631C47.9932 61.903 48.9537 76.6463 58.5951 85.1339C68.2385 93.6251 82.9635 92.6884 91.4251 83.0505C99.8904 73.4105 98.9372 58.6633 89.2958 50.1757ZM61.1863 82.1851C53.1692 75.1272 52.3756 62.8744 59.4083 54.8622C66.441 46.8499 78.6839 46.0685 86.701 53.1264C94.718 60.1843 95.51 72.4428 88.4736 80.457C81.4373 88.4712 69.2033 89.243 61.1863 82.1851Z"
                    fill="#00C8BC"/>
                <path
                    d="M88.1011 51.5352C79.2118 43.7073 65.6275 44.568 57.8199 53.456C50.0158 62.3422 50.9042 75.9451 59.7934 83.773C68.6883 91.6026 82.267 90.7402 90.071 81.8541C97.8787 72.966 96.9923 59.3668 88.1011 51.5352ZM61.1863 82.1854C53.1692 75.1275 52.3756 62.8747 59.4083 54.8624C66.4409 46.8502 78.6839 46.0688 86.7009 53.1267C94.718 60.1846 95.5099 72.443 88.4736 80.4573C81.4372 88.4715 69.2033 89.2433 61.1863 82.1854Z"
                    fill="white"/>
                <path opacity="0.1"
                      d="M92.4527 73.3026C95.5505 63.0743 89.7753 52.2544 79.5533 49.1357C69.3313 46.017 58.5335 51.7805 55.4356 62.0088C52.3377 72.2371 58.113 83.057 68.335 86.1757C78.5569 89.2944 89.3548 83.5309 92.4527 73.3026Z"
                      fill="#00C8BC"/>
                <path
                    d="M29.5544 118.211C27.9396 116.791 27.781 114.333 29.1992 112.723L48.8759 90.3171L54.7163 95.4573L35.0396 117.863C33.6178 119.475 31.1655 119.634 29.5544 118.211Z"
                    fill="#00C8BC"/>
                <path opacity="0.3"
                      d="M71.7789 50.2638C65.7079 51.4104 60.7314 55.1277 58.586 61.0454C57.3095 64.5704 62.5904 67.1986 63.8878 63.6247C65.2645 59.8292 68.0759 56.9138 72.1633 56.1422C75.8442 55.4554 75.4983 49.5612 71.7789 50.2638Z"
                      fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0_1194_6802">
                    <rect width="130" height="130" fill="white"/>
                </clipPath>
            </defs>
        </svg>

    )
}

export default SvgLookup
