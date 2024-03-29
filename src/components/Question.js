import React, { Component } from 'react';
import { string, shape, arrayOf } from 'prop-types';
import { connect } from 'react-redux';
import submitAction from '../redux/actions';
import Alternatives from './Alternatives';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      color: 'all',
      colorIncorret: 'all',
      isDisabled: true,
      // currentTime: 30,
      optionsState: false,
      onClick: false,
    };
    this.changeColor = this.changeColor.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const ONE_SECOND = 1000;
    setInterval(() => this.time(), ONE_SECOND);
    this.setState({
      optionsState: true,
      isDisabled: false,
    });
  }

  onClick() {
    const trinta = 30;
    const { onNext } = this.props;
    onNext();
    this.setState({
      onClick: false, color: 'all', colorIncorret: 'all' });
    const { dispatch } = this.props;
    dispatch(submitAction('TIMER-RESET', trinta));
  }

  time = () => {
    const { currentTime, dispatch } = this.props;
    if (currentTime === 0) {
      this.setState(() => ({
        isDisabled: true,
        onClick: true,
      }));
    }
    if (currentTime >= 1) {
      dispatch(submitAction('TIMER', 1));
    }
  };

  changeColor({ target }) {
    const { dispatch, questionSelect, currentTime } = this.props;
    // const { currentTime } = this.state;
    const values = { um: 1, dois: 2, tres: 3 };
    this.setState({ color: 'correct-color',
      colorIncorret: 'wrong-color',
      onClick: true });
    const responseAnswer = target.name;
    const { difficulty } = questionSelect;
    let valueDifficult = 0;
    if (difficulty === 'easy') valueDifficult = values.um;
    if (difficulty === 'medium') valueDifficult = values.dois;
    if (difficulty === 'hard') valueDifficult = values.tres;
    const dez = 10;
    const count = (dez + (currentTime * valueDifficult));
    if (responseAnswer === 'correct') dispatch(submitAction('SCORE', count));
  }

  render() {
    const { questionSelect, alternatives, correct, currentTime } = this.props;
    const { category, question } = questionSelect;
    const { color, colorIncorret, onClick,
      isDisabled, optionsState } = this.state;

    return (
      <div>
        <h1 data-testid="question-category">{category}</h1>
        <p data-testid="question-text">{question}</p>

        <Alternatives
          optionsState={ optionsState }
          color={ color }
          colorIncorret={ colorIncorret }
          isDisabled={ isDisabled }
          correct={ correct }
          changeColor={ this.changeColor }
          arr={ alternatives }
        />

        <div>{currentTime}</div>
        {
          onClick
        && (
          <button
            className="next-btn"
            data-testid="btn-next"
            onClick={ this.onClick }
            type="button"
          >
            Next
          </button>
        )
        }
      </div>
    );
  }
}

const mapStateToProps = ({ player }) => ({
  score: player.score,
  currentTime: player.currentTime,
});

export default connect(mapStateToProps)(Question);

Question.propTypes = {
  questionSelect: arrayOf(shape),
  category: string,
  question: string,
  correct: string,
  alternatives: arrayOf(string),
}.isRequired;
