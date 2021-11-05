import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import MarketTrend from 'version/maldives/m1/Market/MarketTrend'
import MarketTable from 'version/maldives/m1/Market/MarketTable'

const MarketIndex = () => {
    return (
        <MaldivesLayout>
            <div className="mal-container">
                <MarketTrend/>
                <MarketTable/>
            </div>
        </MaldivesLayout>
    )
}

export default MarketIndex
