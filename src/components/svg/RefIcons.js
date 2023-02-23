import React from 'react';

const ReferralLevelIcon = (level, size = 12) => {
    switch (level) {
        case 1:
            // nguoi dung binh thuong
            return <NormalUser size={size} />;
        case 2:
            // doi tac chinh thuc
            return <OfficialUser size={size} />;
        case 3:
            // doi tac vang
            return <GoldIcon size={size} />;
        case 4:
            return <PlatinumIcon size={size} />;
        case 5:
            return <DiamondIcon size={size} />;
        default:
            return <NormalUser size={size} />;
    }
};

export default ReferralLevelIcon;

const NormalUser = ({ size = 12 }) => <svg width={size} height={size} viewBox='0 0 12 12' fill='none'
                                           xmlns='http://www.w3.org/2000/svg'>
    <path d='M6 12A6 6 0 1 1 6.001-.001 6 6 0 0 1 6 12z' fill='url(#ogdyl2hmqa)' />
    <path d='M6 10.199A4.199 4.199 0 1 1 6 1.8 4.199 4.199 0 0 1 6 10.2z' fill='url(#ns7vwfwwqb)' />
    <path d='M6 9.666a3.665 3.665 0 1 1-.001-7.331 3.665 3.665 0 0 1 0 7.33z' fill='url(#051ze4muzc)' />
    <path opacity='.6'
          d='M9.077 3.142A4.185 4.185 0 0 0 5.99 1.795 4.199 4.199 0 0 0 4.22 9.8c.267-2.96 2.21-5.506 4.857-6.658z'
          fill='url(#uetm7zygod)' />
    <path
        d='M5.495 7.703a.29.29 0 0 1-.214-.097l-1.106-1.21a.34.34 0 0 1 .003-.456.285.285 0 0 1 .424.003l.884.968 1.83-2.169a.285.285 0 0 1 .423-.022.34.34 0 0 1 .02.457l-2.042 2.42a.291.291 0 0 1-.216.106h-.006z'
        fill='#fff' />
    <defs>
        <linearGradient id='ogdyl2hmqa' x1='1.551' y1='1.55' x2='10.155' y2='10.153' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B1AEAD' />
            <stop offset='.094' stopColor='#E1DDDD' />
            <stop offset='.14' stopColor='#F5F1F0' />
            <stop offset='.258' stopColor='#FFFDFA' />
            <stop offset='.36' stopColor='#F5F1F0' />
            <stop offset='.489' stopColor='#B1AEAD' />
            <stop offset='.572' stopColor='#E1DDDD' />
            <stop offset='.613' stopColor='#F5F1F0' />
            <stop offset='.737' stopColor='#FFFDFA' />
            <stop offset='.839' stopColor='#F5F1F0' />
            <stop offset='1' stopColor='#B1AEAD' />
        </linearGradient>
        <linearGradient id='ns7vwfwwqb' x1='2.884' y1='2.883' x2='8.909' y2='8.908' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#0F1115' />
            <stop offset='.14' stopColor='#1C2228' />
            <stop offset='.258' stopColor='#2D352E' />
            <stop offset='.36' stopColor='#1C2228' />
            <stop offset='.489' stopColor='#0F1115' />
            <stop offset='.613' stopColor='#1C2228' />
            <stop offset='.737' stopColor='#2D352E' />
            <stop offset='.839' stopColor='#1C2228' />
            <stop offset='1' stopColor='#0F1115' />
        </linearGradient>
        <linearGradient id='051ze4muzc' x1='3.277' y1='3.276' x2='8.539' y2='8.539' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#161A1F' />
            <stop offset='.018' stopColor='#1A1F22' />
            <stop offset='.14' stopColor='#353E36' />
            <stop offset='.258' stopColor='#414D42' />
            <stop offset='.36' stopColor='#353E36' />
            <stop offset='.489' stopColor='#161A1F' />
            <stop offset='.505' stopColor='#1A1F22' />
            <stop offset='.613' stopColor='#353E36' />
            <stop offset='.737' stopColor='#414D42' />
            <stop offset='.839' stopColor='#353E36' />
            <stop offset='1' stopColor='#161A1F' />
        </linearGradient>
        <radialGradient id='uetm7zygod' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse'
                        gradientTransform='translate(8.694 5.152) scale(7.49507)'>
            <stop stopColor='#E8E8E8' />
            <stop offset='.054' stopColor='#A7A7A7' />
            <stop offset='.14' stopColor='#636363' />
            <stop offset='.218' stopColor='#4C4C4C' />
            <stop offset='.334' stopColor='#303030' />
            <stop offset='.459' stopColor='#1B1B1B' />
            <stop offset='.598' stopColor='#0C0C0C' />
            <stop offset='.76' stopColor='#030303' />
            <stop offset='1' />
        </radialGradient>
    </defs>
</svg>;

