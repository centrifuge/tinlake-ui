import * as React from 'react';
import Tinlake, { baseToDisplay, displayToBase, interestRateToFee } from 'tinlake';
import { Box, FormField, TextInput, Button, Heading, Text } from 'grommet';
import Alert from '../../../components/Alert';
import NftData from '../../../components/NftData';
import { getNFT, NFT } from '../../../services/nft'
import { Spinner } from '@centrifuge/axis-spinner';

interface Props {
  tinlake: Tinlake;
  tokenId: string;
}

interface State {
  nft: NFT | null;
  nftError: string;
  tokenId: string;
  loanId: string
  errorMsg: string;
  is: null;
}

class IssueLoan extends React.Component<Props, State> {

  // handlers
  onTokenIdValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTokenId = event.currentTarget.value
    await this.setState({
      tokenId: currentTokenId,
      nft: null,
      nftError: ''
    })
    await this.getNFT(currentTokenId)
  }

  getNFT = async (currentTokenId: string) => {
    const { tinlake } = this.props;
    if (currentTokenId && currentTokenId.length > 0) {
      const result = await getNFT(tinlake, currentTokenId);
      const { tokenId, nft, errorMessage } = result as Partial<{ tokenId: string, nft: NFT, errorMessage: string }>
      if (tokenId !== this.state.tokenId) {
        return;
      }
      if (errorMessage) {
        this.setState({ nftError: errorMessage });
        return;
      }
      nft && this.setState({ nft })
    }
  }

  issueLoan = async () => {
    // const { tinlake } = this.props;
    // const { tokenId, principal, appraisal, interestRate } = this.state;
    // const addresses = tinlake.contractAddresses;
    // if (principal === '0') {
    //   this.setState({ is: 'error', errorMsg: 'Principal cannot be 0' });
    //   // needs to be implemented on the contract level first
    // } /*else if (principal > appraisal) {
    //   this.setState({ is: 'error', errorMsg: 'Principal can not be heigher then appraisal'  });
    // }*/
    // else {
    //   this.setState({ is: 'loading' });
    //   try {
    //     await authTinlake();
    //     // init fee
    //     const fee = interestRateToFee(interestRate);
    //     const feeExists = await tinlake.existsFee(fee);
    //     if (!feeExists) {
    //       const res = await tinlake.initFee(fee);
    //       if (res.status !== SUCCESS_STATUS) {
    //         this.setState({ is: 'error', errorMsg: JSON.stringify(res) });
    //         return;
    //       }
    //     }
    //     // admit
    //     const nftOwner = await tinlake.ownerOfNFT(tokenId);
    //     const res2 = await tinlake.whitelist(addresses['NFT_COLLATERAL'], tokenId, principal, appraisal, fee, nftOwner);
    //     if (res2.status !== SUCCESS_STATUS || res2.events[0].event.name !== 'Transfer') {
    //       this.setState({ is: 'error', errorMsg: JSON.stringify(res2) });
    //       return;
    //     }

    //     const loanId = res2.events[0].data[2].toString();
    //     this.setState({ is: 'success' });
    //   } catch (e) {
    //     console.log(e);
    //     this.setState({ is: 'error', errorMsg: e.message });
    //   }
    // }
  }

  componentWillMount() {
    const { tokenId } = this.props;
    this.setState({ tokenId: tokenId || '' }, () => {
      if (tokenId) { this.getNFT(tokenId); }
    });

  }

  render() {
    const { tokenId, is, nft, errorMsg, nftError } = this.state;
    const { tinlake } = this.props;

    {
      is === 'loading' ?
      <Spinner height={'calc(100vh - 89px - 84px)'} message={'Initiating the whitelisting process. Please confirm the pending transactions in MetaMask, and do not leave this page until all transactions have been confirmed.'} />
      :
      <Box pad={{ horizontal: 'medium' }}>
        {is === 'success' && <Alert type="success">
          Successfully created loan for Token ID {tokenId}</Alert>}
        {is === 'error' && <Alert type="error">
          <Text weight="bold">
            Error creating loan Token ID {tokenId}, see console for details</Text>
          {errorMsg && <div><br />{errorMsg}</div>}
        </Alert>
        }
        {/* {is !== 'success' &&
          <Box direction="row" gap="medium" margin={{ top: 'medium' }}>
            <b>Please paste your NFT ID below and set the loan parameters:</b>
          </Box>
        } */}
      </Box>

      return <Box pad={{ horizontal: 'medium' }} >
        <Box direction="row">
          <Text weight="bold">Please paste your NFT ID below to open a new loan</Text>
        </Box>
        <Box direction="row" gap="medium" margin={{ bottom: 'medium', top: 'large' }}>
          <Box basis={'1/4'} gap="medium">
            <FormField label="Token ID">
              <TextInput
                value={tokenId}
                onChange={this.onTokenIdValueChange}
                disabled={is === 'success'}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'} gap="medium" align="center">
            <Button onClick={this.issueLoan} primary label="Open loan" disabled={is === 'loading' || is === 'success' || !nft} />
          </Box>
        </Box>

        {nftError && <Alert type="error" margin={{ vertical: 'large' }}>
         { nftError } </Alert>}
         {nft &&
          <NftData data={nft} authedAddr={tinlake.ethConfig.from} />}
      </Box>
    }
     
    }
  }
  

  export default IssueLoan;


