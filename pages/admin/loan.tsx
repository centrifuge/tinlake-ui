import * as React from 'react';
import WithTinlake from '../../components/WithTinlake';
import LoanDetail from '../../components/LoanDetail';
import Link from 'next/link';

class LoanPage extends React.Component<{ loanId: string }> {
  static async getInitialProps({ query }: any) {
    return { loanId: query.loanId };
  }

  render() {
    return <div>
      <h1><Link href="/admin"><a>{'<-'}</a></Link>View NFT</h1>

      {this.props.loanId ? (
        <WithTinlake render={tinlake =>
          <LoanDetail tinlake={tinlake} loanId={this.props.loanId} />} />
      ) : (
        'Please provide an ID'
      )}
    </div>;
  }
}

export default LoanPage;