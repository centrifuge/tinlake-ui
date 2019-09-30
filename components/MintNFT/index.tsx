import * as React from 'react';
import Tinlake from 'tinlake';
import { Box, FormField, TextInput, Button, Heading, Anchor, Text } from 'grommet';
import Alert from '../Alert';
import Link from 'next/link';
import SecondaryHeader from '../SecondaryHeader';
import { LinkPrevious } from 'grommet-icons';
import { authTinlake } from '../../services/tinlake';
import { Spinner } from '@centrifuge/axis-spinner';
import { numberToHex } from 'web3-utils';

interface Props {
  tinlake: Tinlake;
}

interface State {
  tokenId: string;
  referenceId: string;
  amount: string;
  assetType: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string;
}

const SUCCESS_STATUS = '0x1'

class MintNFT extends React.Component<Props, State> {
  state: State = {
    tokenId: this.generateTokenId(),
    referenceId: '',
    amount: '0',
    assetType: '',
    is: null,
    errorMsg: ''
  };

  generateTokenId() {
    let id = '';
    for (let i = 0; i < 32; i = i + 1) {
      id += Math.round(Math.random() * 16);
    }
    return `0x${id}`;
  }

  mint = async () => {
    try {
      await authTinlake();

      const res = await this.props.tinlake.mintNFT(this.props.tinlake.ethConfig.from, this.state.tokenId);
      if (res.status === SUCCESS_STATUS && res.events[0].event.name === 'Transfer') {
        this.setState({ is: 'success' });
      } else {
        this.setState({ is: 'error' });
      }
    } catch (e) {
      console.log(e);
      this.setState({ is: 'error', errorMsg: e.message });
    }
  };

  render() {
    const { is, tokenId, errorMsg } = this.state;

    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <Link href="/borrower">
            <LinkPrevious />
          </Link>
          <Heading level="3">Mint NFT</Heading>
        </Box>

        <Button primary onClick={this.mint} label="Mint NFT"
          disabled={is === 'loading' || is === 'success'} />
      </SecondaryHeader>

      {is === 'loading' ?
        <Spinner height={'calc(100vh - 89px - 84px)'} message={'Minting...'} />
      :
        <Box pad={{ horizontal: 'medium' }}>
          {is === 'success' && <Alert type="success">
            Successfully minted NFT for Token ID {tokenId}. Please make sure to copy your Token ID and
            <Link href={`/admin/whitelist-nft?tokenId=${tokenId}`}>
              <Anchor>proceed to whitelisting.</Anchor></Link></Alert>}
          {is === 'error' && <Alert type="error">
            <Text weight="bold">
              Error minting NFT for Token ID {tokenId}, see console for details</Text>
            {errorMsg && <div><br />{errorMsg}</div>}
          </Alert>}
          <Box direction="row" justify="center" gap="large" margin={{ vertical: 'large' }}>
            <Box basis="1/3" gap="large">
             <FormField label="Token ID">
                <TextInput
                  value={this.state.tokenId}
                  disabled={true}
                />
              </FormField>
            </Box>
          </Box>
        </Box>
      }
    </Box>;
  }
}

export default MintNFT;
