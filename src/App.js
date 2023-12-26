import classNames from "classnames";
import { useState, useEffect } from "react";

import "./App.css";
import Domino from "./components/Domino";
import Board from "./components/Board";

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

function App() {
  const [computerHand, setComputerHand] = useState([]);
  const [hand, setHand] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [playedCards, setPlayedCards] = useState([1]);
  const [playAttempts, setPlayAttempts] = useState(0);
  const [hoveredDomino, setHoveredDomino] = useState(null);
  const [keyToVals, setKeyToVals] = useState(DOMINO_KEYS_TO_VALS);
  const [highlightedDominoKey, setHighlightedDominoKey] = useState(null);
  const [keyToClassNames, setKeyToClassNames] = useState({
    1: "domino-vertical",
  });
  const [computerIsMoving, setComputerIsMoving] = useState(false);

  useEffect(() => {}, [highlightedDominoKey]);
  useEffect(() => {}, [keyToClassNames]);
  useEffect(() => {
    if (!gameStarted) {
      const hand1 = [];
      const hand2 = [];
      while (hand1.length + playedCards.length < NUM_DOMINOES / 2) {
        const random = Math.random();
        const num = Math.ceil(random * NUM_DOMINOES);
        if (!hand1.includes(num) && !playedCards.includes(num)) {
          if (num === 1) {
            setPlayedCards([1]);
          } else {
            hand1.push(num);
          }
        }
      }
      if (playedCards.length === 0) setPlayedCards([1]);
      for (let i = 2; i <= NUM_DOMINOES; i++) {
        if (!hand1.includes(i)) {
          hand2.push(i);
        }
      }
      setComputerHand(hand1);
      setHand(hand2);
      setGameStarted(true);
    }
  }, [gameStarted]);

  const handleOnMouseOver = (e) => {
    setHoveredDomino(e.target);
    if (!e.target) return;
    const hoveredDominoKey = parseInt(e.target.getAttribute("dominoKey"));
    setHighlightedDominoKey(hoveredDominoKey);
  };

  const handleOnMouseDown = () => {
    console.log("handleOnMouseDown");
  };

  const handleComputerStep = () => {
    let matchDominoKey;
    for (let i = 0; i < computerHand.length; i++) {
      const computerCardVals = keyToVals[computerHand[i]];
      for (let j = 0; j < playedCards.length; j++) {
        const playedCardNums = keyToVals[playedCards[j]];
        for (let k = 0; k < computerCardVals.length; k++) {
          if (matchDominoKey) break;
          for (let m = 0; m < playedCardNums.length; m++) {
            if (computerCardVals[k] === playedCardNums[m]) {
              matchDominoKey = computerHand[i];
              setHighlightedDominoKey(playedCards[j]);
              tryPlayDomino(computerHand[i], playedCards[j], true);
              break;
            }
          }
        }
      }
    }
  };

  const handleStop = (num, isComputer) => {
    const dominoVals = keyToVals[num];
    tryPlayDomino(num, highlightedDominoKey, false);
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
    if (matchVal === undefined) return;

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

    const playedCardsIdx = playedCards.indexOf(playedCardKey);
    if (playedCardsIdx === 0) {
      setPlayedCards([dominoKey, ...playedCards]);
      if (otherVal < matchVal) {
        setKeyToClassNames({
          [dominoKey]: "domino-left-low",
          ...keyToClassNames,
        });
      } else {
        setKeyToClassNames({
          [dominoKey]: "domino-left-high",
          ...keyToClassNames,
        });
      }
    } else {
      setPlayedCards(playedCards.concat(dominoKey));
      if (otherVal < matchVal) {
        setKeyToClassNames({
          [dominoKey]: "domino-left-high",
          ...keyToClassNames,
        });
      } else {
        setKeyToClassNames({
          [dominoKey]: "domino-left-low",
          ...keyToClassNames,
        });
      }
    }
    if (otherVal === matchVal) {
      setKeyToClassNames({
        [dominoKey]: "domino-vertical",
        ...keyToClassNames,
      });
    }
    hoveredDominoVals.splice(hoverValsIdx, 1);
    dominoVals.splice(dominoValsIdx, 1);

    const newKeyToVals = { ...keyToVals };
    newKeyToVals[dominoKey] = dominoVals;

    newKeyToVals[playedCardKey] = hoveredDominoVals;
    setKeyToVals(newKeyToVals);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleComputerStep}>computer turn</button>
        <div className="hand">
          {computerHand.map((num) => {
            return (
              <Domino
                dominoKey={num}
                vals={keyToVals[num]}
                className="domino-vertical"
                onStop={(e) => handleStop(num, true)}
                isOnBoard={false}
              />
            );
          })}
        </div>
        <div>
          {playedCards.map((num, idx) => {
            const hoverClass =
              highlightedDominoKey === num ? "domino-hover" : "";
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
                onStop={(e) => handleStop(num, false)}
                isOnBoard={false}
              />
            );
          })}
        </div>
        {playAttempts}
      </header>
    </div>
  );
}

export default App;
