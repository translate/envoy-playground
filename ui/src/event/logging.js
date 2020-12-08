
import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import EventsLogo from '../app/images/events.svg';
import {PlaygroundLazyLog} from '../shared/logs';
import {PlaygroundSection} from '../shared/section';
import {connect} from '../app/store';


export class BaseEventLogging extends React.PureComponent {
    static propTypes = exact({
        dispatch: PropTypes.func.isRequired,
        events: PropTypes.array.isRequired,
    });

    render () {
        const {events} = this.props;
        return (
            <PlaygroundSection
              title='Events'
              icon={EventsLogo}>
              <PlaygroundLazyLog
                searchEnabled
                lineEnding={'\n'}
                extraLines={0}
                logs={events}/>
            </PlaygroundSection>);
    }
}


export const mapStateToProps = (state) => {
    return {
        events: state.event.value,
    };
};

export default connect(mapStateToProps)(BaseEventLogging);
