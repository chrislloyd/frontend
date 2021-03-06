import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { second } from 'metrick/duration';
import { getDurationString } from '../../lib/date';

class Duration extends React.Component {
  static propTypes = {
    from: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Date)
    ]),
    to: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Date)
    ]),
    className: React.PropTypes.string,
    tabularNumerals: React.PropTypes.bool.isRequired,
    format: React.PropTypes.oneOf(getDurationString.formats),
    overrides: React.PropTypes.object,
    updateFrequency: React.PropTypes.number
  };

  static defaultProps = {
    updateFrequency: 1::second,
    tabularNumerals: true
  };

  state = {
    value: ''
  };

  updateTime() {
    const { from, to, format, overrides } = this.props;

    this.setState({
      value: getDurationString(from, to, format, overrides)
    });
  }

  componentDidMount() {
    this.maybeSetInterval(this.props.updateFrequency);
  }

  maybeSetInterval(updateFrequency) {
    if (updateFrequency > 0) {
      this._interval = setInterval(() => this.updateTime(), updateFrequency);
    }
    this.updateTime();
  }

  maybeClearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  componentWillUnmount() {
    this.maybeClearInterval();
  }

  componentWillReceiveProps(nextProps) {
    const { from, to, format, overrides, updateFrequency } = nextProps;

    if (updateFrequency !== this.props.updateFrequency) {
      this.maybeClearInterval();
      this.maybeSetInterval(updateFrequency);
    }

    this.setState({
      value: getDurationString(from, to, format, overrides)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { state: { value }, props: { className, tabularNumerals } } = this;
    const spanClassName = classNames(
      className,
      { 'tabular-numerals': tabularNumerals }
    );

    return (
      <span className={spanClassName}>
        {value}
      </span>
    );
  }
}

const exported = {};

getDurationString.formats.forEach((format) => {
  const componentName = format.charAt(0).toUpperCase() + format.slice(1);

  const component = (props) => <Duration {...props} format={format} />;
  component.displayName = `Duration.${componentName}`;

  exported[componentName] = component;
});

export default exported;
