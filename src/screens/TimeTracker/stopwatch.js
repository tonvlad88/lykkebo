import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { appColors } from "../../utils/constants";

class StopWatch extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      stopTime: null,
      pausedTime: null,
      started: false,
      elapsed: null,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.formatTime = this.formatTime.bind(this);
    const width = props.msecs ? 220 : 150;
    this.defaultStyles = {
      container: {
        backgroundColor: "#000",
        padding: 5,
        borderRadius: 5,
        width: width,
      },
      text: {
        fontSize: 30,
        color: "#ffffff",
        marginLeft: 7,
      },
    };
  }

  componentDidMount() {
    if (this.props.start) {
      this.start();
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.start) {
      this.start();
    } else {
      this.stop();
    }
    if (newProps.reset) {
      this.reset();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  start() {
    const { startTime, inProgress } = this.props;

    if (this.props.laps && this.state.elapsed) {
      const lap = new Date() - this.state.stopTime;
      this.setState({
        stopTime: null,
        pausedTime: this.state.pausedTime + lap,
      });
    }

    // console.log('startTime', startTime);
    // console.log('inProgress', inProgress);

    if (inProgress) {
      this.setState({
        startTime: this.state.elapsed
          ? new Date() - this.state.elapsed
          : new Date(startTime * 1000),
        started: true,
      });
    } else {
      this.setState({
        startTime: this.state.elapsed
          ? new Date() - this.state.elapsed
          : new Date(),
        started: true,
      });
    }

    this.interval = this.interval
      ? this.interval
      : setInterval(() => {
          this.setState({
            elapsed: new Date() - this.state.startTime - this.state.pausedTime,
          });
        }, 1);
  }

  stop() {
    if (this.interval) {
      if (this.props.laps) {
        this.setState({ stopTime: new Date() });
      }

      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({ started: false });
  }

  reset() {
    this.setState({
      elapsed: null,
      startTime: null,
      stopTime: null,
      pausedTime: null,
    });
  }

  formatTime() {
    const now = this.state.elapsed;
    let msecs = now % 1000;

    if (msecs < 10) {
      msecs = `00${msecs}`;
    } else if (msecs < 100) {
      msecs = `0${msecs}`;
    }

    let seconds = Math.floor(now / 1000);
    let minutes = Math.floor(now / 60000);
    const hours = Math.floor(now / 3600000);
    seconds -= minutes * 60;
    minutes -= hours * 60;
    let formatted;
    if (this.props.msecs) {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${
        minutes < 10 ? 0 : ""
      }${minutes}:${seconds < 10 ? 0 : ""}${seconds}:${msecs}`;
    } else {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${
        minutes < 10 ? 0 : ""
      }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
    }

    if (typeof this.props.getTime === "function") {
      this.props.getTime(formatted);
    }

    return formatted;
  }

  render() {
    const styles = this.props.options ? this.props.options : this.defaultStyles;
    const { started } = this.state;

    return (
      <View ref="stopwatch" style={{ backgroundColor: appColors.primary }}>
        <Text
          style={[
            styles.text,
            { color: started ? appColors.lavaRed : appColors.solidWhite },
          ]}
        >
          {this.formatTime()}
        </Text>
      </View>
    );
  }
}

export default StopWatch;
