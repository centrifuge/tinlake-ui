import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Investor, redeemJunior } from '../../../services/tinlake/actions';
import { baseToDisplay, displayToBase } from 'tinlake';
import { loadInvestor } from '../../../ducks/investments';
import { connect } from 'react-redux';
import { authTinlake } from '../../../services/tinlake';

interface Props {
  investor: Investor;
  tinlake: Tinlake;
  loadInvestor?: (tinlake: Tinlake, address: string, refresh?: boolean) => Promise<void>;
}

interface State {
  redeemAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class InvestorRedeem extends React.Component<Props, State> {

  componentWillMount() {
    const { investor } = this.props;
    this.setState({ redeemAmount: (investor && investor.maxRedeemJunior || '0') });
  }

  redeemJunior = async () => {
    try {
      await authTinlake();
      const { redeemAmount } = this.state;
      const { investor, tinlake } = this.props;
      this.setState({ is: 'loading' });

      const res = await redeemJunior(tinlake, redeemAmount);
      if (res && res.errorMs) {
        this.setState({ is: 'error' });
        return;
      }
      this.setState({ is: 'success' });
      this.props.loadInvestor && this.props.loadInvestor(tinlake, investor.address);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { redeemAmount, is } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Redeem amount">
          <NumberInput value={baseToDisplay(redeemAmount, 18)} suffix=" TIN" precision={18}
            onValueChange={({ value }) =>
              this.setState({ redeemAmount: displayToBase(value) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.redeemJunior} primary label="Redeem" disabled={is === 'loading'} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor })(InvestorRedeem);