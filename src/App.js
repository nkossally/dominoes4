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

  const numDominoes = 28;

  useEffect(() => {}, [highlightedDominoKey]);
  useEffect(() => {}, [keyToClassNames]);
  useEffect(() => {
    if (!gameStarted) {
      const hand1 = [];
      const hand2 = [];
      while (hand1.length + playedCards.length < numDominoes / 2) {
        const random = Math.random();
        const num = Math.ceil(random * numDominoes);
        if (!hand1.includes(num) && !playedCards.includes(num)) {
          if (num === 1) {
            setPlayedCards([1]);
          } else {
            hand1.push(num);
          }
        }
      }
      if (playedCards.length === 0) setPlayedCards([1]);
      for (let i = 2; i <= numDominoes; i++) {
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
        console.log(computerCardVals, playedCardNums);
        for (let k = 0; k < computerCardVals.length; k++) {
          if (matchDominoKey) break;
          for (let m = 0; m < playedCardNums.length; m++) {
            if (computerCardVals[k] === playedCardNums[m]) {
              matchDominoKey = computerHand[i];
              setHighlightedDominoKey(playedCards[j]);
              playComputerStep(computerHand[i], playedCards[j]);
              break;
            }
          }
        }
      }
    }
  };

  const playComputerStep = (computerDominoKey, playedCardKey) => {
    const dominoVals = keyToVals[computerDominoKey];
    const hoveredDominoVals = keyToVals[playedCardKey];
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

    const newComputerHand = Array.from(computerHand);
    const idx = newComputerHand.indexOf(computerDominoKey);
    newComputerHand.splice(idx, 1);
    setComputerHand(newComputerHand);

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
      setPlayedCards([computerDominoKey, ...playedCards]);
      if (otherVal < matchVal) {
        setKeyToClassNames({
          [computerDominoKey]: "domino-left-low",
          ...keyToClassNames,
        });
      } else {
        setKeyToClassNames({
          [computerDominoKey]: "domino-left-high",
          ...keyToClassNames,
        });
      }
    } else {
      setPlayedCards(playedCards.concat(computerDominoKey));
      if (otherVal < matchVal) {
        setKeyToClassNames({
          [computerDominoKey]: "domino-left-high",
          ...keyToClassNames,
        });
      } else {
        setKeyToClassNames({
          [computerDominoKey]: "domino-left-low",
          ...keyToClassNames,
        });
      }
    }
    if (otherVal === matchVal) {
      setKeyToClassNames({
        [computerDominoKey]: "domino-vertical",
        ...keyToClassNames,
      });
    }
    hoveredDominoVals.splice(hoverValsIdx, 1);
    dominoVals.splice(dominoValsIdx, 1);

    const newKeyToVals = { ...keyToVals };
    newKeyToVals[computerDominoKey] = dominoVals;

    newKeyToVals[playedCardKey] = hoveredDominoVals;
    console.log("newKeyToVals", newKeyToVals);
    setKeyToVals(newKeyToVals);
  };

  const handleStop = (num, isComputer) => {
    const dominoVals = keyToVals[num];
    if (!hoveredDomino) return;
    const hoveredDominoVals = hoveredDomino
      .getAttribute("vals")
      .split(",")
      .map((numStr) => parseInt(numStr));
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

    if (matchVal !== undefined) {
      if (isComputer) {
        const newComputerHand = Array.from(computerHand);
        const idx = newComputerHand.indexOf(num);
        newComputerHand.splice(idx, 1);
        setComputerHand(newComputerHand);
      } else {
        const newHand = Array.from(hand);
        const idx = newHand.indexOf(num);
        newHand.splice(idx, 1);
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

      const playedCardsIdx = parseInt(hoveredDomino.getAttribute("idx"));
      if (playedCardsIdx === 0) {
        setPlayedCards([num, ...playedCards]);
        if (otherVal < matchVal) {
          setKeyToClassNames({ [num]: "domino-left-low", ...keyToClassNames });
        } else {
          setKeyToClassNames({ [num]: "domino-left-high", ...keyToClassNames });
        }
      } else {
        setPlayedCards(playedCards.concat(num));
        if (otherVal < matchVal) {
          setKeyToClassNames({ [num]: "domino-left-high", ...keyToClassNames });
        } else {
          setKeyToClassNames({ [num]: "domino-left-low", ...keyToClassNames });
        }
      }
      if (otherVal === matchVal) {
        setKeyToClassNames({ [num]: "domino-vertical", ...keyToClassNames });
      }
      hoveredDominoVals.splice(hoverValsIdx, 1);
      dominoVals.splice(dominoValsIdx, 1);

      const newKeyToVals = { ...keyToVals };
      newKeyToVals[num] = dominoVals;
      const hoveredDominoKey = parseInt(
        hoveredDomino.getAttribute("dominoKey")
      );

      newKeyToVals[hoveredDominoKey] = hoveredDominoVals;
      console.log("newKeyToVals", newKeyToVals);
      setKeyToVals(newKeyToVals);
    }
    // setPlayAttempts(playAttempts + 1);
  };
  console.log("hoveredDomino", hoveredDomino);
  console.log("playedCards", playedCards);
  console.log(
    "highlightedDominoKey",
    highlightedDominoKey,
    typeof highlightedDominoKey
  );
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
                // onMouseDown={handleOnMouseDown}
              />
            );
          })}
        </div>
        <div>
          {playedCards.map((num, idx) => {
            const hoverClass =
              highlightedDominoKey === num ? "domino-hover" : "";
            console.log("what, what, what", keyToClassNames);
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
                // onMouseDown={handleOnMouseDown}
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