const PlatinumIcon = ({ size = 12 }) => <svg width={size} height={size} viewBox='0 0 12 12' fill='none'
                                             xmlns='http://www.w3.org/2000/svg'>
    <path d='M6 12A6 6 0 1 1 6 0a6 6 0 1 1 0 12z' fill='url(#50vsc1aeia)' />
    <path d='M6.001 11.87a5.87 5.87 0 1 1 0-11.741 5.87 5.87 0 0 1 0 11.74z' fill='url(#8rxxsrq4qb)' />
    <path
        d='M5.999 10.222A4.225 4.225 0 0 1 1.777 6a4.225 4.225 0 0 1 4.222-4.223A4.225 4.225 0 0 1 10.22 6 4.225 4.225 0 0 1 6 10.222z'
        fill='url(#tokd445irc)' />
    <path d='M6.001 10.107a4.107 4.107 0 1 1 0-8.215 4.107 4.107 0 0 1 0 8.215z' fill='url(#gmt3m6veid)' />
    <path d='M6 9.586a3.586 3.586 0 1 1 0-7.171 3.586 3.586 0 0 1 0 7.171z' fill='url(#dxaepbrfee)' />
    <path opacity='.6'
          d='M9.013 3.204A4.09 4.09 0 0 0 6 1.886 4.108 4.108 0 0 0 4.27 9.717c.253-2.896 2.154-5.387 4.744-6.513z'
          fill='url(#i6vx6k401f)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M5.488 11.026s-.284-.084-.353-.567c0 0 .368.245.353.567z'
          fill='url(#l7tu79647g)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M5.473 11.094s-.085.284-.567.353c-.008 0 .245-.368.567-.353z'
          fill='url(#zwny3v6yxh)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M4.636 10.873s-.26-.138-.23-.629c.008 0 .315.314.23.629z'
          fill='url(#ip707o4qci)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M4.606 10.942s-.138.26-.629.23c0-.007.315-.314.629-.23z'
          fill='url(#gltlnx7ujj)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.87 10.583s-.245-.169-.145-.651c-.008 0 .26.352.145.651z'
          fill='url(#yi2l6eeevk)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.825 10.645s-.169.245-.652.146c0 .007.353-.261.652-.146z'
          fill='url(#okdhr27h0l)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.12 10.16s-.2-.221.007-.666c-.008 0 .176.399-.008.667z'
          fill='url(#wecxuk28zm)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.067 10.214s-.223.2-.667-.008c0 0 .398-.183.667.008z'
          fill='url(#ks91b6yfmn)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.44 9.608s-.154-.253.13-.659c0 0 .099.43-.13.66z'
          fill='url(#dkde317xno)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.377 9.647s-.253.153-.659-.13c.008-.008.437-.108.659.13z'
          fill='url(#jehwwqh2kp)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.872 8.927s-.123-.268.206-.636c-.007 0 .046.444-.206.636z'
          fill='url(#21ovao63iq)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.803 8.965s-.268.123-.636-.207c0 0 .437-.053.636.207z'
          fill='url(#17srxnvdrr)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.445 8.199s-.107-.276.245-.62c0 0 .023.444-.245.62z'
          fill='url(#crcdpi1jgs)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.375 8.23s-.275.107-.62-.245c0-.008.444-.023.62.245z'
          fill='url(#8mw34ixc6t)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.143 7.431s-.092-.275.268-.613c0 .008.007.445-.268.613z'
          fill='url(#iqjd62f0au)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.075 7.462s-.276.092-.613-.269c0 0 .444-.007.613.269z'
          fill='url(#cpimxyel8v)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M.974 6.637s-.046-.292.368-.56c0 0-.069.437-.368.56z'
          fill='url(#teqqlsp3dw)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M.906 6.652s-.29.046-.56-.368c0 0 .438.07.56.368z'
          fill='url(#7nba6itavx)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M.952 5.792s.007-.299.467-.482c0 0-.153.413-.467.482z'
          fill='url(#z563yi5uqy)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M.874 5.793s-.299-.008-.483-.468c.008 0 .422.153.483.468z'
          fill='url(#c4vh40s0zz)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.066 4.957s.077-.284.567-.36c-.007 0-.245.367-.567.36z'
          fill='url(#89nsm6n5xA)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M.99 4.941s-.283-.077-.36-.567c.008 0 .376.238.36.567z'
          fill='url(#i61bt5rqeB)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.303 4.145s.153-.253.644-.192c0 0-.337.291-.644.192z'
          fill='url(#nt8wh6jhaC)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.242 4.107s-.253-.154-.192-.644c0 0 .291.337.192.644z'
          fill='url(#ftk5t7qu1D)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.704 3.378s.2-.214.667-.046c0-.007-.391.207-.667.046z'
          fill='url(#fn45t7megE)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M1.643 3.325s-.214-.2-.046-.667c0 0 .215.391.046.667z'
          fill='url(#m4v04sc7jF)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.217 2.667s.245-.169.66.1c0 0-.422.122-.66-.1z'
          fill='url(#z26szi3hlG)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.171 2.605s-.169-.245.1-.659c0 0 .122.43-.1.66z'
          fill='url(#fphut6hd2H)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.866 2.062s.261-.13.644.176c0 .008-.437.077-.644-.176z'
          fill='url(#oewtdjvugI)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M2.828 2s-.13-.26.177-.644c.007 0 .076.437-.177.644z'
          fill='url(#ium075dhvJ)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.612 1.578s.276-.115.628.23c0-.008-.437.03-.628-.23z'
          fill='url(#htcky1652K)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M3.58 1.51s-.114-.277.23-.63c0 0 .031.445-.23.63z'
          fill='url(#4qa1gyiefL)' />
    <path
        d='M5.971 11.08h-.153c-.054 0-.115 0-.184-.008-.038 0-.077-.007-.115-.007h-.061c-.023 0-.046-.008-.07-.008-.091-.008-.199-.023-.306-.038-.115-.015-.23-.046-.36-.07a5.124 5.124 0 0 1-1.74-.796c-.076-.054-.145-.115-.222-.169-.076-.061-.145-.122-.222-.184a4.305 4.305 0 0 1-.414-.421c-.03-.038-.069-.077-.1-.115a1.703 1.703 0 0 1-.091-.123l-.046-.06-.046-.062a4.83 4.83 0 0 1-.414-.674 4.022 4.022 0 0 1-.253-.59L1.12 7.6l-.023-.076-.023-.077-.046-.153-.038-.161a5.17 5.17 0 0 1-.115-1.28c0-.207.03-.421.054-.628.023-.1.038-.207.054-.307.023-.1.053-.199.076-.299.115-.39.268-.75.445-1.072.183-.322.39-.606.597-.851.215-.238.43-.444.636-.605.054-.039.1-.077.146-.115.046-.039.1-.07.145-.1.046-.03.092-.061.13-.092l.123-.077c.085-.045.154-.091.215-.122.069-.03.123-.061.168-.084l.138-.07c.008 0 .016 0 .016.008s0 .016-.008.016l-.138.069c-.046.023-.1.053-.16.084-.062.038-.131.084-.215.13-.039.023-.085.046-.123.077-.038.03-.084.061-.13.092-.046.03-.092.069-.138.1a13.12 13.12 0 0 0-.146.122c-.199.16-.406.375-.613.613a6.026 6.026 0 0 0-.582.843 4.993 4.993 0 0 0-.422 1.057c-.023.1-.053.192-.069.292-.015.1-.038.199-.053.298-.023.2-.054.407-.054.613-.015.414.023.843.115 1.25l.038.153.046.153.023.077.023.076.054.153c.077.2.153.391.253.575.092.184.2.36.314.529.03.038.061.084.084.123l.046.06.046.062.092.115c.03.038.062.077.1.115.13.153.268.291.406.421.069.062.138.13.215.184.076.054.145.115.222.169.291.214.59.39.881.521a5.1 5.1 0 0 0 .812.299c.123.03.246.061.353.084.107.023.214.039.306.054.023 0 .046.008.07.008.022 0 .045.007.06.007.039.008.077.008.116.008.068.008.13.008.183.015l.146.023z'
        fill='url(#oqcnfucz5M)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M6.448 11.026s.284-.084.353-.567c-.008 0-.368.245-.353.567z'
          fill='url(#kc8jk0tgeN)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M6.464 11.094s.084.284.567.353c.008 0-.245-.368-.567-.353z'
          fill='url(#l3jf67z3tO)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M7.29 10.873s.26-.138.23-.629c0 0-.307.314-.23.629z'
          fill='url(#t5j2vvqw0P)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M7.329 10.942s.138.26.628.23c0-.007-.322-.314-.628-.23z'
          fill='url(#l2irpmt89Q)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.066 10.583s.245-.169.145-.651c.008 0-.26.352-.145.651z'
          fill='url(#577ajdfl7R)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.105 10.645s.168.245.651.146c0 .007-.352-.261-.651-.146z'
          fill='url(#41scu5ui0S)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.815 10.16s.2-.221-.008-.666c.008 0-.176.399.008.667z'
          fill='url(#sxwl6ab47T)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.869 10.214s.222.2.667-.008c0 0-.407-.183-.667.008z'
          fill='url(#pgcixh78bU)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.495 9.608s.153-.253-.13-.659c-.008 0-.107.43.13.66z'
          fill='url(#1m6rcf8rsV)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.556 9.647s.253.153.659-.13c-.008-.008-.437-.108-.66.13z'
          fill='url(#7a7wlrhmaW)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.066 8.927s.122-.268-.207-.636c0 0-.046.444.207.636z'
          fill='url(#84yyufxe8X)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.134 8.965s.269.123.636-.207c0 0-.444-.053-.636.207z'
          fill='url(#d02lv1ggoY)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.493 8.199s.107-.276-.246-.62c0 0-.022.444.246.62z'
          fill='url(#b820gbblfZ)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.561 8.23s.276.107.62-.245c0-.008-.444-.023-.62.245z'
          fill='url(#rqmpw8bxyaa)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.791 7.431s.092-.275-.268-.613c-.007.008-.007.445.268.613z'
          fill='url(#dnz5x545kab)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.854 7.462s.276.092.613-.269c0 0-.437-.007-.613.269z'
          fill='url(#992tg6f1fac)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.962 6.637s.046-.292-.368-.56c0 0 .069.437.368.56z'
          fill='url(#qk1hsmf6wad)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M11.03 6.652s.291.046.56-.368c0 0-.438.07-.56.368z'
          fill='url(#6i5qucb8nae)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.984 5.792s-.008-.299-.467-.482c0 0 .145.413.467.482z'
          fill='url(#atiwjxknzaf)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M11.053 5.793s.3-.008.483-.468c0 0-.414.153-.483.468z'
          fill='url(#a9d75a56hag)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.868 4.957s-.077-.284-.567-.36c0 0 .245.367.567.36z'
          fill='url(#yrmsc5dqyah)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.936 4.941s.284-.077.36-.567c0 0-.367.238-.36.567z'
          fill='url(#hhx6xed09ai)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.63 4.145s-.153-.253-.643-.192c0 0 .337.291.643.192z'
          fill='url(#3typz8zyqaj)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.692 4.107s.253-.154.191-.644c0 0-.29.337-.191.644z'
          fill='url(#n05pao2tiak)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.234 3.378s-.2-.214-.667-.046c0-.007.391.207.667.046z'
          fill='url(#14wxce0o1al)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M10.288 3.325s.215-.2.046-.667c.008 0-.207.391-.046.667z'
          fill='url(#nb2ows2m1am)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.72 2.667s-.245-.169-.659.1c-.008 0 .422.122.66-.1z'
          fill='url(#21iy7b7lcan)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.758 2.605s.169-.245-.1-.659c.008 0-.114.43.1.66z'
          fill='url(#pl6gqkznoao)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.067 2.062s-.26-.13-.643.176c0 .008.436.077.643-.176z'
          fill='url(#vt872xq37ap)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M9.106 2s.138-.26-.176-.644c-.008 0-.077.437.176.644z'
          fill='url(#ewcxnrnalaq)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.318 1.578s-.276-.115-.628.23c0-.008.444.03.628-.23z'
          fill='url(#fnp3r1b9rar)' />
    <path fillRule='evenodd' clipRule='evenodd' d='M8.358 1.51s.115-.277-.23-.63c0 0-.039.445.23.63z'
          fill='url(#8859xlmkoas)' />
    <path
        d='M5.963 11.08s.053 0 .153-.007c.053 0 .115-.008.184-.016.038 0 .076-.007.115-.007.023 0 .038-.008.06-.008.024 0 .047-.008.07-.008.092-.015.191-.023.306-.053.108-.023.23-.054.353-.085a4.61 4.61 0 0 0 .812-.298c.291-.13.59-.307.881-.521.077-.054.146-.115.223-.169.069-.061.145-.123.214-.184.138-.13.276-.268.406-.421.03-.039.07-.077.1-.115l.092-.115.046-.062.046-.06c.03-.04.061-.085.084-.123.115-.169.222-.345.314-.53.1-.183.176-.375.253-.574l.054-.153a.965.965 0 0 0 .023-.077l.023-.076.046-.154.038-.153c.092-.414.13-.835.115-1.249 0-.215-.03-.414-.054-.613-.015-.1-.038-.2-.053-.299-.023-.1-.046-.191-.07-.291a5.436 5.436 0 0 0-.42-1.057 5.438 5.438 0 0 0-.583-.843 5.133 5.133 0 0 0-.613-.613l-.146-.123c-.046-.038-.1-.069-.138-.1a1.914 1.914 0 0 1-.13-.092c-.038-.03-.084-.053-.122-.076-.077-.046-.146-.092-.215-.13-.061-.031-.115-.062-.161-.085l-.138-.069c-.008 0-.008-.007-.008-.015s.008-.008.016-.008l.138.07c.046.022.1.053.168.083.062.039.138.077.215.123.038.023.084.046.122.077.046.03.085.061.13.092.047.03.093.061.146.1.046.038.1.076.146.114.207.161.421.368.636.606.207.245.414.528.598.85.176.322.33.682.444 1.073.023.1.054.2.077.299.015.1.038.2.053.306.031.207.054.422.054.629.015.421-.023.858-.115 1.28l-.038.16-.046.154-.023.076c-.008.023-.016.054-.023.077l-.054.153a4.816 4.816 0 0 1-.575 1.134c-.03.046-.06.084-.091.13l-.046.062-.046.061c-.031.038-.062.077-.092.123-.031.038-.07.076-.1.115-.13.153-.276.29-.414.421-.076.061-.145.13-.222.184a5.191 5.191 0 0 1-1.126.682c-.3.13-.575.222-.836.284-.13.03-.245.053-.36.068-.115.023-.214.031-.306.039-.023 0-.046.007-.07.007h-.06c-.039 0-.085.008-.116.008-.069.008-.138.008-.184.008-.107-.016-.16-.016-.16-.016z'
        fill='url(#fin5fihifat)' />
    <path
        d='m8.044 8.714.061.191-.283-.207L6.006 7.38l-.008-.007-.015.007-1.816 1.318-.284.207.061-.191.544-1.67.023-.085.177-.536-.054-.039-.337-.245L2.58 4.89h2.606l.812-2.483.805 2.483h2.605L7.692 6.139l-.338.245-.053.039.176.536.023.084.544 1.67z'
        fill='url(#s4jez9f8oau)' />
    <path
        d='M5.998 7.282 4.021 8.714l.751-2.321L2.803 4.96H5.24l.758-2.314.751 2.314h2.437l-1.97 1.433.752 2.321-1.97-1.432z'
        fill='url(#gk7mgqnleav)' />
    <path d='m6 7.165-1.81 1.31.69-2.114-1.8-1.31h2.23L6 2.935 6.68 5.05h2.23l-1.8 1.31.689 2.116L6 7.166z'
          fill='url(#8fen7b9pdaw)' />
    <path d='M5.998 5.832V2.936l-.69 2.114.69.782z' fill='url(#igrev02y4ax)' />
    <path d='M5.998 5.832V2.936L6.68 5.05l-.682.782z' fill='url(#szp73jjpvay)' />
    <path d='m5.999 5.833-1.119.529-.69 2.115L6 5.833z' fill='url(#4vdqg3wlaaz)' />
    <path d='m5.998 5.833 1.11.529.69 2.115-1.8-2.644z' fill='url(#4h28ti58gaA)' />
    <path d='m6 5.832-.69-.781H3.08L6 5.832z' fill='url(#dy0hoizp3aB)' />
    <path d='m5.998 5.832.682-.781h2.23l-2.912.781z' fill='url(#374rrx3hcaC)' />
    <path d='m6 5.832-2.92-.781 1.8 1.31L6 5.832z' fill='url(#ohfol9yv9aD)' />
    <path d='m5.998 5.832 2.912-.781-1.801 1.31-1.111-.529z' fill='url(#xx9i7p5wraE)' />
    <path d='M5.999 5.833v1.333l-1.808 1.31 1.808-2.643z' fill='url(#gx5kg6jmvaF)' />
    <path d='M5.998 5.833v1.333l1.8 1.31-1.8-2.643z' fill='url(#cqqppzknfaG)' />
    <path
        d='M5.997 5.832c.047 0 .085-.628.085-1.402 0-.775-.038-1.403-.085-1.403-.046 0-.084.628-.084 1.403 0 .774.038 1.402.084 1.402z'
        fill='url(#19e9sg6axaH)' />
    <path
        d='M5.997 5.832c.047 0 .085-.628.085-1.402 0-.775-.038-1.403-.085-1.403-.046 0-.084.628-.084 1.403 0 .774.038 1.402.084 1.402z'
        fill='url(#jw9zdksdwaI)' />
    <path
        d='M5.669 5.335c.214.245.352.467.322.498-.039.03-.238-.138-.452-.383-.215-.245-.353-.468-.322-.498.038-.03.245.138.452.383z'
        fill='url(#gdvemdjbvaJ)' />
    <path
        d='M5.669 5.335c.214.245.352.467.322.498-.039.03-.238-.138-.452-.383-.215-.245-.353-.468-.322-.498.038-.03.245.138.452.383z'
        fill='url(#gigdn3fj4aK)' />
    <path
        d='M5.331 6.046c.345-.16.636-.252.652-.214.023.046-.238.207-.583.368-.344.16-.636.253-.65.214-.016-.038.244-.207.581-.368z'
        fill='url(#m5adjhcx7aL)' />
    <path
        d='M5.331 6.046c.345-.16.636-.252.652-.214.023.046-.238.207-.583.368-.344.16-.636.253-.65.214-.016-.038.244-.207.581-.368z'
        fill='url(#96heeqanfaM)' />
    <path
        d='M6.321 5.335c-.214.245-.352.467-.322.498.039.03.238-.138.453-.383.214-.245.352-.468.321-.498-.038-.03-.237.138-.452.383z'
        fill='url(#ksorfv38waN)' />
    <path
        d='M6.321 5.335c-.214.245-.352.467-.322.498.039.03.238-.138.453-.383.214-.245.352-.468.321-.498-.038-.03-.237.138-.452.383z'
        fill='url(#1g4ccszvxaO)' />
    <path
        d='M6.657 6.046c-.344-.16-.636-.252-.65-.214-.024.046.237.207.581.368.345.16.636.253.652.214.015-.038-.245-.207-.583-.368z'
        fill='url(#memcv6rtwaP)' />
    <path
        d='M6.657 6.046c-.344-.16-.636-.252-.65-.214-.024.046.237.207.581.368.345.16.636.253.652.214.015-.038-.245-.207-.583-.368z'
        fill='url(#kx5dt24vlaQ)' />
    <path
        d='M4.392 5.313c.897.237 1.617.467 1.602.521-.016.046-.751-.107-1.648-.345-.896-.237-1.617-.467-1.601-.52.015-.047.75.106 1.647.344z'
        fill='url(#36ih1ynd7aR)' />
    <path
        d='M4.392 5.313c.897.237 1.617.467 1.602.521-.016.046-.751-.107-1.648-.345-.896-.237-1.617-.467-1.601-.52.015-.047.75.106 1.647.344z'
        fill='url(#r6xis7um4aS)' />
    <path
        d='M4.981 7.182c.514-.774.966-1.371 1.004-1.348.038.03-.345.674-.858 1.448-.514.774-.966 1.372-1.004 1.349-.038-.031.345-.675.858-1.449z'
        fill='url(#0uz3uaac2aT)' />
    <path
        d='M4.981 7.182c.514-.774.966-1.371 1.004-1.348.038.03-.345.674-.858 1.448-.514.774-.966 1.372-1.004 1.349-.038-.031.345-.675.858-1.449z'
        fill='url(#q4i1nmj4xaU)' />
    <path
        d='M7.592 5.313c-.896.237-1.616.467-1.601.521.015.046.75-.107 1.647-.345.897-.237 1.617-.467 1.602-.52-.015-.047-.751.106-1.648.344z'
        fill='url(#n5zwar4gsaV)' />
    <path
        d='M7.592 5.313c-.896.237-1.616.467-1.601.521.015.046.75-.107 1.647-.345.897-.237 1.617-.467 1.602-.52-.015-.047-.751.106-1.648.344z'
        fill='url(#dmuhkzhwjaW)' />
    <path
        d='M7.004 7.182C6.491 6.408 6.04 5.811 6 5.834c-.038.03.345.674.859 1.448.513.774.965 1.372 1.003 1.349.039-.023-.344-.675-.858-1.449z'
        fill='url(#1aguhfa2yaX)' />
    <path
        d='M7.004 7.182C6.491 6.408 6.04 5.811 6 5.834c-.038.03.345.674.859 1.448.513.774.965 1.372 1.003 1.349.039-.023-.344-.675-.858-1.449z'
        fill='url(#6ggvnqvxyaY)' />
    <path
        d='M5.99 7.388c.047 0 .085-.398.085-.889 0-.49-.038-.889-.084-.889-.047 0-.085.398-.085.89 0 .49.038.888.085.888z'
        fill='url(#la0cmzgcfaZ)' />
    <path
        d='M5.99 7.388c.047 0 .085-.398.085-.889 0-.49-.038-.889-.084-.889-.047 0-.085.398-.085.89 0 .49.038.888.085.888z'
        fill='url(#gaib9uw2fba)' />
    <defs>
        <linearGradient id='50vsc1aeia' x1='-.199' y1='5.997' x2='12.413' y2='5.997' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='8rxxsrq4qb' x1='1.648' y1='1.646' x2='10.065' y2='10.063' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='tokd445irc' x1='2.865' y1='2.866' x2='8.922' y2='8.922' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='gmt3m6veid' x1='2.952' y1='2.95' x2='8.846' y2='8.844' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#0F1115' />
            <stop offset='.14' stopColor='#1C2228' />
            <stop offset='.258' stopColor='#323232' />
            <stop offset='.36' stopColor='#1C2228' />
            <stop offset='.489' stopColor='#0F1115' />
            <stop offset='.613' stopColor='#1C2228' />
            <stop offset='.737' stopColor='#323232' />
            <stop offset='.839' stopColor='#1C2228' />
            <stop offset='1' stopColor='#0F1115' />
        </linearGradient>
        <linearGradient id='dxaepbrfee' x1='3.336' y1='3.336' x2='8.484' y2='8.484' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#161A1F' />
            <stop offset='.021' stopColor='#1C1F24' />
            <stop offset='.14' stopColor='#3B3B3B' />
            <stop offset='.258' stopColor='#4A4A4A' />
            <stop offset='.36' stopColor='#3B3B3B' />
            <stop offset='.489' stopColor='#161A1F' />
            <stop offset='.508' stopColor='#1C1F24' />
            <stop offset='.613' stopColor='#3B3B3B' />
            <stop offset='.737' stopColor='#4A4A4A' />
            <stop offset='.839' stopColor='#3B3B3B' />
            <stop offset='1' stopColor='#161A1F' />
        </linearGradient>
        <linearGradient id='l7tu79647g' x1='-1.653' y1='10.74' x2='12.639' y2='10.74' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='zwny3v6yxh' x1='-1.652' y1='11.27' x2='12.639' y2='11.27' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='ip707o4qci' x1='-1.653' y1='10.559' x2='12.637' y2='10.559' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='gltlnx7ujj' x1='-1.654' y1='11.049' x2='12.639' y2='11.049' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset='.737' stopColor='#fff' />
            <stop offset='.839' stopColor='#F5F5F5' />
            <stop offset='1' stopColor='#B0AA9F' />
        </linearGradient>
        <linearGradient id='yi2l6eeevk' x1='-1.653' y1='10.259' x2='12.637' y2='10.259' gradientUnits='userSpaceOnUse'>
            <stop stopColor='#B0AA9F' />
            <stop offset='.085' stopColor='#DCDAD6' />
            <stop offset='.14' stopColor='#F5F5F5' />
            <stop offset='.258' stopColor='#fff' />
            <stop offset='.36' stopColor='#F5F5F5' />
            <stop offset='.489' stopColor='#B0AA9F' />
            <stop offset='.564' stopColor='#DCDAD6' />
            <stop offset='.613' stopColor='#F5F5F5' />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="okdhr27h0l" x1="-1.653" y1="10.717" x2="12.639" y2="10.717" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="wecxuk28zm" x1="-1.654" y1="9.826" x2="12.638" y2="9.826" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="ks91b6yfmn" x1="-1.653" y1="10.213" x2="12.639" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="dkde317xno" x1="-1.651" y1="9.277" x2="12.638" y2="9.277" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="jehwwqh2kp" x1="-1.653" y1="9.589" x2="12.64" y2="9.589" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="21ovao63iq" x1="-1.652" y1="8.612" x2="12.639" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="17srxnvdrr" x1="-1.652" y1="8.87" x2="12.641" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="crcdpi1jgs" x1="-1.65" y1="7.888" x2="12.642" y2="7.888" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="8mw34ixc6t" x1="-1.651" y1="8.111" x2="12.643" y2="8.111" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="iqjd62f0au" x1="-1.654" y1="7.129" x2="12.64" y2="7.129" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="cpimxyel8v" x1="-1.652" y1="7.331" x2="12.64" y2="7.331" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="teqqlsp3dw" x1="-1.653" y1="6.358" x2="12.639" y2="6.358" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="7nba6itavx" x1="-1.652" y1="6.47" x2="12.64" y2="6.47" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="z563yi5uqy" x1="-1.653" y1="5.55" x2="12.641" y2="5.55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="c4vh40s0zz" x1="-1.654" y1="5.559" x2="12.639" y2="5.559" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="89nsm6n5xA" x1="-1.653" y1="4.776" x2="12.638" y2="4.776" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="i61bt5rqeB" x1="-1.652" y1="4.656" x2="12.641" y2="4.656" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="nt8wh6jhaC" x1="-1.654" y1="4.051" x2="12.64" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="ftk5t7qu1D" x1="-1.654" y1="3.786" x2="12.638" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="fn45t7megE" x1="-1.652" y1="3.35" x2="12.642" y2="3.35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="m4v04sc7jF" x1="-1.652" y1="2.993" x2="12.644" y2="2.993" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="z26szi3hlG" x1="-1.652" y1="2.707" x2="12.64" y2="2.707" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="fphut6hd2H" x1="-1.652" y1="2.278" x2="12.641" y2="2.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="oewtdjvugI" x1="-1.654" y1="2.144" x2="12.638" y2="2.144" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="ium075dhvJ" x1="-1.654" y1="1.678" x2="12.639" y2="1.678" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="htcky1652K" x1="-1.652" y1="1.682" x2="12.641" y2="1.682" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="4qa1gyiefL" x1="-1.652" y1="1.196" x2="12.641" y2="1.196" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="oqcnfucz5M" x1="-1.653" y1="6.253" x2="12.64" y2="6.253" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="kc8jk0tgeN" x1="-1.65" y1="10.74" x2="12.641" y2="10.74" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="l3jf67z3tO" x1="-1.65" y1="11.27" x2="12.642" y2="11.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="t5j2vvqw0P" x1="-1.652" y1="10.559" x2="12.64" y2="10.559" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="l2irpmt89Q" x1="-1.652" y1="11.049" x2="12.642" y2="11.049" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="577ajdfl7R" x1="-1.65" y1="10.259" x2="12.642" y2="10.259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="41scu5ui0S" x1="-1.65" y1="10.717" x2="12.643" y2="10.717" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="sxwl6ab47T" x1="-1.652" y1="9.826" x2="12.641" y2="9.826" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="pgcixh78bU" x1="-1.651" y1="10.213" x2="12.641" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="1m6rcf8rsV" x1="-1.653" y1="9.277" x2="12.639" y2="9.277" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="7a7wlrhmaW" x1="-1.655" y1="9.589" x2="12.638" y2="9.589" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="84yyufxe8X" x1="-1.651" y1="8.612" x2="12.643" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="d02lv1ggoY" x1="-1.65" y1="8.87" x2="12.642" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="b820gbblfZ" x1="-1.652" y1="7.888" x2="12.64" y2="7.888" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="rqmpw8bxyaa" x1="-1.653" y1="8.111" x2="12.64" y2="8.111" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="dnz5x545kab" x1="-1.656" y1="7.129" x2="12.641" y2="7.129" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="992tg6f1fac" x1="-1.651" y1="7.331" x2="12.642" y2="7.331" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="qk1hsmf6wad" x1="-1.65" y1="6.358" x2="12.642" y2="6.358" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="6i5qucb8nae" x1="-1.651" y1="6.47" x2="12.641" y2="6.47" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="atiwjxknzaf" x1="-1.65" y1="5.55" x2="12.641" y2="5.55" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="a9d75a56hag" x1="-1.653" y1="5.559" x2="12.642" y2="5.559" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="yrmsc5dqyah" x1="-1.652" y1="4.776" x2="12.64" y2="4.776" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="hhx6xed09ai" x1="-1.655" y1="4.656" x2="12.64" y2="4.656" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="3typz8zyqaj" x1="-1.652" y1="4.051" x2="12.64" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="n05pao2tiak" x1="-1.65" y1="3.786" x2="12.64" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="14wxce0o1al" x1="-1.651" y1="3.35" x2="12.642" y2="3.35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="nb2ows2m1am" x1="-1.649" y1="2.993" x2="12.643" y2="2.993" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="21iy7b7lcan" x1="-1.65" y1="2.707" x2="12.642" y2="2.707" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="pl6gqkznoao" x1="-1.65" y1="2.278" x2="12.641" y2="2.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="vt872xq37ap" x1="-1.652" y1="2.144" x2="12.64" y2="2.144" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="ewcxnrnalaq" x1="-1.652" y1="1.678" x2="12.641" y2="1.678" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="fnp3r1b9rar" x1="-1.651" y1="1.682" x2="12.643" y2="1.682" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="8859xlmkoas" x1="-1.649" y1="1.196" x2="12.643" y2="1.196" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="fin5fihifat" x1="-1.654" y1="6.254" x2="12.639" y2="6.254" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B0AA9F" />
            <stop offset=".085" stopColor="#DCDAD6" />
            <stop offset=".14" stopColor="#F5F5F5" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#F5F5F5" />
            <stop offset=".489" stopColor="#B0AA9F" />
            <stop offset=".564" stopColor="#DCDAD6" />
            <stop offset=".613" stopColor="#F5F5F5" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#F5F5F5" />
            <stop offset="1" stopColor="#B0AA9F" />
        </linearGradient>
        <linearGradient id="s4jez9f8oau" x1="2.488" y1="2.737" x2="8.96" y2="9.209" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="gk7mgqnleav" x1="3.296" y1="3.529" x2="7.98" y2="8.214" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".579" stopColor="#CBCBCB" />
            <stop offset=".867" stopColor="#838383" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <linearGradient id="8fen7b9pdaw" x1="3.155" y1="3.367" x2="8.964" y2="9.176" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".579" stopColor="#CBCBCB" />
            <stop offset=".867" stopColor="#838383" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <linearGradient id="igrev02y4ax" x1="5.651" y1="5.877" x2="5.651" y2="2.847" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="szp73jjpvay" x1="6.753" y1="3.599" x2="5.138" y2="5.267" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="4vdqg3wlaaz" x1="4.291" y1="8.353" x2="5.66" y2="5.663" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="4h28ti58gaA" x1="7.7" y1="8.353" x2="6.331" y2="5.663" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".579" stopColor="#CBCBCB" />
            <stop offset=".867" stopColor="#838383" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <linearGradient id="dy0hoizp3aB" x1="3.121" y1="5.13" x2="6.577" y2="5.556" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".086" stopColor="#7E7E7E" />
            <stop offset=".302" stopColor="#B5B5B5" />
            <stop offset=".488" stopColor="#DDD" />
            <stop offset=".635" stopColor="#F6F6F6" />
            <stop offset=".725" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="374rrx3hcaC" x1="9.2" y1="4.938" x2="6.118" y2="5.481" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".463" stopColor="#F6F6F6" />
            <stop offset=".587" stopColor="#DDD" />
            <stop offset=".745" stopColor="#B5B5B5" />
            <stop offset=".927" stopColor="#7E7E7E" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <linearGradient id="ohfol9yv9aD" x1="5.715" y1="6.19" x2="2.694" y2="5.167" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="xx9i7p5wraE" x1="5.862" y1="6.33" x2="8.883" y2="5.307" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".579" stopColor="#CBCBCB" />
            <stop offset=".867" stopColor="#838383" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <linearGradient id="gx5kg6jmvaF" x1="6.1" y1="6.353" x2="4.357" y2="8.838" gradientUnits="userSpaceOnUse">
            <stop stopColor="#666" />
            <stop offset=".134" stopColor="#838383" />
            <stop offset=".421" stopColor="#CBCBCB" />
            <stop offset=".613" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="cqqppzknfaG" x1="5.509" y1="5.809" x2="7.252" y2="8.294" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset=".387" stopColor="#fff" />
            <stop offset=".579" stopColor="#CBCBCB" />
            <stop offset=".867" stopColor="#838383" />
            <stop offset="1" stopColor="#666" />
        </linearGradient>
        <radialGradient id="i6vx6k401f" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(8.637 5.17) scale(7.33234)">
            <stop stopColor="#E8E8E8" />
            <stop offset=".054" stopColor="#A6A6A6" />
            <stop offset=".14" stopColor="#606060" />
            <stop offset=".209" stopColor="#4C4C4C" />
            <stop offset=".326" stopColor="#303030" />
            <stop offset=".453" stopColor="#1B1B1B" />
            <stop offset=".594" stopColor="#0C0C0C" />
            <stop offset=".757" stopColor="#030303" />
            <stop offset="1" />
        </radialGradient>
        <radialGradient id="19e9sg6axaH" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 5.994 4.427)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="jw9zdksdwaI" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 5.994 4.427)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gdvemdjbvaJ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.605 5.392)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gigdn3fj4aK" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.605 5.392)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="m5adjhcx7aL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.372 6.124)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="96heeqanfaM" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.372 6.124)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ksorfv38waN" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-138.906 4.204 1.5) scale(.08792 .58534)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="1g4ccszvxaO" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-138.906 4.204 1.5) scale(.08792 .58534)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="memcv6rtwaP" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.618 6.124)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kx5dt24vlaQ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.618 6.124)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="36ih1ynd7aR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-75.101 5.698 -.14) scale(.08795 1.68034)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="r6xis7um4aS" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-75.101 5.698 -.14) scale(.08795 1.68034)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="0uz3uaac2aT" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.626 2.848) scale(.08794 1.6805)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="q4i1nmj4xaU" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.626 2.848) scale(.08794 1.6805)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="n5zwar4gsaV" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.616 5.402)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dmuhkzhwjaW" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.616 5.402)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="1aguhfa2yaX" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .93409 1.39704 6.929 7.23)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="6ggvnqvxyaY" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .93409 1.39704 6.929 7.23)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="la0cmzgcfaZ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.99 6.5)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gaib9uw2fba" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.99 6.5)">
            <stop stopColor="#fff" />
            <stop offset=".088" stopColor="#F3F3F3" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2D2D2" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D9D9D" stopOpacity=".534" />
            <stop offset=".73" stopColor="#535353" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
    </defs>
