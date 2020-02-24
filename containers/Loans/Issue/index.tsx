import * as React from 'react';
import { connect } from 'react-redux';
import { AuthState } from '../../../ducks/auth';
import { Box, FormField, TextInput, Button, Heading } from 'grommet';

interface Props {
  tinlake: Tinlake;
  auth: AuthState;
}

// pass loan pro

class LoanIssue extends React.Component<Props> {

  render() {
    const { tinlake, auth } = this.props;
    return <Box>
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
