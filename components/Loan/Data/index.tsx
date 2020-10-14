import * as React from 'react'
import { Box, Heading, FormField, TextInput, Table, TableBody, TableRow, TableCell } from 'grommet'
import { baseToDisplay, feeToInterestRate } from '@centrifuge/tinlake-js'
import { Loan } from '@centrifuge/tinlake-js-v3'
import NumberInput from '../../NumberInput'
import { addThousandsSeparators } from '../../../utils/addThousandsSeparators'
import { toPrecision } from '../../../utils/toPrecision'

interface Props {
  loan: Loan
}

const dateToYMD = (unix: number) => {
  return new Date(unix * 1000).toLocaleDateString('en-US')
}

class LoanData extends React.Component<Props> {
  render() {
    const { loanId, debt, principal, interestRate, status } = this.props.loan
    return (
      <Box direction="row" gap="large">
        <Box basis="2/3">
          <Box direction="row" gap="medium">
            <FormField label="Asset ID">
              <TextInput value={loanId} disabled />
            </FormField>
            <FormField label="Status">
              <TextInput value={status} disabled />
            </FormField>
          </Box>

          <Box direction="row" gap="medium" margin={{ bottom: 'medium', top: 'large' }}>
            <Box basis={'1/3'} gap="medium">
              <FormField label="Available for Financing">
                <NumberInput value={baseToDisplay(principal, 18)} suffix=" DAI" disabled precision={18} />
              </FormField>
            </Box>
            <Box basis={'1/3'} gap="medium">
              <FormField label="Outstanding">
                <NumberInput value={baseToDisplay(debt, 18)} suffix=" DAI" precision={18} disabled />
              </FormField>
            </Box>
            {this.props.loan.nft && (this.props.loan.nft as any).maturityDate && (
              <Box basis={'1/3'} gap="medium">
                <FormField label="Maturity Date">
                  <TextInput value={dateToYMD((this.props.loan.nft as any).maturityDate)} disabled />
                </FormField>
              </Box>
            )}
          </Box>
        </Box>
        {(this.props.loan as any).riskGroup && (this.props.loan as any).scoreCard && (
          <Box basis="1/3" pad="medium">
            <Box direction="row" margin={{ top: '0', bottom: 'small' }}>
              <Heading level="5" margin={'0'}>
                Score Card
              </Heading>
            </Box>

            <Table margin={{ bottom: 'small' }}>
              <TableBody>
                <TableRow>
                  <TableCell scope="row">Risk group</TableCell>
                  <TableCell style={{ textAlign: 'end' }}>{(this.props.loan as any).riskGroup}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Advance rate</TableCell>
                  <TableCell style={{ textAlign: 'end' }}>
                    {addThousandsSeparators(
                      toPrecision(baseToDisplay((this.props.loan as any).scoreCard.ceilingRatio, 25), 2)
                    )}{' '}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Financing fee</TableCell>
                  <TableCell style={{ textAlign: 'end' }}>
                    {toPrecision(feeToInterestRate(interestRate), 2)} %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell scope="row">Recovery rate</TableCell>
                  <TableCell style={{ textAlign: 'end' }}>
                    {addThousandsSeparators(
                      toPrecision(baseToDisplay((this.props.loan as any).scoreCard.recoveryRatePD, 25), 2)
                    )}{' '}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    )
  }
}

export default LoanData