</svg>

const GoldIcon = ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 12 12" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12A6 6 0 1 1 6 0a6 6 0 0 1 6 6c.008 3.31-2.682 6-6 6z" fill="url(#czu2pxl7ta)" />
    <path d="M6.001 11.87A5.87 5.87 0 1 1 6.002.13a5.87 5.87 0 0 1 0 11.74z" fill="url(#i7y3t7j41b)" />
    <path
        d="M5.999 10.222A4.225 4.225 0 0 1 1.776 6 4.225 4.225 0 0 1 6 1.777 4.225 4.225 0 0 1 10.22 6a4.215 4.215 0 0 1-4.222 4.222z"
        fill="url(#xyghxq1d2c)" />
    <path d="M6.001 10.107A4.107 4.107 0 1 1 10.108 6a4.098 4.098 0 0 1-4.107 4.107z" fill="url(#ola07jinvd)" />
    <path d="M6 9.586A3.586 3.586 0 1 1 9.586 6 3.581 3.581 0 0 1 6 9.586z" fill="url(#dxzx14z7de)" />
    <path opacity=".6"
          d="M9.02 3.203a4.094 4.094 0 0 0-3.019-1.318 4.108 4.108 0 0 0-1.732 7.831C4.53 6.82 6.43 4.33 9.02 3.203z"
          fill="url(#2i19kuf7uf)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.497 11.026s-.283-.084-.352-.567c0 0 .368.245.352.567z"
          fill="url(#t1nm0fo0ag)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.475 11.094s-.084.284-.567.353c0 0 .245-.368.567-.353z"
          fill="url(#14mrk7xe7h)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.646 10.873s-.26-.137-.23-.628c0 0 .314.314.23.629z"
          fill="url(#mv8w8pg7ji)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.615 10.943s-.138.26-.628.23c0-.007.314-.314.628-.23z"
          fill="url(#0r5m15ac2j)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.87 10.583s-.245-.169-.145-.651c0 0 .268.352.145.651z"
          fill="url(#8kuerncbqk)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.832 10.644s-.169.245-.651.146c0 .007.352-.261.651-.146z"
          fill="url(#dkciwfk7pl)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.12 10.162s-.2-.222.007-.667c0 0 .184.399-.008.667z"
          fill="url(#g7q3heh50m)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.074 10.215s-.222.2-.667-.008c-.007 0 .399-.184.667.008z"
          fill="url(#6j228k7rdn)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.446 9.61s-.153-.254.13-.66c0 0 .1.43-.13.66z"
          fill="url(#0ulal5n5zo)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.384 9.648s-.253.153-.659-.13c0-.008.437-.108.66.13z"
          fill="url(#361e54yphp)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.872 8.927s-.123-.268.207-.636c0 0 .053.444-.207.636z"
          fill="url(#7gyldky4rq)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.81 8.965s-.268.123-.635-.207c0 0 .436-.053.636.207z"
          fill="url(#b6qi6bgw3r)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.45 8.2s-.107-.276.245-.62c0 0 .023.444-.245.62z"
          fill="url(#t5nkup1sms)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.38 8.23s-.276.108-.62-.244c0-.008.444-.023.62.245z"
          fill="url(#lk1mdxmvqt)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.152 7.433s-.092-.276.268-.613c0 .008.008.445-.268.613z"
          fill="url(#as90xrkw9u)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.084 7.464s-.276.091-.613-.269c0 0 .445-.007.613.269z"
          fill="url(#40v8bbcx2v)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.984 6.638s-.046-.292.368-.56c0 0-.07.437-.368.56z"
          fill="url(#koy42a6bqw)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.907 6.653s-.292.046-.56-.368c0 0 .445.07.56.368z"
          fill="url(#mbcxb0lxzx)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.961 5.793s.008-.299.468-.482c-.008 0-.154.413-.468.482z"
          fill="url(#nb83g7ngny)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.884 5.794s-.3-.008-.483-.468c.008 0 .421.153.483.468z"
          fill="url(#y8pkue5yiz)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.076 4.958s.077-.284.567-.36c-.007 0-.245.367-.567.36z"
          fill="url(#y0o19xldbA)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1 4.942s-.283-.077-.36-.567c.008 0 .376.238.36.567z"
          fill="url(#v3icskbziB)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.31 4.145s.154-.253.644-.192c-.008 0-.337.291-.644.192z"
          fill="url(#zlru62axpC)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.242 4.107s-.253-.154-.192-.644c.008 0 .292.337.192.644z"
          fill="url(#rxjsf5clgD)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.702 3.38s.199-.214.666-.046c0-.008-.383.207-.666.046z"
          fill="url(#wkci842i8E)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.648 3.327s-.214-.2-.046-.667c0 0 .215.391.046.667z"
          fill="url(#d81e4zpp4F)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.224 2.668s.246-.17.66.1c0 0-.422.122-.66-.1z"
          fill="url(#lcjoucnakG)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.178 2.606s-.168-.245.1-.659c0 0 .122.43-.1.66z"
          fill="url(#fvpmtyt2pH)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.876 2.063s.26-.13.644.176c0 .008-.437.077-.644-.176z"
          fill="url(#xfci6b533I)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.838 2.001s-.13-.26.176-.644c0 0 .07.437-.176.644z"
          fill="url(#z7agwygyeJ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.62 1.579s.275-.115.627.23c0-.008-.436.03-.628-.23z"
          fill="url(#b3ou3vjg8K)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.588 1.51s-.115-.276.23-.628c0 0 .03.444-.23.628z"
          fill="url(#sspxhwv1iL)" />
    <path
        d="M5.978 11.081h-.153c-.054 0-.115 0-.184-.008-.038 0-.077-.007-.115-.007h-.061c-.023 0-.046-.008-.07-.008-.091-.008-.199-.023-.306-.038-.115-.015-.23-.046-.36-.07a5.122 5.122 0 0 1-1.74-.796c-.076-.054-.145-.115-.222-.169-.076-.061-.145-.122-.222-.184a4.305 4.305 0 0 1-.414-.421c-.03-.038-.069-.077-.1-.115a1.706 1.706 0 0 1-.091-.123l-.046-.06-.046-.062a4.83 4.83 0 0 1-.414-.674 4.022 4.022 0 0 1-.253-.59l-.053-.154-.023-.076-.023-.077-.046-.153-.039-.161a5.17 5.17 0 0 1-.115-1.28c0-.207.031-.421.054-.628.023-.1.038-.207.054-.307.023-.1.053-.199.076-.299.115-.39.268-.75.445-1.072.184-.322.39-.606.597-.851a5.113 5.113 0 0 1 .782-.72c.046-.039.1-.07.146-.1.046-.03.092-.061.13-.092l.122-.077c.085-.046.154-.092.215-.122.069-.03.123-.061.169-.084l.138-.07c.007 0 .015 0 .015.008s0 .016-.008.016l-.138.069c-.046.023-.1.053-.16.084-.062.038-.13.084-.215.13-.039.023-.085.046-.123.077-.038.03-.084.061-.13.092-.046.03-.092.069-.138.1l-.146.122c-.199.16-.406.375-.613.613a6.026 6.026 0 0 0-.582.843 4.993 4.993 0 0 0-.421 1.057c-.023.1-.054.192-.07.292-.015.1-.038.199-.053.298-.023.2-.054.406-.054.613-.015.414.023.843.115 1.25l.039.153.046.153.022.077.023.076.054.153c.077.2.153.391.253.575.092.184.2.36.314.529.03.038.061.084.084.123l.046.06.046.062.092.115c.031.038.062.077.1.115.13.153.268.291.406.421.07.062.138.13.215.184.076.054.145.115.222.169.291.215.59.39.881.521.291.138.567.23.812.299.123.03.246.061.353.084.107.023.214.039.306.054.023 0 .046.008.07.008.022 0 .045.007.06.007.039.008.077.008.116.008.069.008.13.008.183.015l.146.023z"
        fill="url(#a53amevb2M)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.456 11.026s.283-.084.352-.567c-.007 0-.375.245-.352.567z"
          fill="url(#1xjcco7f3N)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.471 11.094s.085.284.567.353c0 0-.245-.368-.567-.353z"
          fill="url(#0clm2ohsaO)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.3 10.873s.26-.137.229-.628c0 0-.306.314-.23.629z"
          fill="url(#86fimbxrmP)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.33 10.943s.137.26.627.23c0-.007-.314-.314-.628-.23z"
          fill="url(#3wj3g0w8eQ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.071 10.583s.246-.169.146-.651c0 0-.268.352-.146.651z"
          fill="url(#o215t91fpR)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.11 10.644s.168.245.651.146c0 .007-.353-.261-.651-.146z"
          fill="url(#conjaccdzS)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.824 10.162s.199-.222-.008-.667c0 0-.176.399.008.667z"
          fill="url(#k2ap3o1g4T)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.878 10.215s.223.2.667-.008c0 0-.406-.184-.667.008z"
          fill="url(#8tc7g2ovqU)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.505 9.61s.153-.254-.13-.66c-.008 0-.108.43.13.66z"
          fill="url(#7v44qr1yvV)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.565 9.648s.253.153.66-.13c-.009-.008-.438-.108-.66.13z"
          fill="url(#sqcjouzl6W)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.072 8.927s.122-.268-.207-.636c0 0-.054.444.207.636z"
          fill="url(#w05ajm6t3X)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.132 8.965s.268.123.636-.207c0 0-.437-.053-.636.207z"
          fill="url(#sjcn358ysY)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 8.2s.107-.276-.245-.62c-.008 0-.023.444.245.62z"
          fill="url(#l2m51b8t7Z)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.561 8.23s.276.108.62-.244c0-.008-.436-.023-.62.245z"
          fill="url(#nc7ydcji8aa)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.792 7.433s.092-.276-.268-.613c0 .008-.008.445.268.613z"
          fill="url(#vlabd7knkab)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.861 7.464s.276.091.613-.269c0 0-.444-.007-.613.269z"
          fill="url(#qpk1xgo1vac)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.966 6.638s.046-.292-.367-.56c0 0 .069.437.367.56z"
          fill="url(#vorh16k3kad)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M11.035 6.653s.29.046.56-.368c0 0-.438.07-.56.368z"
          fill="url(#3cik7x5hnae)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.991 5.793s-.008-.299-.467-.482c0 0 .145.413.467.482z"
          fill="url(#4g7gymwshaf)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M11.06 5.794s.3-.008.483-.468c0 0-.421.153-.483.468z"
          fill="url(#bdsfgxqpzag)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.877 4.958s-.076-.284-.567-.36c0 0 .245.367.567.36z"
          fill="url(#ntgmr8b9gah)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.946 4.942s.284-.077.36-.567c0 0-.375.238-.36.567z"
          fill="url(#9qgc0k5d6ai)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.64 4.145s-.153-.253-.644-.192c0 0 .33.291.644.192z"
          fill="url(#35g7ffqeyaj)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.701 4.107s.253-.154.192-.644c0 0-.291.337-.192.644z"
          fill="url(#y6rdd1u7bak)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.239 3.38s-.2-.214-.667-.046c0-.008.39.207.667.046z"
          fill="url(#a09qce3uaal)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.292 3.327s.215-.2.046-.667c0 0-.207.391-.046.667z"
          fill="url(#88lh1z7hham)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.72 2.668s-.245-.17-.659.1c0 0 .43.122.659-.1z"
          fill="url(#3agemt4upan)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.766 2.606s.169-.245-.1-.659c0 0-.122.43.1.66z"
          fill="url(#d5vzdtmxoao)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.077 2.063s-.26-.13-.644.176c0 .008.437.077.644-.176z"
          fill="url(#2wx1fnoeuap)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.108 2.001s.138-.26-.176-.644c0 0-.07.437.176.644z"
          fill="url(#qwcnuy7voaq)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.323 1.579s-.276-.115-.628.23c0-.008.444.03.628-.23z"
          fill="url(#op4oo4kular)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.354 1.51s.114-.276-.23-.628c.007 0-.031.444.23.628z"
          fill="url(#n4nzo8ixfas)" />
    <path
        d="M5.97 11.081s.053 0 .153-.007c.054 0 .115-.008.184-.016.038 0 .077-.007.115-.007.023 0 .038-.008.061-.008s.046-.008.07-.008c.091-.015.19-.023.306-.053.107-.023.23-.054.352-.084a4.61 4.61 0 0 0 .812-.3c.292-.13.59-.306.882-.52.076-.054.145-.115.222-.169.069-.061.145-.123.214-.184a5.32 5.32 0 0 0 .407-.421c.03-.039.068-.077.1-.115l.091-.115.046-.062.046-.06c.03-.04.061-.085.084-.123.115-.17.223-.345.315-.53.1-.183.176-.375.252-.574l.054-.153a.963.963 0 0 0 .023-.077l.023-.076.046-.154.038-.153c.092-.414.13-.835.115-1.249 0-.215-.03-.414-.053-.613-.016-.1-.039-.2-.054-.299l-.069-.291a5.436 5.436 0 0 0-.421-1.058A5.439 5.439 0 0 0 9.8 2.76a5.133 5.133 0 0 0-.613-.613l-.145-.123c-.046-.038-.1-.069-.138-.1a1.918 1.918 0 0 1-.13-.092c-.039-.03-.085-.053-.123-.076-.077-.046-.146-.092-.215-.13-.061-.031-.115-.062-.16-.085l-.139-.069c-.007 0-.007-.007-.007-.015s.007-.008.015-.008l.138.07c.046.022.1.053.168.083.062.039.138.077.215.123.038.023.084.046.123.077.046.03.084.061.13.092.046.03.092.061.146.1.045.038.1.076.145.114.207.161.422.368.636.606.207.245.414.528.598.85.176.322.33.682.444 1.073.023.1.054.2.077.299.015.1.038.199.054.306.03.207.053.422.053.629.015.421-.023.858-.115 1.28l-.038.16-.046.154-.023.076c-.008.023-.015.054-.023.077l-.054.153c-.076.2-.16.399-.252.59a4.832 4.832 0 0 1-.322.544c-.031.046-.062.084-.092.13l-.046.062-.046.061a1.7 1.7 0 0 0-.092.123c-.03.038-.07.076-.1.115-.13.153-.276.29-.414.421-.076.061-.145.13-.222.184a5.184 5.184 0 0 1-1.126.682 4.89 4.89 0 0 1-.836.284c-.13.03-.245.053-.36.068-.115.023-.214.031-.306.039-.023 0-.046.007-.07.007h-.06c-.039 0-.085.008-.115.008-.07.008-.138.008-.184.008-.115-.016-.161-.016-.161-.016z"
        fill="url(#rwt24650nat)" />
    <path
        d="m8.053 8.715.062.191L7.83 8.7 6.015 7.381 6 7.374l-.016.007L4.176 8.7l-.283.207.06-.191.545-1.67.023-.085.176-.536-.054-.039-.337-.245L2.59 4.891h2.605L6 2.408l.812 2.483h2.605L7.701 6.14l-.337.245-.054.039.169.536.03.084.544 1.67z"
        fill="url(#v2sgbenidau)" />
    <path d="M6 7.282 4.03 8.716l.752-2.321-1.97-1.433H5.25L6 2.646l.759 2.315h2.437L7.219 6.394l.758 2.321L6 7.282z"
          fill="url(#gjasgbh5cav)" />
    <path d="m6 7.167-1.8 1.31.69-2.114-1.801-1.31h2.23L6 2.937l.69 2.114h2.23L7.12 6.362l.69 2.116L6 7.168z"
          fill="url(#gbp3fctv4aw)" />
    <path d="M6 5.834V2.938l-.682 2.114.682.782z" fill="url(#q9zd45uvgax)" />
    <path d="M6 5.834V2.938l.69 2.114-.69.782z" fill="url(#ow8eckwofay)" />
    <path d="m6 5.834-1.11.529-.69 2.115L6 5.834z" fill="url(#7ztpynosvaz)" />
    <path d="m6 5.834 1.119.529.69 2.115L6 5.834z" fill="url(#14qs9ako8aA)" />
    <path d="m6 5.834-.681-.781h-2.23l2.912.781z" fill="url(#yukpej3gbaB)" />
    <path d="m6 5.834.69-.781h2.23L6 5.834z" fill="url(#t0twp47luaC)" />
    <path d="M6 5.834 3.09 5.053l1.8 1.31 1.112-.529z" fill="url(#vvt0cnj93aD)" />
    <path d="m6 5.834 2.92-.781-1.801 1.31L6 5.834z" fill="url(#0mkqmqyixaE)" />
    <path d="M6 5.834v1.333l-1.8 1.31L6 5.835z" fill="url(#5e4awf0teaF)" />
    <path d="M6 5.834v1.333l1.808 1.31L6 5.835z" fill="url(#oz121vlmxaG)" />
    <path
        d="M6 5.834c.046 0 .084-.628.084-1.402 0-.775-.038-1.403-.084-1.403-.047 0-.084.628-.084 1.403 0 .774.037 1.402.084 1.402z"
        fill="url(#j0sfsfnd2aH)" />
    <path
        d="M6 5.834c.046 0 .084-.628.084-1.402 0-.775-.038-1.403-.084-1.403-.047 0-.084.628-.084 1.403 0 .774.037 1.402.084 1.402z"
        fill="url(#tb0f4ci5gaI)" />
    <path
        d="M5.678 5.332c.215.245.353.467.322.498-.038.03-.237-.138-.452-.383-.215-.245-.352-.467-.322-.498.038-.03.238.138.452.383z"
        fill="url(#lv7k1okygaJ)" />
    <path
        d="M5.678 5.332c.215.245.353.467.322.498-.038.03-.237-.138-.452-.383-.215-.245-.352-.467-.322-.498.038-.03.238.138.452.383z"
        fill="url(#ip8v2cvxmaK)" />
    <path
        d="M5.34 6.045c.346-.16.637-.252.652-.214.023.046-.237.207-.582.368-.345.16-.636.253-.652.214-.015-.046.246-.207.583-.368z"
        fill="url(#l7hewve5paL)" />
    <path
        d="M5.34 6.045c.346-.16.637-.252.652-.214.023.046-.237.207-.582.368-.345.16-.636.253-.652.214-.015-.046.246-.207.583-.368z"
        fill="url(#6tf696kntaM)" />
    <path
        d="M6.326 5.332c-.214.245-.352.467-.322.498.039.03.238-.138.452-.383.215-.245.353-.467.322-.498-.038-.03-.245.138-.452.383z"
        fill="url(#29r54q3bsaN)" />
    <path
        d="M6.326 5.332c-.214.245-.352.467-.322.498.039.03.238-.138.452-.383.215-.245.353-.467.322-.498-.038-.03-.245.138-.452.383z"
        fill="url(#2xf6jei7raO)" />
    <path
        d="M6.664 6.045c-.344-.16-.636-.252-.65-.214-.024.046.237.207.582.368.344.16.636.253.65.214.016-.046-.244-.207-.582-.368z"
        fill="url(#ja4zr41dbaP)" />
    <path
        d="M6.664 6.045c-.344-.16-.636-.252-.65-.214-.024.046.237.207.582.368.344.16.636.253.65.214.016-.046-.244-.207-.582-.368z"
        fill="url(#o6mf98h88aQ)" />
    <path
        d="M4.397 5.31c.897.238 1.617.467 1.602.521-.016.046-.751-.107-1.648-.345-.896-.237-1.617-.467-1.601-.52.007-.047.75.106 1.647.344z"
        fill="url(#qxv807754aR)" />
    <path
        d="M4.397 5.31c.897.238 1.617.467 1.602.521-.016.046-.751-.107-1.648-.345-.896-.237-1.617-.467-1.601-.52.007-.047.75.106 1.647.344z"
        fill="url(#bgn2tnne9aS)" />
    <path
        d="M4.987 7.18c.514-.775.966-1.372 1.004-1.35.038.031-.345.675-.858 1.449-.514.774-.966 1.372-1.004 1.349-.046-.031.345-.675.858-1.449z"
        fill="url(#bi2zmkdukaT)" />
    <path
        d="M4.987 7.18c.514-.775.966-1.372 1.004-1.35.038.031-.345.675-.858 1.449-.514.774-.966 1.372-1.004 1.349-.046-.031.345-.675.858-1.449z"
        fill="url(#k6acchb62aU)" />
    <path
        d="M7.602 5.31c-.897.238-1.617.467-1.602.521.016.046.751-.107 1.648-.345.896-.237 1.617-.467 1.601-.52-.015-.047-.75.106-1.647.344z"
        fill="url(#gya5e9kw5aV)" />
    <path
        d="M7.602 5.31c-.897.238-1.617.467-1.602.521.016.046.751-.107 1.648-.345.896-.237 1.617-.467 1.601-.52-.015-.047-.75.106-1.647.344z"
        fill="url(#lirssk0iuaW)" />
    <path
        d="M7.004 7.18C6.491 6.404 6.04 5.807 6 5.83c-.038.031.345.675.859 1.449.513.774.965 1.372 1.004 1.349.045-.031-.338-.675-.859-1.449z"
        fill="url(#ycy2hvpcqaX)" />
    <path
        d="M7.004 7.18C6.491 6.404 6.04 5.807 6 5.83c-.038.031.345.675.859 1.449.513.774.965 1.372 1.004 1.349.045-.031-.338-.675-.859-1.449z"
        fill="url(#cftpfunw1aY)" />
    <path
        d="M6 7.388c.046 0 .084-.398.084-.889 0-.49-.038-.889-.084-.889-.047 0-.084.398-.084.89 0 .49.037.888.084.888z"
        fill="url(#m266aujzhaZ)" />
    <path
        d="M6 7.388c.046 0 .084-.398.084-.889 0-.49-.038-.889-.084-.889-.047 0-.084.398-.084.89 0 .49.037.888.084.888z"
        fill="url(#qxuukaiatba)" />
    <defs>
        <linearGradient id="czu2pxl7ta" x1="-.193" y1="5.997" x2="12.419" y2="5.997" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="i7y3t7j41b" x1="1.654" y1="1.647" x2="10.071" y2="10.064" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="xyghxq1d2c" x1="2.871" y1="2.866" x2="8.928" y2="8.922" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="ola07jinvd" x1="2.957" y1="2.95" x2="8.852" y2="8.844" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F1115" />
            <stop offset=".14" stopColor="#1C2228" />
            <stop offset=".258" stopColor="#232A32" />
            <stop offset=".36" stopColor="#1C2228" />
            <stop offset=".489" stopColor="#0F1115" />
            <stop offset=".613" stopColor="#1C2228" />
            <stop offset=".737" stopColor="#232A32" />
            <stop offset=".839" stopColor="#1C2228" />
            <stop offset="1" stopColor="#0F1115" />
        </linearGradient>
        <linearGradient id="dxzx14z7de" x1="3.342" y1="3.336" x2="8.49" y2="8.484" gradientUnits="userSpaceOnUse">
            <stop stopColor="#161A1F" />
            <stop offset=".14" stopColor="#2A323B" />
            <stop offset=".258" stopColor="#343F4A" />
            <stop offset=".36" stopColor="#2A323B" />
            <stop offset=".489" stopColor="#161A1F" />
            <stop offset=".613" stopColor="#2A323B" />
            <stop offset=".737" stopColor="#343F4A" />
            <stop offset=".839" stopColor="#2A323B" />
            <stop offset="1" stopColor="#161A1F" />
        </linearGradient>
        <linearGradient id="t1nm0fo0ag" x1="-1.645" y1="10.74" x2="12.646" y2="10.74" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="14mrk7xe7h" x1="-1.644" y1="11.27" x2="12.647" y2="11.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="mv8w8pg7ji" x1="-1.645" y1="10.56" x2="12.645" y2="10.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="0r5m15ac2j" x1="-1.646" y1="11.05" x2="12.647" y2="11.05" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="8kuerncbqk" x1="-1.647" y1="10.259" x2="12.643" y2="10.259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="dkciwfk7pl" x1="-1.648" y1="10.716" x2="12.644" y2="10.716" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="g7q3heh50m" x1="-1.648" y1="9.827" x2="12.645" y2="9.827" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="6j228k7rdn" x1="-1.647" y1="10.213" x2="12.645" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="0ulal5n5zo" x1="-1.646" y1="9.278" x2="12.643" y2="9.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="361e54yphp" x1="-1.647" y1="9.59" x2="12.645" y2="9.59" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="7gyldky4rq" x1="-1.646" y1="8.612" x2="12.645" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="b6qi6bgw3r" x1="-1.646" y1="8.87" x2="12.646" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="t5nkup1sms" x1="-1.646" y1="7.889" x2="12.645" y2="7.889" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="lk1mdxmvqt" x1="-1.648" y1="8.112" x2="12.646" y2="8.112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="as90xrkw9u" x1="-1.646" y1="7.13" x2="12.648" y2="7.13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="40v8bbcx2v" x1="-1.645" y1="7.333" x2="12.648" y2="7.333" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="koy42a6bqw" x1="-1.645" y1="6.359" x2="12.647" y2="6.359" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="mbcxb0lxzx" x1="-1.646" y1="6.471" x2="12.646" y2="6.471" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="nb83g7ngny" x1="-1.646" y1="5.551" x2="12.649" y2="5.551" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="y8pkue5yiz" x1="-1.646" y1="5.56" x2="12.647" y2="5.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="y0o19xldbA" x1="-1.645" y1="4.777" x2="12.646" y2="4.777" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="v3icskbziB" x1="-1.644" y1="4.657" x2="12.649" y2="4.657" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="zlru62axpC" x1="-1.649" y1="4.051" x2="12.645" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="rxjsf5clgD" x1="-1.648" y1="3.786" x2="12.645" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="wkci842i8E" x1="-1.648" y1="3.352" x2="12.646" y2="3.352" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="d81e4zpp4F" x1="-1.648" y1="2.995" x2="12.648" y2="2.995" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="lcjoucnakG" x1="-1.646" y1="2.708" x2="12.646" y2="2.708" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="fvpmtyt2pH" x1="-1.647" y1="2.279" x2="12.647" y2="2.279" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="xfci6b533I" x1="-1.645" y1="2.145" x2="12.646" y2="2.145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="z7agwygyeJ" x1="-1.646" y1="1.679" x2="12.647" y2="1.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="b3ou3vjg8K" x1="-1.646" y1="1.683" x2="12.647" y2="1.683" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="sspxhwv1iL" x1="-1.647" y1="1.197" x2="12.646" y2="1.197" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="a53amevb2M" x1="-1.647" y1="6.254" x2="12.645" y2="6.254" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="1xjcco7f3N" x1="-1.644" y1="10.74" x2="12.647" y2="10.74" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="0clm2ohsaO" x1="-1.644" y1="11.27" x2="12.648" y2="11.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="86fimbxrmP" x1="-1.644" y1="10.56" x2="12.648" y2="10.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="3wj3g0w8eQ" x1="-1.646" y1="11.05" x2="12.648" y2="11.05" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="o215t91fpR" x1="-1.646" y1="10.259" x2="12.647" y2="10.259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="conjaccdzS" x1="-1.646" y1="10.716" x2="12.646" y2="10.716" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="k2ap3o1g4T" x1="-1.645" y1="9.827" x2="12.648" y2="9.827" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="8tc7g2ovqU" x1="-1.643" y1="10.213" x2="12.649" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="7v44qr1yvV" x1="-1.645" y1="9.278" x2="12.647" y2="9.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="sqcjouzl6W" x1="-1.647" y1="9.59" x2="12.646" y2="9.59" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="w05ajm6t3X" x1="-1.646" y1="8.612" x2="12.647" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="sjcn358ysY" x1="-1.646" y1="8.87" x2="12.646" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="l2m51b8t7Z" x1="-1.646" y1="7.889" x2="12.646" y2="7.889" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="nc7ydcji8aa" x1="-1.647" y1="8.112" x2="12.646" y2="8.112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="vlabd7knkab" x1="-1.65" y1="7.13" x2="12.647" y2="7.13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="qpk1xgo1vac" x1="-1.646" y1="7.333" x2="12.647" y2="7.333" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="vorh16k3kad" x1="-1.647" y1="6.359" x2="12.645" y2="6.359" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="3cik7x5hnae" x1="-1.648" y1="6.471" x2="12.644" y2="6.471" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="4g7gymwshaf" x1="-1.645" y1="5.551" x2="12.647" y2="5.551" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="bdsfgxqpzag" x1="-1.647" y1="5.56" x2="12.647" y2="5.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="ntgmr8b9gah" x1="-1.645" y1="4.777" x2="12.648" y2="4.777" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="9qgc0k5d6ai" x1="-1.647" y1="4.657" x2="12.648" y2="4.657" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="35g7ffqeyaj" x1="-1.644" y1="4.051" x2="12.648" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="y6rdd1u7bak" x1="-1.642" y1="3.786" x2="12.648" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="a09qce3uaal" x1="-1.648" y1="3.352" x2="12.645" y2="3.352" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="88lh1z7hham" x1="-1.647" y1="2.995" x2="12.645" y2="2.995" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="3agemt4upan" x1="-1.644" y1="2.708" x2="12.648" y2="2.708" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="d5vzdtmxoao" x1="-1.644" y1="2.279" x2="12.648" y2="2.279" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="2wx1fnoeuap" x1="-1.644" y1="2.145" x2="12.648" y2="2.145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="qwcnuy7voaq" x1="-1.644" y1="1.679" x2="12.649" y2="1.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="op4oo4kular" x1="-1.648" y1="1.683" x2="12.646" y2="1.683" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="n4nzo8ixfas" x1="-1.647" y1="1.197" x2="12.645" y2="1.197" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="rwt24650nat" x1="-1.648" y1="6.255" x2="12.645" y2="6.255" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B07515" />
            <stop offset=".094" stopColor="#E1BA60" />
            <stop offset=".14" stopColor="#F5D77F" />
            <stop offset=".258" stopColor="#FFFFD7" />
            <stop offset=".36" stopColor="#F5D77F" />
            <stop offset=".489" stopColor="#B07515" />
            <stop offset=".573" stopColor="#E1BA60" />
            <stop offset=".613" stopColor="#F5D77F" />
            <stop offset=".737" stopColor="#FFFFD7" />
            <stop offset=".839" stopColor="#F5D77F" />
            <stop offset="1" stopColor="#B07515" />
        </linearGradient>
        <linearGradient id="v2sgbenidau" x1="2.495" y1="2.738" x2="8.968" y2="9.21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="gjasgbh5cav" x1="3.304" y1="3.53" x2="7.988" y2="8.215" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".579" stopColor="#CBA748" />
            <stop offset=".867" stopColor="#835F24" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <linearGradient id="gbp3fctv4aw" x1="3.163" y1="3.369" x2="8.972" y2="9.178" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".579" stopColor="#CBA748" />
            <stop offset=".867" stopColor="#835F24" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <linearGradient id="q9zd45uvgax" x1="5.659" y1="5.879" x2="5.659" y2="2.849" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="ow8eckwofay" x1="6.761" y1="3.601" x2="5.146" y2="5.269" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="7ztpynosvaz" x1="4.299" y1="8.354" x2="5.668" y2="5.664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="14qs9ako8aA" x1="7.708" y1="8.354" x2="6.339" y2="5.664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".579" stopColor="#CBA748" />
            <stop offset=".867" stopColor="#835F24" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <linearGradient id="yukpej3gbaB" x1="3.129" y1="5.132" x2="6.585" y2="5.557" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".086" stopColor="#7E5A22" />
            <stop offset=".302" stopColor="#B5913D" />
            <stop offset=".488" stopColor="#DDB951" />
            <stop offset=".635" stopColor="#F6D25D" />
            <stop offset=".725" stopColor="#FFDB62" />
            <stop offset=".895" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="t0twp47luaC" x1="9.208" y1="4.94" x2="6.126" y2="5.483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".463" stopColor="#F6D25D" />
            <stop offset=".587" stopColor="#DDB951" />
            <stop offset=".745" stopColor="#B5913D" />
            <stop offset=".927" stopColor="#7E5A22" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <linearGradient id="vvt0cnj93aD" x1="5.723" y1="6.192" x2="2.701" y2="5.169" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="0mkqmqyixaE" x1="5.87" y1="6.332" x2="8.892" y2="5.309" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".579" stopColor="#CBA748" />
            <stop offset=".867" stopColor="#835F24" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <linearGradient id="5e4awf0teaF" x1="6.108" y1="6.354" x2="4.365" y2="8.838" gradientUnits="userSpaceOnUse">
            <stop stopColor="#664216" />
            <stop offset=".134" stopColor="#835F24" />
            <stop offset=".421" stopColor="#CBA748" />
            <stop offset=".613" stopColor="#FFDB62" />
            <stop offset=".853" stopColor="#FFD845" />
            <stop offset="1" stopColor="#FFD739" />
        </linearGradient>
        <linearGradient id="oz121vlmxaG" x1="5.517" y1="5.81" x2="7.26" y2="8.295" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD739" />
            <stop offset=".147" stopColor="#FFD845" />
            <stop offset=".387" stopColor="#FFDB62" />
            <stop offset=".579" stopColor="#CBA748" />
            <stop offset=".867" stopColor="#835F24" />
            <stop offset="1" stopColor="#664216" />
        </linearGradient>
        <radialGradient id="2i19kuf7uf" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(8.643 5.168) scale(7.33234)">
            <stop stopColor="#E8E8E8" />
            <stop offset=".054" stopColor="#A6A6A6" />
            <stop offset=".14" stopColor="#606060" />
            <stop offset=".209" stopColor="#4C4C4C" />
            <stop offset=".326" stopColor="#303030" />
            <stop offset=".453" stopColor="#1B1B1B" />
            <stop offset=".594" stopColor="#0C0C0C" />
            <stop offset=".757" stopColor="#030303" />
            <stop offset="1" />
        </radialGradient>
        <radialGradient id="j0sfsfnd2aH" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 6.003 4.428)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tb0f4ci5gaI" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 6.003 4.428)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lv7k1okygaJ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.612 5.39)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ip8v2cvxmaK" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.612 5.39)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="l7hewve5paL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.38 6.123)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="6tf696kntaM" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.38 6.123)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="29r54q3bsaN" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.06626 -.05779 .38474 -.44113 6.39 5.39)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="2xf6jei7raO" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.06626 -.05779 .38474 -.44113 6.39 5.39)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ja4zr41dbaP" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.624 6.123)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="o6mf98h88aQ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.624 6.123)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="qxv807754aR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-75.1 5.697 -.144) scale(.08795 1.68034)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bgn2tnne9aS" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-75.1 5.697 -.144) scale(.08795 1.68034)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bi2zmkdukaT" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.627 2.846) scale(.08794 1.6805)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="k6acchb62aU" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.627 2.846) scale(.08794 1.6805)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gya5e9kw5aV" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.624 5.399)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lirssk0iuaW" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.624 5.399)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ycy2hvpcqaX" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .9341 1.39704 6.935 7.228)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cftpfunw1aY" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .9341 1.39704 6.935 7.228)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="m266aujzhaZ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.998 6.5)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="qxuukaiatba" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.998 6.5)">
            <stop stopColor="#FFCC3A" />
            <stop offset=".088" stopColor="#F3C237" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D2A830" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D7D24" stopOpacity=".534" />
            <stop offset=".73" stopColor="#534213" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
    </defs>
