import "./App.css";
import Domino from "./components/Domino";
import Board from "./components/Board";
import { useState, useEffect } from "react";

function App() {
  const [computerHand, setComputerHand] = useState([]);
  const [hand, setHand] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [countryCodes, setCountryCodes] = useState([])

  const numDominoes = 28;

  useEffect(() => {
    if (!gameStarted) {
      const hand1 = [];
      const hand2 = [];
      while (hand1.length < numDominoes / 2) {
        const random = Math.random();
        const num = Math.ceil(random * numDominoes);
        if (!hand1.includes(num)) {
          hand1.push(num);
        }
      }
      for (let i = 1; i <= numDominoes; i++) {
        if (!hand1.includes(i)) {
          hand2.push(i);
        }
      }
      setComputerHand(hand1);
      setHand(hand2);
      setGameStarted(true);
    }
  }, [gameStarted]);


  return (
    <div className="App">
      <header className="App-header">
        <div className="hand">
          {computerHand.map((num) => {
            return <Domino dominoKey={num} />;
          })}
        </div>
        <Board />

        <div className="hand">
          {hand.map((num) => {
            return <Domino dominoKey={num} />;
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
