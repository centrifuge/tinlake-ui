import * as React from 'react';
import { connect } from 'react-redux';
import { Box, Heading } from 'grommet';
import SecondaryHeader from '../../components/SecondaryHeader';
import { PoolState, loadPool } from '../../ducks/pool';
import { LoansState, loadLoans } from '../../ducks/loans';
import { AuthState } from '../../ducks/auth';
import { Spinner } from '@centrifuge/axis-spinner';
import LoanListData from  '../../components/Loan/List';
import Tinlake from 'tinlake/dist/Tinlake';
import { Pool } from '../../config';

interface Props {
  tinlake: any;
  loans?: LoansState;
  loadLoans?: (tinlake: Tinlake) => Promise<void>;
  pool?: PoolState;
  auth?: AuthState;
  loadPool?: (tinlake: Tinlake) => Promise<void>;
  selectedPool: Pool
}

class Overview extends React.Component<Props> {

  componentDidMount() {
    const { loadLoans, loadPool, tinlake, selectedPool} = this.props;
    console.log(selectedPool);
    loadLoans && loadLoans(tinlake);
    loadPool && loadPool(tinlake);

  }

  render() {
    const { tinlake, loans, auth, selectedPool } = this.props;
    const userAddress = auth && auth.user && auth.user.address || tinlake.ethConfig.from;

    const { name } = selectedPool;

    return <Box >
      <SecondaryHeader>
          <Heading level="3">Pool Overview: {name} </Heading>
      </SecondaryHeader>

      <Box direction="row">
        <Box basis={"1/2"}>

        { (loans!.loansState !== 'loading') && 
          <Box>
               <Heading level="5">Loans</Heading>
          </Box>
        }




        </Box>
      </Box>


      { (loans!.loansState === 'loading') ?
        <Spinner height={'calc(100vh - 89px - 84px)'} message={'Loading...'} />  :
        <LoanListData loans={loans!.loans} userAddress={userAddress}> </LoanListData>
      }
      <Box pad={{ vertical: 'medium' }}>
      </Box>
    </Box>;
  }
}

export default connect(state => state, { loadLoans, loadPool })(Overview);