</svg>

const OfficialUser = ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 12 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12A6 6 0 1 1 6 0a6 6 0 1 1 0 12z" fill="url(#h1huv17dxa)" />
    <path d="M6.001 11.87A5.87 5.87 0 1 1 6.002.13a5.87 5.87 0 0 1 0 11.74z" fill="url(#i86ok0pi3b)" />
    <path
        d="M5.999 10.222A4.225 4.225 0 0 1 1.776 6 4.225 4.225 0 0 1 6 1.777 4.225 4.225 0 0 1 10.22 6a4.225 4.225 0 0 1-4.222 4.222z"
        fill="url(#ehi6f8oh6c)" />
    <path d="M6.001 10.107a4.107 4.107 0 1 1 0-8.215 4.107 4.107 0 0 1 0 8.215z" fill="url(#gzmay169md)" />
    <path d="M6 9.586a3.586 3.586 0 1 1 0-7.171 3.586 3.586 0 0 1 0 7.171z" fill="url(#1ber48sdhe)" />
    <path opacity=".6"
          d="M9.01 3.203a4.094 4.094 0 0 0-3.018-1.318A4.108 4.108 0 0 0 4.26 9.716C4.52 6.82 6.42 4.33 9.01 3.203z"
          fill="url(#4pf8ii62sf)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.488 11.026s-.284-.084-.353-.567c.008 0 .368.245.353.567z"
          fill="url(#1l07cregvg)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.473 11.094s-.084.284-.567.353c-.008 0 .245-.368.567-.353z"
          fill="url(#dyqwqk14lh)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.636 10.873s-.26-.137-.23-.628c.008 0 .315.314.23.629z"
          fill="url(#mkgcjku38i)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.606 10.943s-.138.26-.628.23c0-.007.321-.314.628-.23z"
          fill="url(#fvfrtsvr1j)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.87 10.583s-.245-.169-.145-.651c-.008 0 .26.352.145.651z"
          fill="url(#qmju0yvrtk)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.832 10.644s-.168.245-.651.146c-.008.007.345-.261.651-.146z"
          fill="url(#4zyn1ig49l)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.12 10.162s-.2-.222.007-.667c-.008 0 .176.399-.008.667z"
          fill="url(#0p1nnch4bm)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.067 10.215s-.222.2-.667-.008c0 0 .399-.184.667.008z"
          fill="url(#ttudymdqqn)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.44 9.61s-.154-.254.13-.66c0 0 .1.43-.13.66z"
          fill="url(#n5xsvsjlmo)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.377 9.648s-.253.153-.659-.13c.008-.008.437-.108.66.13z"
          fill="url(#g3fp6hsf5p)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.872 8.927s-.123-.268.207-.636c0 0 .046.444-.207.636z"
          fill="url(#0ccft8ds5q)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.804 8.965s-.269.123-.637-.207c0 0 .445-.053.637.207z"
          fill="url(#v1pn4kbkbr)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.445 8.2s-.107-.276.245-.62c0 0 .023.444-.245.62z"
          fill="url(#vgfmpms1gs)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.376 8.23s-.276.108-.621-.244c0-.008.444-.023.62.245z"
          fill="url(#yvtdnpf3kt)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.143 7.433s-.092-.276.268-.613c.008.008.008.445-.268.613z"
          fill="url(#dr8wde01vu)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.075 7.464s-.276.091-.613-.269c.008 0 .444-.007.613.269z"
          fill="url(#rbpx7b6kqv)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.975 6.638s-.046-.292.367-.56c0 0-.069.437-.367.56z"
          fill="url(#90ujm91tzw)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.907 6.653s-.292.046-.56-.368c0 0 .437.07.56.368z"
          fill="url(#vxvuw8m5lx)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.952 5.793s.007-.299.467-.482c0 0-.153.413-.467.482z"
          fill="url(#r4m1mbl0by)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M.884 5.794s-.3-.008-.483-.468c0 0 .414.153.483.468z"
          fill="url(#gzljgmh16z)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.07 4.958s.076-.284.566-.36c0 0-.245.367-.567.36z"
          fill="url(#hf8o0b2iwA)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1 4.942s-.283-.077-.36-.567c0 0 .368.238.36.567z"
          fill="url(#l4xtsxrj8B)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.303 4.145s.154-.253.644-.192c0 0-.337.291-.644.192z"
          fill="url(#jhcag8r9zC)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.242 4.107s-.253-.154-.192-.644c0 0 .292.337.192.644z"
          fill="url(#4t70m2ks7D)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.702 3.38s.199-.214.666-.046c0-.008-.39.207-.666.046z"
          fill="url(#asylxmw73E)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.648 3.327s-.214-.2-.046-.667c-.007 0 .207.391.046.667z"
          fill="url(#t0iyc83h7F)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.217 2.668s.245-.17.66.1c.007 0-.422.122-.66-.1z"
          fill="url(#4j8v5cv1oG)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.178 2.606s-.168-.245.1-.659c-.008 0 .115.43-.1.66z"
          fill="url(#zu7wypgqmH)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.867 2.063s.26-.13.643.176c0 .008-.437.077-.643-.176z"
          fill="url(#9g7nf6ekbI)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.829 2.001s-.13-.26.176-.644c.007 0 .076.437-.176.644z"
          fill="url(#uc3ffgv5bJ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.612 1.579s.276-.115.628.23c0-.008-.436.03-.628-.23z"
          fill="url(#r3c0c6r4yK)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.581 1.51s-.115-.276.23-.628c0 0 .038.444-.23.628z"
          fill="url(#b0f0q2h2uL)" />
    <path
        d="M5.971 11.081h-.153c-.054 0-.115 0-.184-.008-.038 0-.077-.007-.115-.007h-.061c-.023 0-.046-.008-.07-.008-.091-.008-.198-.023-.306-.038-.115-.015-.23-.046-.36-.07a5.122 5.122 0 0 1-1.74-.796c-.076-.054-.145-.115-.222-.169-.076-.061-.145-.122-.222-.184a4.304 4.304 0 0 1-.414-.421c-.03-.038-.069-.077-.1-.115a1.706 1.706 0 0 1-.091-.123l-.046-.06-.046-.062a4.83 4.83 0 0 1-.414-.674 4.022 4.022 0 0 1-.253-.59l-.053-.154-.023-.076-.023-.077-.046-.153-.039-.161a5.17 5.17 0 0 1-.115-1.28c0-.207.031-.421.054-.628.023-.1.038-.207.054-.307.023-.1.053-.199.076-.299.115-.39.268-.75.445-1.072.184-.322.39-.606.597-.851a5.114 5.114 0 0 1 .782-.72c.046-.039.1-.07.146-.1.046-.03.092-.061.13-.092l.122-.077c.085-.046.154-.092.215-.122.069-.03.123-.061.169-.084l.138-.07c.007 0 .015 0 .015.008s0 .016-.008.016l-.138.069c-.046.023-.1.053-.16.084-.062.038-.13.084-.215.13-.038.023-.084.046-.123.077-.038.03-.084.061-.13.092-.046.03-.092.069-.138.1l-.146.122c-.199.16-.406.375-.613.613a6.025 6.025 0 0 0-.582.843 4.993 4.993 0 0 0-.421 1.057c-.023.1-.054.192-.07.292-.015.1-.038.199-.053.298-.023.2-.054.406-.054.613-.015.414.023.843.115 1.25l.039.153.046.153.023.077.023.076.053.153c.077.2.153.391.253.575.092.184.2.36.314.529.03.038.062.084.085.123l.045.06.046.062.092.115c.031.038.062.077.1.115.13.153.268.291.406.421.07.062.138.13.215.184.076.054.145.115.222.169.291.215.59.39.881.521a5.1 5.1 0 0 0 .812.299c.123.03.246.061.353.084.107.023.214.039.306.054.023 0 .046.008.07.008.022 0 .045.007.06.007.039.008.077.008.116.008.069.008.13.008.184.015l.145.023z"
        fill="url(#nmckm0tnlM)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.448 11.026s.284-.084.353-.567c-.008 0-.368.245-.353.567z"
          fill="url(#qf9pynp8kN)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.464 11.094s.084.284.567.353c.008 0-.245-.368-.567-.353z"
          fill="url(#vytcdmmsbO)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.3 10.873s.26-.137.229-.628c-.008 0-.314.314-.23.629z"
          fill="url(#tw443grtvP)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.33 10.943s.137.26.627.23c0-.007-.321-.314-.628-.23z"
          fill="url(#1ttyvi4cbQ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.065 10.583s.246-.169.146-.651c.008 0-.26.352-.146.651z"
          fill="url(#bvgjxvo5wR)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.105 10.644s.168.245.651.146c.008.007-.345-.261-.651-.146z"
          fill="url(#7o45ajij8S)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.815 10.162s.2-.222-.008-.667c.008 0-.176.399.008.667z"
          fill="url(#ix65v5yxyT)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.869 10.215s.222.2.666-.008c0 0-.398-.184-.666.008z"
          fill="url(#x4i66tqafU)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.496 9.61s.153-.254-.13-.66c0 0-.1.43.13.66z"
          fill="url(#1i8xz6ud8V)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.558 9.648s.252.153.659-.13c-.008-.008-.437-.108-.66.13z"
          fill="url(#p7fvwa7heW)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.066 8.927s.122-.268-.207-.636c0 0-.046.444.207.636z"
          fill="url(#9io93adbjX)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.134 8.965s.268.123.636-.207c0 0-.444-.053-.636.207z"
          fill="url(#kiqtx5py2Y)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.492 8.2s.108-.276-.245-.62c0 0-.023.444.245.62z"
          fill="url(#t12t8q54uZ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.56 8.23s.277.108.621-.244c0-.008-.444-.023-.62.245z"
          fill="url(#ni75b1gvkaa)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.791 7.433s.092-.276-.268-.613c-.007.008-.007.445.268.613z"
          fill="url(#ikewtpppjab)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.861 7.464s.276.091.613-.269c-.008 0-.444-.007-.613.269z"
          fill="url(#pzrgybi84ac)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.962 6.638s.046-.292-.368-.56c0 0 .069.437.368.56z"
          fill="url(#u908m6i49ad)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M11.03 6.653s.291.046.56-.368c0 0-.438.07-.56.368z"
          fill="url(#dtpabdx7cae)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.984 5.793s-.008-.299-.468-.482c0 0 .154.413.468.482z"
          fill="url(#tu60ezuklaf)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M11.053 5.794s.299-.008.483-.468c0 0-.414.153-.483.468z"
          fill="url(#hmt8hbzyfag)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.868 4.958s-.077-.284-.567-.36c0 0 .245.367.567.36z"
          fill="url(#q45vh5iscah)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.936 4.942s.284-.077.36-.567c0 0-.367.238-.36.567z"
          fill="url(#q1wov50nkai)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.63 4.145s-.153-.253-.643-.192c0 0 .337.291.643.192z"
          fill="url(#89bcu8mhpaj)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.692 4.107s.253-.154.191-.644c0 0-.29.337-.191.644z"
          fill="url(#xgu8fn69yak)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.234 3.38s-.2-.214-.667-.046c0-.008.39.207.667.046z"
          fill="url(#dbuw4o3r6al)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.288 3.327s.215-.2.046-.667c.008 0-.207.391-.046.667z"
          fill="url(#iw5du319zam)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.72 2.668s-.245-.17-.659.1c-.008 0 .422.122.66-.1z"
          fill="url(#kk4cbaggnan)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.758 2.606s.169-.245-.1-.659c.008 0-.114.43.1.66z"
          fill="url(#vkfljpjokao)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.067 2.063s-.26-.13-.643.176c0 .008.436.077.643-.176z"
          fill="url(#ikoq141atap)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.106 2.001s.138-.26-.176-.644c-.008 0-.077.437.176.644z"
          fill="url(#3amdhd1p3aq)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.323 1.579s-.276-.115-.628.23c0-.008.436.03.628-.23z"
          fill="url(#34b9h3p9uar)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.353 1.51s.115-.276-.23-.628c0 0-.038.444.23.628z"
          fill="url(#whdywpqy6as)" />
    <path
        d="M5.963 11.081s.053 0 .153-.007c.054 0 .115-.008.184-.016.038 0 .076-.007.115-.007.023 0 .038-.008.061-.008s.046-.008.069-.008c.092-.015.192-.023.307-.053.107-.023.23-.054.352-.084a4.61 4.61 0 0 0 .812-.3c.291-.13.59-.306.882-.52.076-.054.145-.115.222-.169.069-.061.145-.123.214-.184a5.32 5.32 0 0 0 .406-.421c.031-.039.07-.077.1-.115l.092-.115.046-.062.046-.06c.03-.04.061-.085.084-.123a4.56 4.56 0 0 0 .314-.53c.1-.183.177-.375.253-.574l.054-.153a.923.923 0 0 0 .023-.077l.023-.076.046-.154.038-.153c.092-.414.13-.835.115-1.249 0-.215-.03-.414-.053-.613-.016-.1-.039-.2-.054-.299-.023-.1-.046-.191-.07-.291a5.436 5.436 0 0 0-.42-1.058 5.434 5.434 0 0 0-.583-.842 5.133 5.133 0 0 0-.613-.613l-.146-.123c-.046-.038-.1-.069-.137-.1-.046-.03-.092-.061-.13-.092-.04-.03-.085-.053-.123-.076-.077-.046-.146-.092-.215-.13-.061-.031-.115-.062-.16-.085l-.139-.069c-.007 0-.007-.007-.007-.015s.007-.008.015-.008l.138.07c.046.022.1.053.168.083.062.039.138.077.215.123.038.023.084.046.123.077.046.03.084.061.13.092.046.03.092.061.145.1.046.038.1.076.146.114.207.161.421.368.636.606.207.245.414.528.598.85.176.322.33.682.444 1.073.023.1.054.2.077.299.015.1.038.199.053.306.031.207.054.422.054.629.015.421-.023.858-.115 1.28l-.038.16-.046.154-.023.076c-.008.023-.015.054-.023.077l-.054.153c-.076.2-.16.399-.253.59a4.832 4.832 0 0 1-.321.544c-.031.046-.062.084-.092.13l-.046.062-.046.061c-.031.038-.062.077-.092.123-.031.038-.07.076-.1.115a5.39 5.39 0 0 1-.414.421c-.076.061-.145.13-.222.184a5.184 5.184 0 0 1-1.126.682 4.89 4.89 0 0 1-.836.284c-.13.03-.245.053-.36.068-.115.023-.214.031-.306.039-.023 0-.046.007-.07.007h-.06c-.039 0-.085.008-.116.008-.068.008-.137.008-.183.008-.108-.016-.161-.016-.161-.016z"
        fill="url(#g3sfsp9ubat)" />
    <path
        d="m8.044 8.715.061.191-.283-.207-1.816-1.318-.008-.007-.015.007L4.167 8.7l-.284.207.061-.191.544-1.67.031-.085.169-.536-.054-.039-.337-.245L2.58 4.891h2.606l.812-2.483.805 2.483h2.605L7.69 6.14l-.337.245-.053.039.176.536.023.084.544 1.67z"
        fill="url(#1mignkp9tau)" />
    <path
        d="M5.998 7.282 4.021 8.716l.759-2.321L2.803 4.96H5.24l.758-2.315.751 2.315h2.437l-1.97 1.433.752 2.321-1.97-1.433z"
        fill="url(#92eqd70jgav)" />
    <path d="m6 7.167-1.802 1.31.682-2.114-1.8-1.31h2.23L6 2.937l.689 2.114H8.91l-1.8 1.31.689 2.116L6 7.168z"
          fill="url(#0d1rxjrfxaw)" />
    <path d="M5.998 5.834V2.938l-.69 2.114.69.782z" fill="url(#aos1gc94fax)" />
    <path d="M5.998 5.834V2.938l.69 2.114-.69.782z" fill="url(#8th24rf0fay)" />
    <path d="m5.998 5.834-1.119.529-.681 2.115 1.8-2.644z" fill="url(#i4i1pkjkraz)" />
    <path d="m5.998 5.834 1.11.529.69 2.115-1.8-2.644z" fill="url(#lfjbt25fkaA)" />
    <path d="m6 5.834-.69-.781H3.08L6 5.834z" fill="url(#unfsh8fanaB)" />
    <path d="m5.998 5.834.69-.781h2.221l-2.911.781z" fill="url(#s943ngm80aC)" />
    <path d="m6 5.834-2.92-.781 1.8 1.31L6 5.834z" fill="url(#srwxlkqtqaD)" />
    <path d="m5.998 5.834 2.911-.781-1.8 1.31-1.111-.529z" fill="url(#uw2wj933haE)" />
    <path d="M5.998 5.834v1.333l-1.8 1.31 1.8-2.643z" fill="url(#6qfjm3mh7aF)" />
    <path d="M5.998 5.834v1.333l1.8 1.31-1.8-2.643z" fill="url(#3ahwdz34eaG)" />
    <path
        d="M5.998 5.834c.046 0 .084-.628.084-1.402 0-.775-.038-1.403-.084-1.403-.047 0-.085.628-.085 1.403 0 .774.038 1.402.085 1.402z"
        fill="url(#oy28131cuaH)" />
    <path
        d="M5.998 5.834c.046 0 .084-.628.084-1.402 0-.775-.038-1.403-.084-1.403-.047 0-.085.628-.085 1.403 0 .774.038 1.402.085 1.402z"
        fill="url(#a0boo7nkpaI)" />
    <path
        d="M5.669 5.332c.214.245.352.467.322.498-.031.03-.238-.138-.453-.383-.214-.245-.352-.467-.321-.498.038-.03.245.138.452.383z"
        fill="url(#9snru14h5aJ)" />
    <path
        d="M5.669 5.332c.214.245.352.467.322.498-.031.03-.238-.138-.453-.383-.214-.245-.352-.467-.321-.498.038-.03.245.138.452.383z"
        fill="url(#txebtwm2aaK)" />
    <path
        d="M5.331 6.045c.345-.16.636-.252.652-.214.023.046-.238.207-.583.368-.345.16-.636.253-.651.214-.015-.046.245-.207.582-.368z"
        fill="url(#i953rxjvwaL)" />
    <path
        d="M5.331 6.045c.345-.16.636-.252.652-.214.023.046-.238.207-.583.368-.345.16-.636.253-.651.214-.015-.046.245-.207.582-.368z"
        fill="url(#340sljhn8aM)" />
    <path
        d="M6.321 5.332c-.215.245-.353.467-.322.498.038.03.238-.138.452-.383.215-.245.353-.467.322-.498-.038-.03-.237.138-.452.383z"
        fill="url(#xheh9kmkmaN)" />
    <path
        d="M6.321 5.332c-.215.245-.353.467-.322.498.038.03.238-.138.452-.383.215-.245.353-.467.322-.498-.038-.03-.237.138-.452.383z"
        fill="url(#8cjya4kcoaO)" />
    <path
        d="M6.657 6.045c-.345-.16-.636-.252-.651-.214-.023.046.237.207.582.368.345.16.636.253.651.214.016-.046-.245-.207-.582-.368z"
        fill="url(#f9mykdz60aP)" />
    <path
        d="M6.657 6.045c-.345-.16-.636-.252-.651-.214-.023.046.237.207.582.368.345.16.636.253.651.214.016-.046-.245-.207-.582-.368z"
        fill="url(#3bjm6xdt2aQ)" />
    <path
        d="M4.393 5.31c.896.238 1.617.467 1.601.521-.015.046-.75-.107-1.647-.345-.897-.237-1.617-.467-1.602-.52.016-.047.751.106 1.648.344z"
        fill="url(#u4w9cx0t1aR)" />
    <path
        d="M4.393 5.31c.896.238 1.617.467 1.601.521-.015.046-.75-.107-1.647-.345-.897-.237-1.617-.467-1.602-.52.016-.047.751.106 1.648.344z"
        fill="url(#aeuznjl0paS)" />
    <path
        d="M4.982 7.18c.513-.775.965-1.372 1.003-1.35.039.031-.344.675-.858 1.449-.513.774-.965 1.372-1.004 1.349-.038-.031.345-.675.859-1.449z"
        fill="url(#f78vpp3vsaT)" />
    <path
        d="M4.982 7.18c.513-.775.965-1.372 1.003-1.35.039.031-.344.675-.858 1.449-.513.774-.965 1.372-1.004 1.349-.038-.031.345-.675.859-1.449z"
        fill="url(#dzbe5zhs4aU)" />
    <path
        d="M7.593 5.31c-.897.238-1.617.467-1.602.521.016.046.751-.107 1.648-.345.897-.237 1.617-.467 1.601-.52-.007-.047-.75.106-1.647.344z"
        fill="url(#vsqovwy8maV)" />
    <path
        d="M7.593 5.31c-.897.238-1.617.467-1.602.521.016.046.751-.107 1.648-.345.897-.237 1.617-.467 1.601-.52-.007-.047-.75.106-1.647.344z"
        fill="url(#p698qnvflaW)" />
    <path
        d="M7.004 7.18c-.513-.775-.965-1.372-1.003-1.35-.039.031.344.675.858 1.449.513.774.965 1.372 1.004 1.349.038-.023-.345-.675-.859-1.449z"
        fill="url(#3xx6iehr7aX)" />
    <path
        d="M7.004 7.18c-.513-.775-.965-1.372-1.003-1.35-.039.031.344.675.858 1.449.513.774.965 1.372 1.004 1.349.038-.023-.345-.675-.859-1.449z"
        fill="url(#fprxymftgaY)" />
    <path
        d="M5.99 7.388c.047 0 .085-.398.085-.889 0-.49-.038-.889-.085-.889-.046 0-.084.398-.084.89 0 .49.038.888.084.888z"
        fill="url(#rpe2uvk5saZ)" />
    <path
        d="M5.99 7.388c.047 0 .085-.398.085-.889 0-.49-.038-.889-.085-.889-.046 0-.084.398-.084.89 0 .49.038.888.084.888z"
        fill="url(#x3vqux1z7ba)" />
    <defs>
        <linearGradient id="h1huv17dxa" x1="-.198" y1="5.997" x2="12.414" y2="5.997" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="i86ok0pi3b" x1="1.649" y1="1.647" x2="10.066" y2="10.064" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ehi6f8oh6c" x1="2.866" y1="2.866" x2="8.923" y2="8.922" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="gzmay169md" x1="2.952" y1="2.95" x2="8.847" y2="8.844" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F1115" />
            <stop offset=".14" stopColor="#1C2228" />
            <stop offset=".258" stopColor="#2D352E" />
            <stop offset=".36" stopColor="#1C2228" />
            <stop offset=".489" stopColor="#0F1115" />
            <stop offset=".613" stopColor="#1C2228" />
            <stop offset=".737" stopColor="#2D352E" />
            <stop offset=".839" stopColor="#1C2228" />
            <stop offset="1" stopColor="#0F1115" />
        </linearGradient>
        <linearGradient id="1ber48sdhe" x1="3.337" y1="3.336" x2="8.485" y2="8.484" gradientUnits="userSpaceOnUse">
            <stop stopColor="#161A1F" />
            <stop offset=".018" stopColor="#1A1F22" />
            <stop offset=".14" stopColor="#353E36" />
            <stop offset=".258" stopColor="#414D42" />
            <stop offset=".36" stopColor="#353E36" />
            <stop offset=".489" stopColor="#161A1F" />
            <stop offset=".505" stopColor="#1A1F22" />
            <stop offset=".613" stopColor="#353E36" />
            <stop offset=".737" stopColor="#414D42" />
            <stop offset=".839" stopColor="#353E36" />
            <stop offset="1" stopColor="#161A1F" />
        </linearGradient>
        <linearGradient id="1l07cregvg" x1="-1.652" y1="10.74" x2="12.64" y2="10.74" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="dyqwqk14lh" x1="-1.651" y1="11.27" x2="12.64" y2="11.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="mkgcjku38i" x1="-1.652" y1="10.56" x2="12.638" y2="10.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="fvfrtsvr1j" x1="-1.653" y1="11.05" x2="12.64" y2="11.05" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="qmju0yvrtk" x1="-1.652" y1="10.259" x2="12.638" y2="10.259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="4zyn1ig49l" x1="-1.653" y1="10.716" x2="12.639" y2="10.716" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="0p1nnch4bm" x1="-1.653" y1="9.827" x2="12.639" y2="9.827" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ttudymdqqn" x1="-1.651" y1="10.213" x2="12.64" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="n5xsvsjlmo" x1="-1.65" y1="9.278" x2="12.639" y2="9.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="g3fp6hsf5p" x1="-1.652" y1="9.59" x2="12.641" y2="9.59" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="0ccft8ds5q" x1="-1.651" y1="8.612" x2="12.64" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="v1pn4kbkbr" x1="-1.651" y1="8.87" x2="12.642" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="vgfmpms1gs" x1="-1.649" y1="7.889" x2="12.643" y2="7.889" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="yvtdnpf3kt" x1="-1.65" y1="8.112" x2="12.644" y2="8.112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="dr8wde01vu" x1="-1.653" y1="7.13" x2="12.641" y2="7.13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="rbpx7b6kqv" x1="-1.651" y1="7.333" x2="12.641" y2="7.333" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="90ujm91tzw" x1="-1.652" y1="6.359" x2="12.64" y2="6.359" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="vxvuw8m5lx" x1="-1.651" y1="6.471" x2="12.641" y2="6.471" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="r4m1mbl0by" x1="-1.652" y1="5.551" x2="12.642" y2="5.551" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="gzljgmh16z" x1="-1.651" y1="5.56" x2="12.642" y2="5.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="hf8o0b2iwA" x1="-1.649" y1="4.777" x2="12.642" y2="4.777" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="l4xtsxrj8B" x1="-1.65" y1="4.657" x2="12.644" y2="4.657" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="jhcag8r9zC" x1="-1.653" y1="4.051" x2="12.641" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="4t70m2ks7D" x1="-1.653" y1="3.786" x2="12.639" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="asylxmw73E" x1="-1.653" y1="3.352" x2="12.641" y2="3.352" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="t0iyc83h7F" x1="-1.654" y1="2.995" x2="12.642" y2="2.995" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="4j8v5cv1oG" x1="-1.651" y1="2.708" x2="12.641" y2="2.708" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="zu7wypgqmH" x1="-1.652" y1="2.279" x2="12.642" y2="2.279" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="9g7nf6ekbI" x1="-1.653" y1="2.145" x2="12.639" y2="2.145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="uc3ffgv5bJ" x1="-1.653" y1="1.679" x2="12.64" y2="1.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="r3c0c6r4yK" x1="-1.651" y1="1.683" x2="12.642" y2="1.683" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="b0f0q2h2uL" x1="-1.651" y1="1.197" x2="12.642" y2="1.197" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="nmckm0tnlM" x1="-1.652" y1="6.254" x2="12.641" y2="6.254" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="qf9pynp8kN" x1="-1.649" y1="10.74" x2="12.642" y2="10.74" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="vytcdmmsbO" x1="-1.649" y1="11.27" x2="12.643" y2="11.27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="tw443grtvP" x1="-1.649" y1="10.56" x2="12.643" y2="10.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="1ttyvi4cbQ" x1="-1.651" y1="11.05" x2="12.643" y2="11.05" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="bvgjxvo5wR" x1="-1.65" y1="10.259" x2="12.643" y2="10.259" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="7o45ajij8S" x1="-1.649" y1="10.716" x2="12.644" y2="10.716" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ix65v5yxyT" x1="-1.651" y1="9.827" x2="12.642" y2="9.827" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="x4i66tqafU" x1="-1.65" y1="10.213" x2="12.642" y2="10.213" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="1i8xz6ud8V" x1="-1.651" y1="9.278" x2="12.641" y2="9.278" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="p7fvwa7heW" x1="-1.652" y1="9.59" x2="12.641" y2="9.59" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="9io93adbjX" x1="-1.65" y1="8.612" x2="12.643" y2="8.612" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="kiqtx5py2Y" x1="-1.649" y1="8.87" x2="12.643" y2="8.87" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="t12t8q54uZ" x1="-1.651" y1="7.889" x2="12.641" y2="7.889" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ni75b1gvkaa" x1="-1.652" y1="8.112" x2="12.64" y2="8.112" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ikewtpppjab" x1="-1.655" y1="7.13" x2="12.642" y2="7.13" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="pzrgybi84ac" x1="-1.651" y1="7.333" x2="12.642" y2="7.333" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="u908m6i49ad" x1="-1.649" y1="6.359" x2="12.643" y2="6.359" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="dtpabdx7cae" x1="-1.65" y1="6.471" x2="12.642" y2="6.471" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="tu60ezuklaf" x1="-1.65" y1="5.551" x2="12.642" y2="5.551" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="hmt8hbzyfag" x1="-1.652" y1="5.56" x2="12.642" y2="5.56" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="q45vh5iscah" x1="-1.652" y1="4.777" x2="12.641" y2="4.777" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="q1wov50nkai" x1="-1.655" y1="4.657" x2="12.64" y2="4.657" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="89bcu8mhpaj" x1="-1.651" y1="4.051" x2="12.641" y2="4.051" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="xgu8fn69yak" x1="-1.649" y1="3.786" x2="12.641" y2="3.786" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="dbuw4o3r6al" x1="-1.651" y1="3.352" x2="12.643" y2="3.352" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="iw5du319zam" x1="-1.649" y1="2.995" x2="12.644" y2="2.995" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="kk4cbaggnan" x1="-1.649" y1="2.708" x2="12.643" y2="2.708" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="vkfljpjokao" x1="-1.65" y1="2.279" x2="12.642" y2="2.279" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="ikoq141atap" x1="-1.651" y1="2.145" x2="12.641" y2="2.145" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="3amdhd1p3aq" x1="-1.651" y1="1.679" x2="12.642" y2="1.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="34b9h3p9uar" x1="-1.653" y1="1.683" x2="12.64" y2="1.683" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="whdywpqy6as" x1="-1.653" y1="1.197" x2="12.639" y2="1.197" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="g3sfsp9ubat" x1="-1.653" y1="6.255" x2="12.64" y2="6.255" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B16159" />
            <stop offset=".094" stopColor="#E1AA9C" />
            <stop offset=".14" stopColor="#F5C9B9" />
            <stop offset=".258" stopColor="#FFF7EB" />
            <stop offset=".36" stopColor="#F5C9B9" />
            <stop offset=".489" stopColor="#B16159" />
            <stop offset=".572" stopColor="#E1AA9C" />
            <stop offset=".613" stopColor="#F5C9B9" />
            <stop offset=".737" stopColor="#FFF7EB" />
            <stop offset=".839" stopColor="#F5C9B9" />
            <stop offset="1" stopColor="#B16159" />
        </linearGradient>
        <linearGradient id="1mignkp9tau" x1="2.488" y1="2.738" x2="8.961" y2="9.21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="92eqd70jgav" x1="3.296" y1="3.53" x2="7.981" y2="8.215" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".572" stopColor="#CE9B8A" />
            <stop offset=".864" stopColor="#865954" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <linearGradient id="0d1rxjrfxaw" x1="3.156" y1="3.369" x2="8.965" y2="9.178" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".572" stopColor="#CE9B8A" />
            <stop offset=".864" stopColor="#865954" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <linearGradient id="aos1gc94fax" x1="5.652" y1="5.879" x2="5.652" y2="2.849" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="8th24rf0fay" x1="6.753" y1="3.601" x2="5.138" y2="5.269" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="i4i1pkjkraz" x1="4.291" y1="8.354" x2="5.66" y2="5.664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="lfjbt25fkaA" x1="7.7" y1="8.354" x2="6.331" y2="5.664" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".572" stopColor="#CE9B8A" />
            <stop offset=".864" stopColor="#865954" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <linearGradient id="unfsh8fanaB" x1="3.122" y1="5.132" x2="6.578" y2="5.557" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".076" stopColor="#7E524F" />
            <stop offset=".296" stopColor="#B58478" />
            <stop offset=".484" stopColor="#DDA896" />
            <stop offset=".634" stopColor="#F6BFA8" />
            <stop offset=".725" stopColor="#FFC7AF" />
            <stop offset=".821" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="s943ngm80aC" x1="9.2" y1="4.94" x2="6.119" y2="5.483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".464" stopColor="#F6BFA8" />
            <stop offset=".59" stopColor="#DDA896" />
            <stop offset=".75" stopColor="#B58478" />
            <stop offset=".935" stopColor="#7E524F" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <linearGradient id="srwxlkqtqaD" x1="5.716" y1="6.192" x2="2.694" y2="5.169" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="uw2wj933haE" x1="5.863" y1="6.332" x2="8.884" y2="5.309" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".572" stopColor="#CE9B8A" />
            <stop offset=".864" stopColor="#865954" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <linearGradient id="6qfjm3mh7aF" x1="6.1" y1="6.354" x2="4.357" y2="8.838" gradientUnits="userSpaceOnUse">
            <stop stopColor="#693F3F" />
            <stop offset=".136" stopColor="#865954" />
            <stop offset=".428" stopColor="#CE9B8A" />
            <stop offset=".613" stopColor="#FFC7AF" />
            <stop offset=".748" stopColor="#FFC2A6" />
            <stop offset="1" stopColor="#FFBC9A" />
        </linearGradient>
        <linearGradient id="3ahwdz34eaG" x1="5.51" y1="5.81" x2="7.252" y2="8.295" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFBC9A" />
            <stop offset=".252" stopColor="#FFC2A6" />
            <stop offset=".387" stopColor="#FFC7AF" />
            <stop offset=".572" stopColor="#CE9B8A" />
            <stop offset=".864" stopColor="#865954" />
            <stop offset="1" stopColor="#693F3F" />
        </linearGradient>
        <radialGradient id="4pf8ii62sf" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(8.636 5.168) scale(7.33234)">
            <stop stopColor="#E8E8E8" />
            <stop offset=".054" stopColor="#A7A7A7" />
            <stop offset=".14" stopColor="#636363" />
            <stop offset=".218" stopColor="#4C4C4C" />
            <stop offset=".334" stopColor="#303030" />
            <stop offset=".459" stopColor="#1B1B1B" />
            <stop offset=".598" stopColor="#0C0C0C" />
            <stop offset=".76" stopColor="#030303" />
            <stop offset="1" />
        </radialGradient>
        <radialGradient id="oy28131cuaH" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 5.995 4.428)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a0boo7nkpaI" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 1.40569 5.995 4.428)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="9snru14h5aJ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.605 5.39)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="txebtwm2aaK" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.06626 -.05779 .38474 .44113 5.605 5.39)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="i953rxjvwaL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.372 6.123)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="340sljhn8aM" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03751 -.07953 .61769 -.29136 5.372 6.123)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="xheh9kmkmaN" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-138.906 4.204 1.498) scale(.08792 .58534)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="8cjya4kcoaO" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-138.906 4.204 1.498) scale(.08792 .58534)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="f9mykdz60aP" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.619 6.123)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="3bjm6xdt2aQ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03752 -.07953 .61769 .29136 6.619 6.123)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="u4w9cx0t1aR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.02261 -.08499 1.62389 .43208 4.37 5.399)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aeuznjl0paS" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.02261 -.08499 1.62389 .43208 4.37 5.399)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="f78vpp3vsaT" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.626 2.846) scale(.08794 1.6805)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dzbe5zhs4aU" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-146.23 3.626 2.846) scale(.08794 1.6805)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vsqovwy8maV" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.618 5.399)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p698qnvflaW" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.02261 -.08499 1.62389 -.43208 7.618 5.399)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="3xx6iehr7aX" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .93409 1.39704 6.93 7.228)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fprxymftgaY" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.0731 -.04888 .93409 1.39704 6.93 7.228)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rpe2uvk5saZ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.991 6.5)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="x3vqux1z7ba" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.08792 0 0 .88797 5.991 6.5)">
            <stop stopColor="#FFB49B" />
            <stop offset=".088" stopColor="#F3AB93" stopOpacity=".911" />
            <stop offset=".25" stopColor="#D29480" stopOpacity=".75" />
            <stop offset=".466" stopColor="#9D6F5F" stopOpacity=".534" />
            <stop offset=".73" stopColor="#533B32" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
    </defs>
