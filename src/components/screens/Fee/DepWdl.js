import withTabLayout, { ROUTES } from 'components/common/layouts/withTabLayout'

const DepWdl = () => {
    return (
        <div>Deposit and Withdraw</div>
    )
}

export default withTabLayout({ routes: ROUTES.FEE_STRUCTURE })(DepWdl)
