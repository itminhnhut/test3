const Note = ({ iconClassName = '', title, ...props }) => (
    <div className="flex items-center gap-x-2">
        <div {...props} className={`w-[7px] h-[7px] rounded-full ${iconClassName}`}></div>
        <div className="txtSecond-3">{title}</div>
    </div>
);

export default Note;
