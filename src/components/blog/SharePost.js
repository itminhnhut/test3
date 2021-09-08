import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faReddit, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { iconColorPrimary } from 'src/config/colors';
import { FacebookShareButton, RedditShareButton, TelegramShareButton, TwitterShareButton } from 'react-share';

const SharePost = ({ url }) => {
    return (
        <div className="post-socials">
            <FacebookShareButton url={url}>
                <FontAwesomeIcon icon={faFacebookF} size="lg" color={iconColorPrimary} />
            </FacebookShareButton>

            {/* <button */}
            {/*    className="btn btn-icon border w-10 h-10" */}
            {/*    type="button" */}
            {/* > */}
            {/*    <FontAwesomeIcon icon={faFacebookMessenger} size="lg" color={iconColorPrimary} /> */}
            {/* </button> */}
            <TwitterShareButton url={url}>
                <FontAwesomeIcon icon={faTwitter} size="lg" color={iconColorPrimary} />
            </TwitterShareButton>
            <TelegramShareButton url={url}>
                <FontAwesomeIcon icon={faTelegram} size="lg" color={iconColorPrimary} />
            </TelegramShareButton>
            <RedditShareButton url={url}>
                <FontAwesomeIcon icon={faReddit} size="lg" color={iconColorPrimary} />
            </RedditShareButton>

        </div>
    );
};

export default SharePost;
