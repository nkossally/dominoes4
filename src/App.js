import classNames from "classnames";
import { useState, useEffect } from "react";

import "./App.css";
import Domino from "./components/Domino";

const DOMINO_KEYS_TO_VALS = {
  1: [0, 0],
  2: [0, 1],
  3: [0, 2],
  4: [0, 3],
  5: [0, 4],
  6: [0, 5],
  7: [0, 6],
  8: [1, 1],
  9: [1, 2],
  10: [1, 3],
  11: [1, 4],
  12: [1, 5],
  13: [1, 6],
  14: [2, 2],
  15: [2, 3],
  16: [2, 4],
  17: [2, 5],
  18: [2, 6],
  19: [3, 3],
  20: [3, 4],
  21: [3, 5],
  22: [3, 6],
  23: [4, 4],
  24: [4, 5],
  25: [4, 6],
  26: [5, 5],
  27: [5, 6],
  28: [6, 6],
};

const NUM_DOMINOES = 28;
const MIDDLE_ROW_MAX = 10;
const HORIZONTAL_CLASSES = new Set(["domino-left-high", "domino-left-low"]);

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
  const [isGameOver, setIsGameOver] = useState(false);
  const [orderedVals, setOrderedVals] = useState({ 1: [0, 0] });

  const setUpGame = () => {
    const hand1 = [];
    const hand2 = [];
    let additionalCount = 0;
    setKeyToVals(DOMINO_KEYS_TO_VALS);
    setIsComputersTurn(false);
    setMiddleBounds(null);
    setKeyToClassNames({ 1: "domino-vertical" });

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
    setUpGame();
  }, []);

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

  const handleOnMouseDown = () => {};

  const getMoveFromHand = (dominoHand) => {
    let result;
    if (dominoHand.length === 0) return;
    for (let i = 0; i < dominoHand.length; i++) {
      if (result) break;
      const vals = keyToVals[computerHand[i]];
      for (let j = 0; j < playedCards.length; j++) {
        const playedCardNums = keyToVals[playedCards[j]];
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

    setTimeout(() => {
      if (matchingDominos) {
        tryPlayDomino(matchingDominos[0], matchingDominos[1], true);
      }
      setIsComputersTurn(false);
    }, 30);
  };

  const handleStop = (num) => {
    const madePlay = tryPlayDomino(num, hoveredDomino, false);

    if (madePlay) setIsComputersTurn(true);
  };

  const tryPlayDomino = (dominoKey, playedCardKey, isComputer) => {
    const dominoVals = keyToVals[dominoKey];
    const hoveredDominoVals = keyToVals[playedCardKey];
    console.log(
      "tryPlayDomino",
      dominoKey,
      playedCardKey,
      isComputer,
      dominoVals,
      hoveredDominoVals
    );
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
      if (playedCards.length > MIDDLE_ROW_MAX) {
        className = getClassNameForRow1(matchVal, otherVal);
      } else {
        className = getClassNameForRow2(matchVal, otherVal, false);
      }
      setKeyToClassNames({ [dominoKey]: className, ...keyToClassNames });
      setPlayedCards([dominoKey, ...playedCards]);
    } else {
      let className;
      if (playedCards.length > MIDDLE_ROW_MAX) {
        className = getClassNameForRow3(matchVal, otherVal);
      } else {
        className = getClassNameForRow2(matchVal, otherVal, true);
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
    return true;
  };

  const row1 = [];
  let row2 = [];
  const row3 = [];
  if (playedCards.length <= MIDDLE_ROW_MAX) {
    row2 = playedCards;
  } else {
    let sawFirstBound;
    let sawSecondBound;
    for (let i = 0; i < playedCards.length; i++) {
      if (!sawFirstBound && playedCards[i] === middleBounds[0])
        sawFirstBound = true;

      if (sawSecondBound) {
        row3.push(playedCards[i]);
      } else if (sawFirstBound) {
        row2.push(playedCards[i]);
      } else {
        row1.push(playedCards[i]);
      }
      if (!sawSecondBound && playedCards[i] === middleBounds[1])
        sawSecondBound = true;
    }
  }

  const getClassNameForRow2 = (matchVal, otherVal, isRightOfBlank) => {
    let className;
    if (isRightOfBlank) {
      if (matchVal > otherVal) {
        className = "domino-left-high";
      } else if (matchVal < otherVal) {
        className = "domino-left-low";
      }
    } else {
      if (matchVal > otherVal) {
        className = "domino-left-low";
      } else if (matchVal < otherVal) {
        className = "domino-left-high";
      }
    }
    if (matchVal === otherVal) {
      className = "domino-vertical";
    }
    return className;
  };

  const getClassNameForRow1 = (matchVal, otherVal) => {
    let className;
    if (matchVal < otherVal) {
      className = "domino-upsidedown";
    } else if (matchVal > otherVal) {
      className = "domino-vertical";
    } else {
      className = "domino-left-high";
    }
    return className;
  };

  const getClassNameForRow3 = (matchVal, otherVal) => {
    let className;
    if (matchVal < otherVal) {
      className = "domino-vertical";
    } else if (matchVal > otherVal) {
      className = "domino-upsidedown";
    } else {
      className = "domino-left-high";
    }
    return className;
  };
  console.log(keyToClassNames)

  return (
    <div className="App">
      <div className="App-header">
        {/* <button onClick={setUpGame}>Reset Game</button> */}
        <button onClick={handleComputerStep}>Pass</button>
        <div className="board">
          <div className="hand">
            {computerHand.map((num) => {
              return (
                <Domino
                  dominoKey={num}
                  vals={keyToVals[num]}
                  className="domino-vertical"
                  isOnBoard={false}
                  isComputer={true}
                />
              );
            })}
          </div>
          <div className="played-cards">
            <div className="top-domino-row">
              {row1.map((num, idx) => {
                let className = keyToClassNames[num];
                if (
                  idx === row1.length - 1 &&
                  HORIZONTAL_CLASSES.has(className)
                ) {
                  className = "domino-vertical";
                }
                const hoverClass = hoveredDomino === num ? "domino-hover" : "";

                const horizontalOnVerticalBranch = HORIZONTAL_CLASSES.has(
                  className
                )
                  ? "horizontal-on-vertical-branch"
                  : "";
                const lower =
                  idx === row1.length - 1 &&
                  HORIZONTAL_CLASSES.has(keyToClassNames[row2[0]])
                    ? "lower"
                    : "";
                return (
                  <Domino
                    dominoKey={num}
                    className={classNames(
                      className,
                      hoverClass,
                      horizontalOnVerticalBranch,
                      lower
                    )}
                    vals={keyToVals[num]}
                    isOnBoard={true}
                    onMouseOver={handleOnMouseOver}
                    idx={idx}
                  />
                );
              })}
            </div>
            <div className="hand">
              {row2.map((num, idx) => {
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
              {row3.map((num, idx) => {
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
                  HORIZONTAL_CLASSES.has(keyToClassNames[row2[row2.length - 1]])
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
          </div>
          <div className="hand">
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
        </div>
      </div>
    </div>
  );
}

export default App;
