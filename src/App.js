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

  const setUpGame = () => {
    const hand1 = [];
    const hand2 = [];
    let additionalCount = 0;
    setKeyToVals(DOMINO_KEYS_TO_VALS);
    setIsComputersTurn(false);
    setIsGameOver(false);
    setMiddleBounds(null);

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
  }, [playedCards]);

  useEffect(() => {
    if (isComputersTurn) {
      handleComputerStep();
    }
  }, [isComputersTurn]);

  // useEffect(() => {
  //   let move1 = getMoveFromHand(computerHand);
  //   let move2 = getMoveFromHand(hand)
  //   // if(!move1 || !move2) setIsGameOver(true)
  // }, [computerHand, hand]);

  const handleOnMouseOver = (e) => {
    if (!e.target) return;
    const possibleHoveredDominoKey = parseInt(
      e.target.getAttribute("dominoKey")
    );
    setHoveredDomino(possibleHoveredDominoKey);
  };

  const handleOnMouseDown = () => {
    console.log("handleOnMouseDown");
  };

  const getMoveFromHand = (dominoHand) => {
    let result;
    if (dominoHand.length === 0) return;
    for (let i = 0; i < dominoHand.length; i++) {
      if (result) break;
      const vals = keyToVals[computerHand[i]];
      for (let j = 0; j < playedCards.length; j++) {
        const playedCardNums = keyToVals[playedCards[j]];
        console.log(
          "getMoveFromHand",
          dominoHand,
          playedCardNums,
          computerHand[i],
          vals
        );
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
    console.log(dominoKey, playedCardKey, isComputer);
    const dominoVals = keyToVals[dominoKey];
    const hoveredDominoVals = keyToVals[playedCardKey];
    console.log("tryPlayDomino", dominoVals, hoveredDominoVals);
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
    let onBranch = playedCards.length >= MIDDLE_ROW_MAX;

    const playedCardsIdx = playedCards.indexOf(playedCardKey);
    if (playedCardsIdx === 0) {
      setPlayedCards([dominoKey, ...playedCards]);
      if (onBranch) {
        if (otherVal < matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-vertical",
            ...keyToClassNames,
          });
        } else if (otherVal > matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-upsidedown",
            ...keyToClassNames,
          });
        } else {
          setKeyToClassNames({
            [dominoKey]: "domino-left-high",
            ...keyToClassNames,
          });
        }
      } else {
        if (otherVal < matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-left-low",
            ...keyToClassNames,
          });
        } else if (otherVal > matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-left-high",
            ...keyToClassNames,
          });
        } else {
          setKeyToClassNames({
            [dominoKey]: "domino-vertical",
            ...keyToClassNames,
          });
        }
      }
    } else {
      setPlayedCards(playedCards.concat(dominoKey));
      if (onBranch) {
        if (otherVal < matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-upsidedown",
            ...keyToClassNames,
          });
        } else if (otherVal > matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-vertical",
            ...keyToClassNames,
          });
        } else {
          setKeyToClassNames({
            [dominoKey]: "domino-left-high",
            ...keyToClassNames,
          });
        }
      } else {
        if (otherVal < matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-left-high",
            ...keyToClassNames,
          });
        } else if (otherVal > matchVal) {
          setKeyToClassNames({
            [dominoKey]: "domino-left-low",
            ...keyToClassNames,
          });
        } else {
          setKeyToClassNames({
            [dominoKey]: "domino-vertical",
            ...keyToClassNames,
          });
        }
      }
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

  return (
    <div className="App">
      <div className="App-header">
        <button onClick={setUpGame}>Reset Game</button>
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
          <div className="top-domino-row">
            {row1.map((num, idx) => {
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";
              const verticalClass = idx === row1.length - 1 ? "domino-vertical" : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(keyToClassNames[num],verticalClass, hoverClass)}
                  // className={classNames(keyToClassNames[num], hoverClass)}
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
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";
              const addMargin =
                keyToClassNames[num] === "domino-left-low" ||
                keyToClassNames[num] === "domino-left-high";
              const marginClass = addMargin
                ? "middle-row-horizontal-margin"
                : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(
                    keyToClassNames[num],
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
          <div className="bottom-domino-row">
            {row3.map((num, idx) => {
              const hoverClass = hoveredDomino === num ? "domino-hover" : "";
              const verticalClass = idx === row1.length - 1 ? "domino-vertical" : "";
              return (
                <Domino
                  dominoKey={num}
                  className={classNames(keyToClassNames[num], hoverClass)}
                  vals={keyToVals[num]}
                  isOnBoard={true}
                  onMouseOver={handleOnMouseOver}
                  idx={idx}
                />
              );
            })}
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
