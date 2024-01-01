import classNames from "classnames";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import "./App.scss";
import Domino from "./components/Domino";
import InstructionsModal from "./components/InstructionsModal";
import GameOverModal from "./components/GameOverModal";
import { HORIZONTAL_CLASSES, NUM_DOMINOES, MIDDLE_ROW_MAX } from "./consts";
import {
  getClassNameForRow1,
  getClassNameForRow2,
  getClassNameForRow3,
  getClassNameForRow4,
  getClassNameForRow5,
} from "./util";
import { useSelector, useDispatch } from "react-redux";
import { modifyDominoVals, resetVals } from "./store/valsSlice";
import { modifyComputerHand } from "./store/computerSlice";
import { modifyHand } from "./store/handSlice";

const passButtonStyle = {
  "margin-left": "40px",
  "margin-top": "auto",
  "margin-bottom": "auto",
  color: "#00e0ff",
  height: "47px",
  "border-color": "#00e0ff",
  "font-size": 20,
};

const resetButtonStyle = {
  position: "absolute",
  top: 5,
  left: 5,
  "text-transform": "capitalize",
  color: "#00e0ff",
  "font-size": 20,
  "border-color": "#00e0ff",
};

function App() {
  const [playedCards, setPlayedCards] = useState([]);
  const [hoveredDomino, setHoveredDomino] = useState(null);
  const [keyToClassNames, setKeyToClassNames] = useState({
    1: "domino-vertical",
  });
  const [isComputersTurn, setIsComputersTurn] = useState(false);
  const [middleBounds, setMiddleBounds] = useState(null);
  const [startNewGame, setStartNewGame] = useState(true);
  const [flippedComputerDomino, setFlippedComputerDomino] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const dispatch = useDispatch();
  const keyToVals = useSelector((state) => state.vals.vals);
  const hand = useSelector((state) => state.hand.hand);
  const computerHand = useSelector((state) => state.computerHand.computerHand);
  const [playingFirstDomino, setPlayingFirstDomino] = useState(false); 

  const checkIfGameOver = () => {
    if (hand.length === 0 || computerHand.length === 0) {
      return true;
    } else {
      const computerMoves = getMoveFromHand(computerHand);
      const playerMoves = getMoveFromHand(hand);
      if (!computerMoves && !playerMoves) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    if (!startNewGame) {
      if (checkIfGameOver()) {
        setIsGameOver(true);
      }
    }
  }, [computerHand, hand]);

  useEffect(() => {
    if (startNewGame) {
      setUpGame();
    }
  }, [startNewGame]);

  const setUpGame = () => {
    const hand1 = [];
    const hand2 = [];
    setStartNewGame(true);
    setPlayedCards([])

    dispatch(resetVals());
    setIsComputersTurn(false);
    setIsGameOver(false);
    setMiddleBounds(null);
    setKeyToClassNames({ 1: "domino-vertical" });

    while (hand1.length < NUM_DOMINOES / 2) {
      const random = Math.random();
      const num = Math.ceil(random * NUM_DOMINOES);
      if (!hand1.includes(num)) {
        
          hand1.push(num);
        }
      }
    
    for (let i = 1; i <= NUM_DOMINOES; i++) {
      if (!hand1.includes(i)) {
        hand2.push(i);
      }
    }

    dispatch(modifyComputerHand(hand1));
    dispatch(modifyHand(hand2));

    setTimeout(() =>{
      setPlayedCards([1]);
      if(hand1.includes(1)){
        const newHand1 = Array.from(hand1)
        newHand1.splice(newHand1.indexOf(1), 1)
        dispatch(modifyComputerHand(newHand1));

      } else {
        const newHand2 = Array.from(hand2)
        newHand2.splice(newHand2.indexOf(1), 1)
        dispatch(modifyHand(newHand2));
        setIsComputersTurn(true)
      }
      setStartNewGame(false);

    }, 1000)

  };

  useEffect(() => {
    if (isComputersTurn) {
      handleComputerStep();
    }
  }, [isComputersTurn]);

  const handleOnMouseOver = (e) => {
    if (!e.target) return;
    const hoveredDominoKey = parseInt(e.target.getAttribute("dominoKey"));
    if (
      playedCards[0] === hoveredDominoKey ||
      playedCards[playedCards.length - 1] === hoveredDominoKey
    )
      setHoveredDomino(hoveredDominoKey);
  };

  const getMoveFromHand = (dominoHand) => {
    let result;
    if (dominoHand.length === 0) return;
    for (let i = 0; i < dominoHand.length; i++) {
      if (result) break;
      const vals = keyToVals[dominoHand[i]];
      if (!vals) break;
      for (let j = 0; j < playedCards.length; j++) {
        const playedCardNums = keyToVals[playedCards[j]];
        if (!playedCardNums) break;
        for (let k = 0; k < vals.length; k++) {
          if (result) break;
          for (let m = 0; m < playedCardNums.length; m++) {
            if (vals[k] === playedCardNums[m]) {
              setHoveredDomino(playedCards[j]);
              result = [dominoHand[i], playedCards[j]];
              break;
            }
          }
        }
      }
    }
    return result;
  };

  const handleComputerStep = () => {
    if (checkIfGameOver()) return;
    let matchingDominos = getMoveFromHand(computerHand);
    if (matchingDominos) setFlippedComputerDomino(matchingDominos[0]);
    setTimeout(() => {
      if (matchingDominos) {
        tryPlayDomino(matchingDominos[0], matchingDominos[1], true);
      }
      setIsComputersTurn(false);
    }, 1000);
  };

  const handleStop = (num) => {
    if (isComputersTurn) return;
    const madePlay = tryPlayDomino(num, hoveredDomino, false);

    if (madePlay) setIsComputersTurn(true);
  };

  const tryPlayDomino = (dominoKey, playedCardKey, isComputer) => {
    const dominoVals = Array.from(keyToVals[dominoKey]);
    const hoveredDominoVals = Array.from(keyToVals[playedCardKey]);
    if (playedCardKey === null) return;
    let matchVal;
    let hoverValsIdx;
    let dominoValsIdx;
    for (let i = 0; i < hoveredDominoVals.length; i++) {
      for (let j = 0; j < dominoVals.length; j++) {
        if (hoveredDominoVals[i] === dominoVals[j]) {
          matchVal = hoveredDominoVals[i];
          hoverValsIdx = i;
          dominoValsIdx = j;
        }
      }
    }
    if (matchVal === undefined) return false;

    const newHand = isComputer ? Array.from(computerHand) : Array.from(hand);
    const idx = newHand.indexOf(dominoKey);
    newHand.splice(idx, 1);
    if (isComputer) {
      dispatch(modifyComputerHand(newHand));
    } else {
      dispatch(modifyHand(newHand));
    }

    let otherVal;
    if (dominoVals[0] === dominoVals[1]) {
      otherVal = matchVal;
    } else if (dominoVals[0] === matchVal) {
      otherVal = dominoVals[1];
    } else {
      otherVal = dominoVals[0];
    }

    if (playedCards.length === MIDDLE_ROW_MAX) {
      setMiddleBounds([playedCards[0], playedCards[MIDDLE_ROW_MAX - 1]]);
    }

    const playedCardsIdx = playedCards.indexOf(playedCardKey);
    if (playedCardsIdx === 0) {
      let className;
      if (playedCards.length >= MIDDLE_ROW_MAX) {
        if (middleBounds && playedCards.indexOf(middleBounds[0]) >= 3) {
          className = getClassNameForRow1(matchVal, otherVal);
        } else {
          className = getClassNameForRow2(matchVal, otherVal);
        }
      } else {
        className = getClassNameForRow3(matchVal, otherVal, false);
      }
      setKeyToClassNames({ [dominoKey]: className, ...keyToClassNames });
      setPlayedCards([dominoKey, ...playedCards]);
    } else {
      let className;
      if (playedCards.length >= MIDDLE_ROW_MAX) {
        if (
          middleBounds &&
          playedCards.indexOf(middleBounds[1]) < playedCards.length - 3
        ) {
          className = getClassNameForRow5(matchVal, otherVal);
        } else {
          className = getClassNameForRow4(matchVal, otherVal);
        }
      } else {
        className = getClassNameForRow3(matchVal, otherVal, true);
      }
      setKeyToClassNames({ [dominoKey]: className, ...keyToClassNames });
      setPlayedCards(playedCards.concat(dominoKey));
    }

    hoveredDominoVals.splice(hoverValsIdx, 1);
    dominoVals.splice(dominoValsIdx, 1);

    const newKeyToVals = { ...keyToVals };
    newKeyToVals[dominoKey] = dominoVals;

    newKeyToVals[playedCardKey] = hoveredDominoVals;
    dispatch(modifyDominoVals(newKeyToVals));
    return true;
  };

  let row1 = [];
  let row2 = [];
  let row3 = [];
  let row4 = [];
  let row5 = [];
  if (playedCards.length <= MIDDLE_ROW_MAX) {
    row3 = playedCards;
  } else {
    let sawFirstBound;
    let sawSecondBound;
    for (let i = 0; i < playedCards.length; i++) {
      if (!sawFirstBound && playedCards[i] === middleBounds[0])
        sawFirstBound = true;

      if (sawSecondBound) {
        row4.push(playedCards[i]);
      } else if (sawFirstBound) {
        row3.push(playedCards[i]);
      } else {
        row2.push(playedCards[i]);
      }
      if (!sawSecondBound && playedCards[i] === middleBounds[1])
        sawSecondBound = true;
    }
  }
  if (row2.length > 3) {
    row1 = row2.splice(0, row2.length - 3);
  }
  if (row4.length > 3) {
    row5 = row4.splice(3);
  }

  let gameOverText = "";
  if (computerHand.length > hand.length) {
    gameOverText = "Player Wins";
  } else if (hand.length > computerHand.length) {
    gameOverText = "Computer Wins";
  } else {
    gameOverText = "It's a tie";
  }

  return (
    <div className="App">
      <InstructionsModal />
      {isGameOver ? <GameOverModal text={gameOverText} /> : ""}
      <div className="hand slight-vertical-margin computerHand">
        {computerHand.map((num) => {
          return (
            <Domino
              dominoKey={num}
              vals={keyToVals[num]}
              className="domino-vertical"
              isOnBoard={false}
              isComputer={true}
              isFaceUp={isGameOver || num === flippedComputerDomino}
              isMovingToBoard={num === flippedComputerDomino}
            />
          );
        })}
      </div>
      <div className="board">
        <div className="played-cards">
          <div className="row-1">
            {row1.map((num, idx) => {
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";
              let className = keyToClassNames[num];
              if (
                idx === row1.length - 1 &&
                !HORIZONTAL_CLASSES.has(className)
              ) {
                className = "domino-left-high";
              }
              const marginClass = HORIZONTAL_CLASSES.has(className)
                ? "middle-row-horizontal-margin"
                : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(className, hoverClass, marginClass)}
                  vals={keyToVals[num]}
                  isOnBoard={true}
                  onMouseOver={handleOnMouseOver}
                  idx={idx}
                />
              );
            })}
          </div>
          <div className="row-2">
            {row2.map((num, idx) => {
              let className = keyToClassNames[num];
              if (
                idx === row1.length - 1 &&
                HORIZONTAL_CLASSES.has(className)
              ) {
                className = "domino-vertical";
              }
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";

              const lower =
                idx === row2.length - 1 &&
                HORIZONTAL_CLASSES.has(keyToClassNames[row3[0]])
                  ? "lower"
                  : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(className, hoverClass, lower)}
                  vals={keyToVals[num]}
                  isOnBoard={true}
                  onMouseOver={handleOnMouseOver}
                  idx={idx}
                />
              );
            })}
          </div>
          <div className="hand">
            {row3.map((num, idx) => {
              const className = keyToClassNames[num];
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";

              const marginClass = HORIZONTAL_CLASSES.has(className)
                ? "middle-row-horizontal-margin"
                : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(className, hoverClass, marginClass)}
                  vals={keyToVals[num]}
                  isOnBoard={true}
                  onMouseOver={handleOnMouseOver}
                  idx={idx}
                />
              );
            })}
          </div>
          <div className="bottom-domino-row">
            <div className="row-4">
              {row4.map((num, idx) => {
                const hoverClass = hoveredDomino === num ? "domino-hover" : "";
                let className = keyToClassNames[num];
                if (idx === 0 && HORIZONTAL_CLASSES.has(className)) {
                  className = "domino-vertical";
                }
                const horizontalOnVerticalBranch = HORIZONTAL_CLASSES.has(
                  className
                )
                  ? "horizontal-on-vertical-branch"
                  : "";
                const higher =
                  idx === 0 &&
                  HORIZONTAL_CLASSES.has(keyToClassNames[row3[row3.length - 1]])
                    ? "higher"
                    : "";

                return (
                  <Domino
                    dominoKey={num}
                    className={classNames(
                      className,
                      horizontalOnVerticalBranch,
                      higher,
                      hoverClass
                    )}
                    vals={keyToVals[num]}
                    isOnBoard={true}
                    onMouseOver={handleOnMouseOver}
                    idx={idx}
                  />
                );
              })}
            </div>
            <div class="row-5">
              {row5.map((num, idx) => {
                const hoverClass = hoveredDomino === num ? "domino-hover" : "";
                let className = keyToClassNames[num];
                if (idx === 0 && !HORIZONTAL_CLASSES.has(className)) {
                  className = "domino-left-high";
                }
                const higher =
                  idx === 0 &&
                  HORIZONTAL_CLASSES.has(keyToClassNames[row2[row2.length - 1]])
                    ? "higher"
                    : "";

                const marginClass = HORIZONTAL_CLASSES.has(className)
                  ? "middle-row-horizontal-margin"
                  : "";

                return (
                  <Domino
                    dominoKey={num}
                    className={classNames(
                      className,
                      higher,
                      hoverClass,
                      marginClass
                    )}
                    vals={keyToVals[num]}
                    isOnBoard={true}
                    onMouseOver={handleOnMouseOver}
                    idx={idx}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="hand slight-vertical-margin">
        {hand.map((num) => {
          return (
            <Domino
              dominoKey={num}
              vals={keyToVals[num]}
              className="domino-vertical"
              onStop={(e) => handleStop(num)}
              isOnBoard={false}
              isComputersTurn={isComputersTurn}
            />
          );
        })}
        <Button
          variant="outlined"
          color="info"
          size="medium"
          sx={passButtonStyle}
          onClick={handleComputerStep}
          disabled={isGameOver}
        >
          Pass
        </Button>
      </div>
      <Button
        variant="outlined"
        disabled={startNewGame}
        sx={resetButtonStyle}
        onClick={setUpGame}
      >
        New Game
      </Button>
    </div>
  );
}

export default App;
