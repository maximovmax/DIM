import * as React from 'react';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { getActiveAccountStream } from '../accounts/platform.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';

interface State {
  account?: DestinyAccount;
  enabled: boolean;
}

export default class ActivityMonitor extends React.Component<{}, State> {
  private accountSubscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      enabled: false
    };
  }

  componentDidMount() {
    this.accountSubscription = getActiveAccountStream().subscribe((account) => {
      this.setState({
        account: account || undefined
      });
    });
  }

  componentWillUnmount() {
    this.accountSubscription.unsubscribe();
  }

  render() {
    return (
      <div className="activity-monitor">
        <h2>Activity Monitor</h2>
        <div>{(this.state.account) ? this.state.account.displayName : ''} is not playing Destiny.</div>
      </div>
    );
  }
}
