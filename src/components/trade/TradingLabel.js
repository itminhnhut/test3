import classNames from 'classnames';

const TradingLabel = ({
    useColon = false,
    label = '--',
    value = '--',
    valueLoading,
    containerClassName = '',
}) => {
    return (
        <div className={classNames('font-medium text-sm', containerClassName)}>
            <span className='mr-1 text-txtSecondary dark:text-txtSecondary-dark'>
                {label}
                {useColon && ':'}
            </span>
            <span>{value}</span>
        </div>
    )
}

export default TradingLabel
