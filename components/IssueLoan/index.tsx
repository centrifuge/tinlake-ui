import * as React from 'react';
import Tinlake from 'tinlake';
import { connect } from 'react-redux';
import Alert from '../Alert';
import { AuthState } from '../../ducks/auth';
import { Box, FormField, TextInput, Button, Heading } from 'grommet';
import SecondaryHeader from '../SecondaryHeader';
import Link from 'next/link';
import { BackLink } from '../BackLink';

interface Props {
  tinlake: Tinlake;
  auth: AuthState;
}

class LoanIssue extends React.Component<Props> {

  render() {
    const { tinlake, auth } = this.props;
    console.log(auth)
    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <BackLink href={'/loans'} />
           <Heading level="3">Issue Loan</Heading>
        </Box>
      </SecondaryHeader>

      <Box pad={{ horizontal: 'medium' }}>
        <Box direction="row" gap="medium" margin={{ bottom: 'medium', top: 'large' }}>
        <Box basis={'1/4'} gap="medium"><FormField label="Collateral NFT ID">
            <TextInput value={"test"} disabled /></FormField></Box>
        <Box basis={'1/4'} gap="medium" />
          { auth.user && auth.user.permissions.canSetCeiling &&
          <Box basis={'1/4'} gap="medium"><FormField label="Principal">
            <TextInput value={"test"} disabled /></FormField>
          </Box> }
          { auth.user && auth.user.permissions.canSetCeiling &&
           <Box basis={'1/4'} gap="medium"><FormField label="Interest Rate">
            <TextInput value={"test"} disabled /></FormField>
          </Box> }
          <Box basis={'1/4'} gap="medium" />
        </Box>
      </Box>
    </Box>;
  }
}

export default connect(state => state)(LoanIssue);
