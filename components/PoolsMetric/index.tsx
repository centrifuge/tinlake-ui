import { FunctionComponent, default as React } from 'react';
import { Box, Text } from 'grommet';

interface MetricProps {
  label: string;
}

const PoolsMetric: FunctionComponent<MetricProps> = ({ label, children }) => {
  return <Box
    background="white"
    elevation="small"
    gap="xsmall"
    pad="small"
    margin={{ top: 'large' }}
  >
    <Box style={{margin:"auto"}}>
    <Text textAlign="center" truncate={true} style={{ fontSize: '1.7em', lineHeight: '40px', textOverflow: 'clip' }}>
      {children}</Text>
      <Box pad={{top:"small"}}>
      <Text textAlign="center" >{label}</Text>
      </Box>

    </Box>
  </Box>;
};

export default PoolsMetric;
