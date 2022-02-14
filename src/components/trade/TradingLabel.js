const TradingLabel = (
    label = '--',
    value = '--',
    valueLoading,
    useColon = false
) => {
    return (
        <div>
            <span>
                {label}
                {useColon && ': '}
            </span>
            <span>{value}</span>
        </div>
    )
}

export default TradingLabel
