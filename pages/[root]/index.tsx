import { Box } from 'grommet';
import * as React from 'react';
import Header from '../../components/Header';
import Overview from '../../containers/Overview';
import WithTinlake from '../../components/WithTinlake';
import { menuItems } from '../../menuItems';
import config from '../../config';
import { useRouter } from 'next/router';

const pools = config.pools;

interface Props {
  root: string;
}

class Pool extends React.Component <Props> {

  render() {
    const { root } = useRouter().query;

    const selectedPool = pools.find(pool => pool.addresses.ROOT_CONTRACT === root);

    if (!selectedPool) {
      return <div>404 - Not found</div>;
    }

    return (
      <Box align="center" pad={{ horizontal: 'small' }}>
        <Header selectedRoute={'/'} menuItems={menuItems} />
        { selectedPool &&
          <Box justify="center" direction="row">
            <Box width="xlarge">
              <WithTinlake render={tinlake => <Overview tinlake={tinlake} selectedPool={selectedPool}  />} />
            </Box>
          </Box>
        }
      </Box>
    );
  }
}

export default Pool;
