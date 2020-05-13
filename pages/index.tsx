import { Box } from 'grommet';
import Header from '../components/Header';
import Overview from '../containers/Overview';
import WithTinlake from '../components/WithTinlake';
import { menuItems } from '../menuItems';

// TODO: refactor pass through path
import config from './../config';
const { pools } = config;

function Home() {
  return <Box align="center" pad={{ horizontal: 'small' }}>
  <Header
    selectedRoute={'/'}
    menuItems={menuItems}
  />
  <Box
    justify="center"
    direction="row"
  >
    <Box width="xlarge" >
      <WithTinlake render={tinlake =>
        <Overview tinlake={tinlake} selectedPool={pools[0]}/>
      }/>
    </Box>
  </Box>
</Box>;
}

export default Home;
