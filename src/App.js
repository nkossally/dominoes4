import classNames from "classnames";
import { useState, useEffect, useCallback, useReducer } from "react";
import { Button } from "@mui/material";
import "./App.scss";
import Domino from "./components/Domino";
import InstructionsModal from "./components/InstructionsModal";
import GameOverModal from "./components/GameOverModal";
import {
  DOMINO_KEYS_TO_VALS,
  HORIZONTAL_CLASSES,
  NUM_DOMINOES,
  MIDDLE_ROW_MAX,
} from "./consts";
import {
  getClassNameForRow1,
  getClassNameForRow2,
  getClassNameForRow3,
  getClassNameForRow4,
  getClassNameForRow5,
} from "./util";

const passButtonStyle = {
  "margin-top": "15px",
  color: "#00e0ff",
  "border-color": "#00e0ff",
};

function App() {
  const [computerHand, setComputerHand] = useState([]);
  const [hand, setHand] = useState([]);
  const [playedCards, setPlayedCards] = useState([1]);
  const [hoveredDomino, setHoveredDomino] = useState(null);
  const [keyToVals, setKeyToVals] = useState(DOMINO_KEYS_TO_VALS);
  const [keyToClassNames, setKeyToClassNames] = useState({
    1: "domino-vertical",
  });
  const [isComputersTurn, setIsComputersTurn] = useState(false);
  const [middleBounds, setMiddleBounds] = useState(null);
  const [startNewGame, setStartNewGame] = useState(true);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [flippedComputerDomino, setFlippedComputerDomino] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (startNewGame) {
      setUpGame();
    }
    setStartNewGame(false);
  }, [startNewGame]);

  const setUpGame = () => {
    const hand1 = [];
    const hand2 = [];
    let additionalCount = 0;
    setKeyToVals(DOMINO_KEYS_TO_VALS);
    setIsComputersTurn(false);
    setMiddleBounds(null);
    setKeyToClassNames({ 1: "domino-vertical" });
    setStartNewGame(false);

    while (hand1.length + additionalCount < NUM_DOMINOES / 2) {
      const random = Math.random();
      const num = Math.ceil(random * NUM_DOMINOES);
      if (!hand1.includes(num)) {
        if (num === 1) {
          additionalCount = 1;
        } else {
          hand1.push(num);
        }
      }
    }
    setPlayedCards([1]);
    for (let i = 2; i <= NUM_DOMINOES; i++) {
      if (!hand1.includes(i)) {
        hand2.push(i);
      }
    }
    setComputerHand(hand1);
    setHand(hand2);
    if (hand1.length === NUM_DOMINOES / 2) {
      setIsComputersTurn(true);
    }
  };

  useEffect(() => {
    if (isComputersTurn) {
      handleComputerStep();
    }
  }, [isComputersTurn]);

  const handleResetGame = () => {
    setUpGame();
    forceUpdate();
  };

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
      const vals = keyToVals[computerHand[i]];
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
    let matchingDominos = getMoveFromHand(computerHand);
    if (matchingDominos) setFlippedComputerDomino(matchingDominos[0]);
    setTimeout(() => {
      if (matchingDominos) {
        tryPlayDomino(matchingDominos[0], matchingDominos[1], true);
      }
      setIsComputersTurn(false);
    }, 500);
  };

  const handleStop = (num) => {
    const madePlay = tryPlayDomino(num, hoveredDomino, false);

    if (madePlay) setIsComputersTurn(true);
  };

  const tryPlayDomino = (dominoKey, playedCardKey, isComputer) => {
    const dominoVals = keyToVals[dominoKey];
    const hoveredDominoVals = keyToVals[playedCardKey];
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
      setComputerHand(newHand);
    } else {
      setHand(newHand);
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
        if (middleBounds && playedCards.indexOf(middleBounds[0]) >= 2) {
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
          playedCards.indexOf(middleBounds[1]) < playedCards.length - 2
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
    setKeyToVals(newKeyToVals);
    if (
      (isComputer && computerHand.length === 1) ||
      (!isComputer && hand.length === 1)
    ) {
      setIsGameOver(true);
    }
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
  if (row2.length > 2) {
    row1 = row2.splice(0, row2.length - 2);
  }
  if (row4.length > 2) {
    row5 = row4.splice(2);
  }

  return (
    <div className="App">
      {/* <button onClick={handleResetGame}>Reset Game</button> */}
      <InstructionsModal />
      {isGameOver ? <GameOverModal /> : ""}
      <div className="hand slight-vertical-margin">
        {computerHand.map((num) => {
          return (
            <Domino
              dominoKey={num}
              vals={keyToVals[num]}
              className="domino-vertical"
              isOnBoard={false}
              isComputer={true}
              isFaceUp={num === flippedComputerDomino}
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
          <div className="top-domino-row">
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
      </div>
      <Button
        variant="outlined"
        color="info"
        size="medium"
        sx={passButtonStyle}
        onClick={handleComputerStep}
        disabled={hand.length === 0}
      >
        Pass
      </Button>
    </div>
  );
}

export default App;