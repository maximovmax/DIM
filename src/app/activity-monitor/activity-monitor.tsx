import * as React from 'react';
import { DestinyAccount } from '../accounts/destiny-account.service';
import { getActiveAccountStream } from '../accounts/platform.service';
import { Subscription } from 'rxjs/Subscription';
import { getActivities$ } from './activity-monitor.service';

interface State {
  account?: DestinyAccount;
  activity?: any;
}

export default class ActivityMonitor extends React.Component<{}, State> {
  private accountSubscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      account: undefined,
      activity: undefined
    };
  }

  componentDidMount() {
    this.accountSubscription = getActiveAccountStream().subscribe((account) => {
      this.setState({
        account: account || undefined
      });

      if (account) {
        getActivities$(account).then((result) => {
          console.log(result);

          this.setState({
            activity: result || undefined
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.accountSubscription.unsubscribe();
  }

  render() {
    return (
      <div className="activity-monitor">
        <h2>Activity Monitor</h2>
        <h3>{(this.state.account) ? this.state.account.displayName : ''}</h3>
        <h4>{(this.state.activity) ? this.state.activity.place.displayProperties.name : 'Offline'}</h4>
        <h4>{(this.state.activity) ? this.state.activity.destination.displayProperties.name : 'Offline'}</h4>
        <h4>{(this.state.activity) ? this.state.activity.activity.displayProperties.name : 'Offline'}</h4>
        <h4>{(this.state.activity && this.state.activity.activityMode) ? this.state.activity.activityMode.displayProperties.name : 'Offline'}</h4>
        <h4>{(this.state.activity && this.state.activity.activityType) ? this.state.activity.activityType.displayProperties.name : 'Offline'}</h4>
      </div>
    );
  }
}
