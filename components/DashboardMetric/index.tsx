import { FunctionComponent } from 'react';
import { Text, Box, Heading } from 'grommet';

interface Props {
  label: string;
}

const DashboardMetric: FunctionComponent<Props> = ({ label, children }) => {
  return <Box
    pad="medium"
    background="white"
    elevation="small"
    gap="xsmall"
    margin="small"
  >
    <Heading truncate={true} level="4" textAlign="center" margin="none" style={{ lineHeight: '40px', textOverflow: 'clip' }}>
      {children}</Heading>
    <Text textAlign="center">{label}</Text>
  </Box>;
};

export default DashboardMetric;