</svg>

const DiamondIcon = ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C5.364 24 0 18.62 0 12 0 5.364 5.38 0 12 0c6.636 0 12 5.38 12 12 .015 6.636-5.364 12-12 12z"
          fill="url(#arkqwlgnwa)" />
    <path
        d="M12 23.738c-6.483 0-11.74-5.256-11.74-11.74C.26 5.517 5.517.26 12 .26 18.483.26 23.74 5.516 23.74 12c0 6.482-5.257 11.74-11.74 11.74z"
        fill="url(#w62ec5l8ib)" />
    <path
        d="M12 20.444c-4.659 0-8.444-3.785-8.444-8.444 0-4.66 3.785-8.445 8.444-8.445 4.66 0 8.445 3.786 8.445 8.445.015 4.674-3.77 8.444-8.445 8.444z"
        fill="url(#ecb7gu115c)" />
    <path d="M12 20.23a8.215 8.215 0 1 1 8.215-8.214c.015 4.52-3.663 8.214-8.215 8.214z" fill="url(#c2gy8t7cvd)" />
    <path
        d="M12 19.19a7.172 7.172 0 0 1-7.172-7.173A7.172 7.172 0 0 1 12 4.844a7.172 7.172 0 0 1 7.172 7.173c.016 3.954-3.203 7.172-7.172 7.172z"
        fill="url(#0me5z2cwke)" />
    <path opacity=".6"
          d="M18.038 6.421A8.188 8.188 0 0 0 12 3.785a8.215 8.215 0 0 0-3.463 15.663c.52-5.808 4.321-10.79 9.501-13.027z"
          fill="url(#sxfw85ml9f)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.992 22.07s-.567-.169-.705-1.134c0-.015.735.475.705 1.134z"
          fill="url(#rswx2oua0g)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.96 22.208s-.168.567-1.133.705c-.016-.016.475-.751 1.134-.705z"
          fill="url(#7sh410nqxh)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.292 21.765s-.52-.276-.46-1.257c0 0 .629.628.46 1.257z"
          fill="url(#n67jgdkh8i)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.23 21.887s-.275.521-1.256.46c0 0 .628-.613 1.257-.46z"
          fill="url(#5f67qspxvj)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.743 21.183s-.49-.337-.292-1.302c0 0 .537.705.292 1.302z"
          fill="url(#9y83mgbwhk)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.666 21.306s-.337.49-1.303.291c0 0 .705-.536 1.303-.291z"
          fill="url(#hgu2lwwphl)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.24 20.324s-.398-.445.015-1.334c0 0 .368.813-.015 1.334z"
          fill="url(#k73nrlsx2m)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.148 20.43s-.444.399-1.333-.015c-.016.015.797-.353 1.333.015z"
          fill="url(#qly3ipyzln)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.89 19.222s-.306-.505.261-1.318c0 .016.2.874-.26 1.318z"
          fill="url(#0h4rojyhzo)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.769 19.3s-.506.306-1.318-.261c0 0 .873-.2 1.318.26z"
          fill="url(#vra91o753p)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.745 17.872s-.245-.537.414-1.272c0 0 .107.873-.414 1.272z"
          fill="url(#7254nemtgq)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.623 17.933s-.537.245-1.272-.413c0 .015.873-.092 1.272.413z"
          fill="url(#3rl7cnidqr)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.9 16.415s-.214-.551.49-1.241c0 0 .047.873-.49 1.241z"
          fill="url(#k1jl8c8abs)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.762 16.46s-.551.215-1.241-.49c0 0 .889-.046 1.241.49z"
          fill="url(#3rjl8n6p6t)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.305 14.884s-.184-.552.537-1.226c0 0 .015.89-.537 1.226z"
          fill="url(#v4nh59ej7u)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.167 14.931s-.551.184-1.226-.536c0 0 .89 0 1.226.536z"
          fill="url(#qrzi6j0s6v)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.968 13.289s-.092-.583.736-1.12c0 0-.138.874-.736 1.12z"
          fill="url(#4jlc6ibgtw)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.83 13.32s-.582.092-1.118-.736c0 0 .873.138 1.119.736z"
          fill="url(#f4wrwi5y2x)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.92 11.589s.016-.598.936-.966c0 .015-.307.843-.935.966z"
          fill="url(#q5lqcvvbry)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.768 11.589s-.598-.016-.966-.935c.016.015.843.306.966.935z"
          fill="url(#yng6gkuuxz)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.151 9.918s.154-.567 1.134-.72c-.015.015-.49.75-1.134.72z"
          fill="url(#b4drnfeyrA)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M1.999 9.888s-.567-.153-.72-1.134c.015 0 .75.49.72 1.134z"
          fill="url(#yallwpgbdB)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.625 8.293s.307-.505 1.287-.383c-.015 0-.674.583-1.287.383z"
          fill="url(#2435rd51pC)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.487 8.23s-.505-.306-.383-1.287c.015 0 .598.66.383 1.288z"
          fill="url(#we435u02sD)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.406 6.762s.399-.43 1.334-.092c0 0-.767.414-1.334.092z"
          fill="url(#s8b1l9jxnE)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3.299 6.671s-.43-.398-.092-1.333c0 0 .429.782.092 1.333z"
          fill="url(#b5zyw1ll5F)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.45 5.353s.49-.338 1.318.199c0-.015-.843.23-1.318-.2z"
          fill="url(#wf8n2aq5cG)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4.358 5.23s-.337-.49.2-1.318c0 0 .244.843-.2 1.318z"
          fill="url(#et9ungp03H)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.752 4.14s.522-.26 1.288.353c0 0-.874.138-1.288-.353z"
          fill="url(#j38tz045sI)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.676 4.018s-.26-.521.352-1.288c.015 0 .138.874-.352 1.288z"
          fill="url(#ymcf1c0boJ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.24 3.161s.552-.23 1.257.46c0 0-.874.077-1.257-.46z"
          fill="url(#g5paw6luvK)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M7.179 3.038s-.23-.552.46-1.257c0 0 .06.874-.46 1.257z"
          fill="url(#a9973zhu0L)" />
    <path
        d="M11.956 22.162h-.306c-.107 0-.23 0-.368-.016-.076 0-.153-.015-.23-.015h-.122c-.046 0-.092-.015-.138-.015a11.06 11.06 0 0 1-.613-.077c-.23-.03-.46-.092-.72-.138a10.246 10.246 0 0 1-1.671-.567 9.851 9.851 0 0 1-1.809-1.027c-.153-.107-.29-.23-.444-.337-.153-.122-.291-.245-.444-.368a8.608 8.608 0 0 1-.828-.843c-.061-.076-.138-.153-.2-.23-.06-.076-.122-.153-.183-.245l-.092-.122-.092-.123c-.061-.077-.123-.169-.184-.26-.23-.353-.46-.705-.644-1.088a8.045 8.045 0 0 1-.505-1.18l-.108-.307c-.015-.046-.03-.107-.046-.153l-.046-.154-.092-.306-.076-.322a10.34 10.34 0 0 1-.23-2.56c0-.413.061-.842.107-1.256.046-.2.077-.414.107-.613.046-.2.108-.399.154-.598.23-.781.536-1.502.889-2.145a11.47 11.47 0 0 1 1.195-1.702c.43-.475.858-.888 1.272-1.21.107-.077.2-.154.291-.23.092-.077.2-.138.291-.2.092-.06.184-.122.26-.183.093-.062.17-.108.246-.154.169-.092.307-.183.43-.245.137-.061.244-.122.336-.168l.276-.138c.016 0 .03 0 .03.015s0 .03-.014.03l-.276.139c-.092.046-.2.107-.322.168-.123.077-.26.169-.43.26-.076.047-.168.093-.244.154a3.83 3.83 0 0 1-.261.184c-.092.061-.184.138-.276.2-.092.076-.184.152-.291.244-.398.322-.812.751-1.226 1.226-.414.49-.797 1.058-1.165 1.686a9.985 9.985 0 0 0-.843 2.115c-.046.2-.107.383-.138.583-.03.199-.076.398-.107.597-.046.399-.107.813-.107 1.226-.03.828.046 1.686.23 2.498l.076.307.092.306.046.154c.016.046.03.107.046.153l.107.306c.154.399.307.782.506 1.15.184.368.399.72.629 1.057.06.077.122.169.168.245l.092.123.092.123.184.23c.061.076.123.153.2.23.26.306.536.582.811.842.138.123.276.261.43.368.153.107.29.23.444.337.582.43 1.18.782 1.762 1.043.583.275 1.135.46 1.625.597.245.062.49.123.705.169.214.046.43.077.613.107.046 0 .092.015.138.015.046 0 .092.016.123.016.076.015.153.015.23.015.137.015.26.015.367.03.184.047.291.047.291.047z"
        fill="url(#j0avm0tyqM)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12.911 22.07s.567-.169.705-1.134c-.015-.015-.75.475-.705 1.134z"
          fill="url(#3fn7ax01dN)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12.942 22.208s.168.567 1.134.705c0-.016-.49-.751-1.134-.705z"
          fill="url(#lpqeopaaqO)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.596 21.765s.521-.276.46-1.257c0 0-.613.628-.46 1.257z"
          fill="url(#51i6mydyzP)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M14.657 21.887s.276.521 1.256.46c0 0-.628-.613-1.256-.46z"
          fill="url(#c3bh3op7iQ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.143 21.183s.49-.337.291-1.302c0 0-.536.705-.29 1.302z"
          fill="url(#qboj0grqwR)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.22 21.306s.337.49 1.302.291c0 0-.705-.536-1.302-.291z"
          fill="url(#6mwjd3u92S)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17.646 20.324s.399-.445-.015-1.334c0 0-.352.813.015 1.334z"
          fill="url(#f7zcsm7xdT)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M17.754 20.43s.444.399 1.333-.015c0 .015-.812-.353-1.333.015z"
          fill="url(#53zpfd6awU)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.009 19.222s.306-.505-.26-1.318c-.016.016-.215.874.26 1.318z"
          fill="url(#gx784g7zjV)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.131 19.3s.506.306 1.318-.261c-.015 0-.873-.2-1.318.26z"
          fill="url(#uwbfetzt2W)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20.14 17.872s.246-.537-.413-1.272c0 0-.092.873.413 1.272z"
          fill="url(#an5q97wemX)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20.263 17.933s.537.245 1.272-.413c0 .015-.873-.092-1.272.413z"
          fill="url(#esm3xjq7wY)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.002 16.415s.214-.551-.49-1.241c-.016 0-.047.873.49 1.241z"
          fill="url(#ufdmji51qZ)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.14 16.46s.551.215 1.241-.49c0 0-.889-.046-1.241.49z"
          fill="url(#gjanij8vgaa)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.583 14.884s.184-.552-.536-1.226c0 0 0 .89.536 1.226z"
          fill="url(#bvyrriwrbab)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.721 14.931s.552.184 1.226-.536c0 0-.889 0-1.226.536z"
          fill="url(#05d3gr7xgac)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.934 13.289s.092-.583-.735-1.12c0 0 .138.874.735 1.12z"
          fill="url(#z71eejmmvad)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M22.072 13.32s.582.092 1.119-.736c0 0-.874.138-1.12.736z"
          fill="url(#oiyd3tpfvae)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.982 11.589s-.016-.598-.935-.966c0 .015.291.843.935.966z"
          fill="url(#34cdv935kaf)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M22.12 11.589s.597-.016.965-.935c0 .015-.843.306-.965.935z"
          fill="url(#zeauja1eaag)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.754 9.918s-.154-.567-1.134-.72c0 .015.49.75 1.134.72z"
          fill="url(#97k0kvmp2ah)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.891 9.888s.567-.153.72-1.134c0 0-.735.49-.72 1.134z"
          fill="url(#a7v8b81xxai)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.28 8.293s-.308-.505-1.288-.383c0 0 .674.583 1.287.383z"
          fill="url(#elcmem29uaj)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M21.401 8.23s.506-.306.384-1.287c0 0-.583.66-.384 1.288z"
          fill="url(#ctbstrjpaak)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20.478 6.762s-.398-.43-1.333-.092c0 0 .782.414 1.333.092z"
          fill="url(#hujsa8tx4al)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20.586 6.671s.43-.398.092-1.333c0 0-.414.782-.092 1.333z"
          fill="url(#pj5hgp3svam)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.44 5.353s-.49-.338-1.318.199c0-.015.858.23 1.318-.2z"
          fill="url(#tniffkmfuan)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.532 5.23s.337-.49-.2-1.318c.016 0-.245.843.2 1.318z"
          fill="url(#bksrhkw4eao)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M18.152 4.14s-.521-.26-1.287.353c0 0 .873.138 1.287-.353z"
          fill="url(#q8dlo3ao3ap)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M18.213 4.018s.276-.521-.352-1.288c0 0-.138.874.352 1.288z"
          fill="url(#5l5fzno2gaq)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.647 3.161s-.552-.23-1.257.46c0 0 .889.077 1.257-.46z"
          fill="url(#5o7r8z1wbar)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.708 3.038s.23-.552-.46-1.257c.016 0-.06.874.46 1.257z"
          fill="url(#i07ufijb4as)" />
    <path
        d="M11.94 22.163s.108 0 .307-.015c.108 0 .23-.015.368-.03.077 0 .153-.016.23-.016.046 0 .077-.015.123-.015s.092-.016.138-.016c.184-.03.383-.046.613-.107.214-.046.46-.107.705-.168a9.227 9.227 0 0 0 1.624-.598 9.648 9.648 0 0 0 1.763-1.042c.153-.108.29-.23.444-.337.138-.123.291-.246.43-.368.275-.26.55-.537.812-.843.06-.077.137-.154.199-.23l.184-.23.092-.123.091-.122c.062-.077.123-.169.17-.245.229-.338.444-.69.627-1.058.2-.368.353-.75.506-1.15l.108-.306a1.96 1.96 0 0 0 .046-.153l.045-.153.092-.307.077-.306c.184-.828.26-1.67.23-2.498 0-.43-.061-.828-.107-1.226-.031-.2-.077-.399-.108-.598-.046-.2-.092-.383-.138-.583a10.866 10.866 0 0 0-.843-2.115 10.885 10.885 0 0 0-1.164-1.685c-.414-.475-.828-.905-1.226-1.226l-.291-.246c-.092-.076-.2-.138-.276-.199a3.817 3.817 0 0 1-.26-.184c-.077-.061-.17-.107-.246-.153-.153-.092-.291-.184-.43-.26-.122-.062-.23-.123-.321-.17l-.276-.137c-.015 0-.015-.015-.015-.03 0-.016.015-.016.03-.016l.276.138c.092.046.2.107.337.168.123.077.276.154.43.246.076.046.168.092.245.153.092.061.168.123.26.184s.184.122.291.2c.092.076.2.152.292.229.413.322.843.736 1.272 1.21.413.491.827 1.058 1.195 1.702.353.643.66 1.364.889 2.145.046.2.107.399.153.598.03.2.077.399.108.613.06.414.107.843.107 1.257.03.843-.046 1.716-.23 2.56l-.077.321-.092.307-.046.153c-.015.046-.03.107-.046.153l-.107.307c-.153.398-.322.797-.506 1.18-.184.383-.413.735-.643 1.088-.062.092-.123.168-.184.26l-.092.123-.092.123a3.388 3.388 0 0 0-.184.245c-.061.076-.138.153-.2.23-.26.306-.551.582-.827.843-.153.122-.291.26-.444.367-.154.123-.291.23-.445.338-.597.429-1.226.766-1.808 1.026-.598.26-1.15.445-1.67.567-.261.062-.491.108-.721.138-.23.046-.43.062-.613.077-.046 0-.092.015-.138.015h-.123c-.076 0-.168.016-.23.016-.137.015-.275.015-.367.015-.215-.03-.322-.03-.322-.03z"
        fill="url(#q3h6vhutsat)" />
    <path d="m18.362 10.65-2.835-2.866-.184 3.403 3.019-.537z" fill="#48DED0" />
    <path d="m15.342 11.186-3.34 6.253 6.36-6.79-3.02.537z" fill="#8ADED6" />
    <path d="M15.527 7.784h-3.402l3.218 3.403.184-3.403z" fill="#1CB1A4" />
    <path d="M12.002 11.8v5.64l3.34-6.253-3.34.613z" fill="#6EBEB7" />
    <path d="m15.342 11.187-3.218-3.403h-.123V11.8l3.341-.614zM8.676 11.187 12 17.44V11.8l-3.325-.613z"
          fill="#9EFFF7" />
    <path d="M12.001 11.8V7.784l-3.325 3.403L12 11.8z" fill="#6EBEB7" />
    <path d="M12.002 7.784h-3.51l.184 3.403 3.326-3.403z" fill="#1CB1A4" />
    <path d="m5.657 10.65 6.345 6.789-3.326-6.253-3.02-.537z" fill="#8ADED6" />
    <path d="M8.492 7.784 5.657 10.65l3.019.537-.184-3.403z" fill="#48DED0" />
    <path
        d="M15.141 11.019c-1.824.352-3.28.72-3.264.812.015.092 1.517-.122 3.325-.475 1.824-.352 3.28-.72 3.265-.812 0-.092-1.502.122-3.326.475z"
        fill="url(#p47a08j9yau)" />
    <path
        d="M15.139 13.893c-1.744 1.879-3.084 3.441-3.012 3.494.071.053 1.553-1.44 3.28-3.306 1.743-1.88 3.083-3.442 3.011-3.495-.055-.066-1.536 1.427-3.28 3.307z"
        fill="url(#qrnkc1t8uav)" />
    <path
        d="M8.695 14.064c1.718 1.902 3.157 3.374 3.216 3.307.059-.066-1.299-1.673-3.005-3.557-1.72-1.902-3.158-3.374-3.217-3.307-.07.049 1.287 1.655 3.006 3.557z"
        fill="url(#2i157as0baw)" />
    <path
        d="M10.134 14.191c.942 1.848 1.771 3.299 1.848 3.256.077-.043-.632-1.586-1.569-3.418-.942-1.848-1.771-3.299-1.848-3.256-.082.026.626 1.57 1.569 3.418z"
        fill="url(#56vy35jieax)" />
    <path
        d="M13.549 14.257c-.94 1.73-1.628 3.163-1.55 3.203.077.04.908-1.341 1.839-3.059.94-1.73 1.628-3.162 1.55-3.203-.068-.053-.898 1.328-1.839 3.06z"
        fill="url(#me84te4unay)" />
    <path
        d="M11.787 14.293c-.012 1.97.058 3.557.146 3.556.088-.002.168-1.611.177-3.565.012-1.97-.058-3.557-.146-3.556-.085-.014-.164 1.595-.177 3.565z"
        fill="url(#qy5jaym6gaz)" />
    <path
        d="M11.883 9.814c.015 1.364.106 2.471.192 2.48.087.01.143-1.097.126-2.45-.015-1.364-.106-2.471-.192-2.48-.084-.02-.14 1.086-.126 2.45z"
        fill="url(#20hs03l98aA)" />
    <path
        d="M8.92 11.078c1.823.321 3.294.659 3.279.75-.015.092-1.517-.076-3.341-.398-1.824-.322-3.295-.659-3.28-.751.016-.092 1.517.092 3.341.399z"
        fill="url(#qq9ndxgmfaB)" />
    <path
        d="M10.236 9.407c.92-.935 1.701-1.67 1.762-1.625.046.046-.643.843-1.563 1.793-.92.95-1.701 1.67-1.762 1.625-.062-.046.643-.858 1.563-1.793z"
        fill="url(#vtzysxe0kaC)" />
    <path
        d="M8.492 9.516c-.046-.935-.046-1.716.016-1.732.06-.015.138.736.183 1.67.046.936.046 1.717-.015 1.733-.061.015-.138-.72-.184-1.67z"
        fill="url(#u34hxwzavaD)" />
    <path
        d="M6.957 9.165c.781-.797 1.456-1.41 1.532-1.38.062.03-.52.69-1.302 1.487-.782.797-1.456 1.41-1.533 1.38-.046-.031.521-.706 1.303-1.487z"
        fill="url(#m2288iw7maE)" />
    <path
        d="M10.208 7.677c.965 0 1.762.046 1.793.107.015.061-.75.107-1.716.107s-1.763-.046-1.794-.107c-.015-.061.751-.107 1.717-.107z"
        fill="url(#4cc9zvrd7aF)" />
    <path
        d="M13.884 9.422c-.92-.934-1.701-1.67-1.763-1.624-.046.046.644.843 1.563 1.793.92.935 1.702 1.67 1.763 1.625.061-.046-.644-.843-1.563-1.794z"
        fill="url(#c0up2xrcwaG)" />
    <path
        d="M15.556 9.547c.046-.934.046-1.716-.016-1.731-.06-.016-.137.735-.183 1.67-.046.935-.046 1.717.015 1.732.046.015.138-.736.184-1.67z"
        fill="url(#05j9y6k4iaH)" />
    <path
        d="M17.04 9.196c-.78-.797-1.455-1.41-1.532-1.38-.061.031.521.69 1.303 1.487.782.797 1.456 1.41 1.533 1.38.06-.031-.521-.706-1.303-1.487z"
        fill="url(#zezat8oifaI)" />
    <path
        d="M13.916 7.71c-.966 0-1.763.046-1.793.107-.031.062.75.108 1.716.108.965 0 1.762-.046 1.793-.108.015-.061-.75-.107-1.716-.107z"
        fill="url(#ozii3qs3gaJ)" />
    <defs>
        <linearGradient id="arkqwlgnwa" x1="-.384" y1="12.002" x2="24.838" y2="12.002" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="w62ec5l8ib" x1="3.306" y1="3.3" x2="20.14" y2="20.134" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="ecb7gu115c" x1="5.746" y1="5.741" x2="17.859" y2="17.854" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="c2gy8t7cvd" x1="5.914" y1="5.91" x2="17.703" y2="17.698" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F1115" />
            <stop offset=".14" stopColor="#1C2228" />
            <stop offset=".258" stopColor="#2C2727" />
            <stop offset=".36" stopColor="#1C2228" />
            <stop offset=".489" stopColor="#0F1115" />
            <stop offset=".613" stopColor="#1C2228" />
            <stop offset=".737" stopColor="#2C2727" />
            <stop offset=".839" stopColor="#1C2228" />
            <stop offset="1" stopColor="#0F1115" />
        </linearGradient>
        <linearGradient id="0me5z2cwke" x1="6.685" y1="6.682" x2="16.981" y2="16.978" gradientUnits="userSpaceOnUse">
            <stop stopColor="#161A1F" />
            <stop offset=".14" stopColor="#352F2F" />
            <stop offset=".258" stopColor="#443B3B" />
            <stop offset=".36" stopColor="#352F2F" />
            <stop offset=".489" stopColor="#161A1F" />
            <stop offset=".613" stopColor="#352F2F" />
            <stop offset=".737" stopColor="#443B3B" />
            <stop offset=".839" stopColor="#352F2F" />
            <stop offset="1" stopColor="#161A1F" />
        </linearGradient>
        <linearGradient id="rswx2oua0g" x1="-3.292" y1="21.492" x2="25.291" y2="21.492" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="7sh410nqxh" x1="-3.292" y1="22.553" x2="25.29" y2="22.553" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="n67jgdkh8i" x1="-3.289" y1="21.132" x2="25.291" y2="21.132" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="5f67qspxvj" x1="-3.292" y1="22.11" x2="25.295" y2="22.11" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="9y83mgbwhk" x1="-3.291" y1="20.529" x2="25.29" y2="20.529" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="hgu2lwwphl" x1="-3.293" y1="21.444" x2="25.292" y2="21.444" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="k73nrlsx2m" x1="-3.294" y1="19.662" x2="25.291" y2="19.662" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="qly3ipyzln" x1="-3.293" y1="20.436" x2="25.29" y2="20.436" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="0h4rojyhzo" x1="-3.292" y1="18.569" x2="25.286" y2="18.569" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="vra91o753p" x1="-3.294" y1="19.192" x2="25.292" y2="19.192" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="7254nemtgq" x1="-3.29" y1="17.236" x2="25.293" y2="17.236" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="3rl7cnidqr" x1="-3.29" y1="17.752" x2="25.295" y2="17.752" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="k1jl8c8abs" x1="-3.292" y1="15.788" x2="25.291" y2="15.788" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="3rjl8n6p6t" x1="-3.293" y1="16.233" x2="25.294" y2="16.233" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="v4nh59ej7u" x1="-3.29" y1="14.272" x2="25.298" y2="14.272" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="qrzi6j0s6v" x1="-3.29" y1="14.679" x2="25.296" y2="14.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="4jlc6ibgtw" x1="-3.289" y1="12.725" x2="25.295" y2="12.725" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="f4wrwi5y2x" x1="-3.289" y1="12.95" x2="25.296" y2="12.95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="q5lqcvvbry" x1="-3.292" y1="11.113" x2="25.298" y2="11.113" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="yng6gkuuxz" x1="-3.291" y1="11.129" x2="25.295" y2="11.129" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="b4drnfeyrA" x1="-3.29" y1="9.565" x2="25.292" y2="9.565" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="yallwpgbdB" x1="-3.29" y1="9.326" x2="25.297" y2="9.326" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="2435rd51pC" x1="-3.293" y1="8.115" x2="25.296" y2="8.115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="we435u02sD" x1="-3.292" y1="7.583" x2="25.293" y2="7.583" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="s8b1l9jxnE" x1="-3.293" y1="6.714" x2="25.295" y2="6.714" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="b5zyw1ll5F" x1="-3.294" y1="6.002" x2="25.298" y2="6.002" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="wf8n2aq5cG" x1="-3.29" y1="5.427" x2="25.293" y2="5.427" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="et9ungp03H" x1="-3.291" y1="4.568" x2="25.296" y2="4.568" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="j38tz045sI" x1="-3.29" y1="4.298" x2="25.293" y2="4.298" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="ymcf1c0boJ" x1="-3.291" y1="3.367" x2="25.294" y2="3.367" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="g5paw6luvK" x1="-3.29" y1="3.378" x2="25.297" y2="3.378" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="a9973zhu0L" x1="-3.29" y1="2.406" x2="25.296" y2="2.406" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="j0avm0tyqM" x1="-3.294" y1="12.517" x2="25.291" y2="12.517" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="3fn7ax01dN" x1="-3.288" y1="21.492" x2="25.295" y2="21.492" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="lpqeopaaqO" x1="-3.288" y1="22.553" x2="25.296" y2="22.553" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="51i6mydyzP" x1="-3.289" y1="21.132" x2="25.294" y2="21.132" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="c3bh3op7iQ" x1="-3.292" y1="22.11" x2="25.295" y2="22.11" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="qboj0grqwR" x1="-3.291" y1="20.529" x2="25.295" y2="20.529" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="6mwjd3u92S" x1="-3.291" y1="21.444" x2="25.294" y2="21.444" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="f7zcsm7xdT" x1="-3.289" y1="19.662" x2="25.296" y2="19.662" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="53zpfd6awU" x1="-3.288" y1="20.436" x2="25.295" y2="20.436" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="gx784g7zjV" x1="-3.29" y1="18.569" x2="25.294" y2="18.569" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="uwbfetzt2W" x1="-3.292" y1="19.192" x2="25.294" y2="19.192" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="an5q97wemX" x1="-3.294" y1="17.236" x2="25.292" y2="17.236" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="esm3xjq7wY" x1="-3.292" y1="17.752" x2="25.291" y2="17.752" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="ufdmji51qZ" x1="-3.29" y1="15.788" x2="25.294" y2="15.788" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="gjanij8vgaa" x1="-3.291" y1="16.233" x2="25.295" y2="16.233" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="bvyrriwrbab" x1="-3.299" y1="14.272" x2="25.295" y2="14.272" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="05d3gr7xgac" x1="-3.292" y1="14.679" x2="25.294" y2="14.679" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="z71eejmmvad" x1="-3.291" y1="12.725" x2="25.292" y2="12.725" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="oiyd3tpfvae" x1="-3.293" y1="12.95" x2="25.292" y2="12.95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="34cdv935kaf" x1="-3.289" y1="11.113" x2="25.294" y2="11.113" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="zeauja1eaag" x1="-3.295" y1="11.129" x2="25.294" y2="11.129" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="97k0kvmp2ah" x1="-3.289" y1="9.565" x2="25.296" y2="9.565" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="a7v8b81xxai" x1="-3.294" y1="9.326" x2="25.296" y2="9.326" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="elcmem29uaj" x1="-3.289" y1="8.115" x2="25.296" y2="8.115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="ctbstrjpaak" x1="-3.284" y1="7.583" x2="25.295" y2="7.583" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="hujsa8tx4al" x1="-3.295" y1="6.714" x2="25.293" y2="6.714" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="pj5hgp3svam" x1="-3.292" y1="6.002" x2="25.293" y2="6.002" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="tniffkmfuan" x1="-3.288" y1="5.427" x2="25.295" y2="5.427" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="bksrhkw4eao" x1="-3.288" y1="4.568" x2="25.296" y2="4.568" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="q8dlo3ao3ap" x1="-3.289" y1="4.298" x2="25.295" y2="4.298" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="5l5fzno2gaq" x1="-3.29" y1="3.367" x2="25.295" y2="3.367" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="5o7r8z1wbar" x1="-3.295" y1="3.378" x2="25.293" y2="3.378" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="i07ufijb4as" x1="-3.293" y1="2.406" x2="25.292" y2="2.406" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <linearGradient id="q3h6vhutsat" x1="-3.294" y1="12.519" x2="25.291" y2="12.519" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A899" />
            <stop offset=".087" stopColor="#9BCDCF" />
            <stop offset=".14" stopColor="#BAE1EC" />
            <stop offset=".258" stopColor="#fff" />
            <stop offset=".36" stopColor="#BAE1EC" />
            <stop offset=".489" stopColor="#60A899" />
            <stop offset=".566" stopColor="#9BCDCF" />
            <stop offset=".613" stopColor="#BAE1EC" />
            <stop offset=".737" stopColor="#fff" />
            <stop offset=".839" stopColor="#BAE1EC" />
            <stop offset="1" stopColor="#60A899" />
        </linearGradient>
        <radialGradient id="sxfw85ml9f" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(17.285 10.346) scale(14.6647)">
            <stop stopColor="#DFDFDF" />
            <stop offset=".054" stopColor="#9E9E9E" />
            <stop offset=".14" stopColor="#5A5A5A" />
            <stop offset=".191" stopColor="#4C4C4C" />
            <stop offset=".311" stopColor="#303030" />
            <stop offset=".441" stopColor="#1B1B1B" />
            <stop offset=".584" stopColor="#0C0C0C" />
            <stop offset=".751" stopColor="#030303" />
            <stop offset="1" />
        </radialGradient>
        <radialGradient id="p47a08j9yau" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.03367 -.17264 3.29855 -.64332 15.181 11.195)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="qrnkc1t8uav" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.13951 -.09437 2.56804 -3.79655 15.287 13.984)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="2i157as0baw" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.10627 .13068 -3.55617 -2.89177 8.798 13.924)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="56vy35jieax" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.14238 .08559 -1.929 -3.20912 10.277 14.098)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="me84te4unay" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-154.317 8.485 5.6) scale(.16569 3.55966)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="qy5jaym6gaz" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.16553 .0072 -.15477 -3.5563 11.958 14.28)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="20hs03l98aA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-175.2 6.231 4.66) scale(.1636 2.45658)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="qq9ndxgmfaB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-80.165 11.133 .344) scale(.17589 3.36086)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vtzysxe0kaC" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.09445 -.08549 1.59711 -1.76452 10.336 9.486)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="u34hxwzavaD" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(-.09835 .03083 -.49367 -1.57484 8.584 9.49)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="m2288iw7maE" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-154.31 4.588 3.801) scale(.12708 1.90098)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="4cc9zvrd7aF" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-109.495 7.876 .269) scale(.11124 1.65253)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="c0up2xrcwaG" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.09445 -.08549 1.59711 1.76452 13.79 9.515)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="05j9y6k4iaH" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(17.411 -23.36 55.251) scale(.10307 1.65035)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="zezat8oifaI" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.11452 -.05508 .824 1.71315 16.934 9.245)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ozii3qs3gaJ" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="matrix(.03712 -.10486 1.5578 .55147 13.879 7.814)">
            <stop stopColor="#4DFFFA" />
            <stop offset=".088" stopColor="#49F3EE" stopOpacity=".911" />
            <stop offset=".25" stopColor="#3FD2CE" stopOpacity=".75" />
            <stop offset=".466" stopColor="#2F9D9A" stopOpacity=".534" />
            <stop offset=".73" stopColor="#195351" stopOpacity=".271" />
            <stop offset="1" stopOpacity="0" />
        </radialGradient>
    </defs>
</svg>
