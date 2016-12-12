import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import BuildStatusDescription from '../../shared/BuildStatusDescription';
import Duration from '../../shared/Duration';
import Emojify from '../../shared/Emojify';
import Media from '../../shared/Media';
import UserAvatar from '../../shared/UserAvatar';

import { buildTime } from '../../../lib/builds';
import { shortMessage, shortCommit } from '../../../lib/commits';

class BuildTooltip extends React.Component {
  static propTypes = {
    build: React.PropTypes.shape({
      commit: React.PropTypes.string,
      createdBy: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        avatar: React.PropTypes.shape({
          url: React.PropTypes.string
        }).isRequired
      }),
      message: React.PropTypes.string,
      startedAt: React.PropTypes.string,
      finishedAt: React.PropTypes.string
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Media align="top" className="mx2 my1">
        <Media.Image className="mr2 center" style={{ width: 30 }} >
          <UserAvatar user={this.props.build.createdBy} className="block fit" />
          <small className="dark-gray">
            <Duration.Micro {...buildTime(this.props.build)} tabularNumerals={false} />
          </small>
        </Media.Image>
        <Media.Description className="flex-auto line-height-2">
          <span className="block line-height-3 overflow-hidden overflow-ellipsis">
            <Emojify className="semi-bold" text={shortMessage(this.props.build.message)} /> <span className="dark-gray">{shortCommit(this.props.build.commit)}</span>
          </span>
          <small className="dark-gray">
            <BuildStatusDescription build={this.props.build} updateFrequency={0} />
          </small>
        </Media.Description>
      </Media>
    );
  }
}

export default Relay.createContainer(BuildTooltip, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        message
        url
        commit
        state
        startedAt
        finishedAt
        canceledAt
        scheduledAt
        createdBy {
          ... on User {
            name
            avatar {
              url
            }
          }
          ...on UnregisteredUser {
            name
            avatar {
              url
            }
          }
        }
      }
    `
  }
});
