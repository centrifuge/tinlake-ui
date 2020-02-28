import * as React from 'react';
import { Box, FormField, Button } from 'grommet';
import NumberInput from '../../../components/NumberInput';
import { Investor, supplyJunior } from '../../../services/tinlake/actions';
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
  supplyAmount: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string | null;
}

class InvestorSupply extends React.Component<Props, State> {

  componentWillMount() {
    const { investor } = this.props;
    this.setState({ supplyAmount: investor && investor.maxSupplyJunior || '0' });
  }

  supplyJunior = async () => {
    try {
      await authTinlake();
      const { supplyAmount } = this.state;
      const { investor, tinlake } = this.props;
      this.setState({ is: 'loading' });

      const res = await supplyJunior(tinlake, supplyAmount);
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
    const { supplyAmount, is } = this.state;
    return <Box basis={'1/4'} gap="medium" margin={{ right: "large" }}>
      <Box gap="medium">
        <FormField label="Supply amount">
          <NumberInput value={baseToDisplay(supplyAmount, 18)} suffix=" DAI" precision={18}
            onValueChange={({ value }) =>
              this.setState({ supplyAmount: displayToBase(value) })}
          />
        </FormField>
      </Box>
      <Box align="start">
        <Button onClick={this.supplyJunior} primary label="Supply" disabled={is === 'loading'} />
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadInvestor })(InvestorSupply);