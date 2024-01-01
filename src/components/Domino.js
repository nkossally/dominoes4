import React from "react";
import classNames from "classnames";
import Draggable from "react-draggable";

import _0_0 from "../images/0 0.png";
import _0_1 from "../images/0 1.png";
import _0_2 from "../images/0 2.png";
import _0_3 from "../images/0 3.png";
import _0_4 from "../images/0 4.png";
import _0_5 from "../images/0 5.png";
import _0_6 from "../images/0 6.png";
import _1_1 from "../images/1 1.png";
import _1_2 from "../images/1 2.png";
import _1_3 from "../images/1 3.png";
import _1_4 from "../images/1 4.png";
import _1_5 from "../images/1 5.png";
import _1_6 from "../images/1 6.png";
import _2_2 from "../images/2 2.png";
import _2_3 from "../images/2 3.png";
import _2_4 from "../images/2 4.png";
import _2_5 from "../images/2 5.png";
import _2_6 from "../images/2 6.png";
import _3_3 from "../images/3 3.png";
import _3_4 from "../images/3 4.png";
import _3_5 from "../images/3 5.png";
import _3_6 from "../images/3 6.png";
import _4_4 from "../images/4 4.png";
import _4_5 from "../images/4 5.png";
import _4_6 from "../images/4 6.png";
import _5_5 from "../images/5 5.png";
import _5_6 from "../images/5 6.png";
import _6_6 from "../images/6 6.png";
import blank from "../images/blank domino.png";

const mapToPic = {
  1: _0_0,
  2: _0_1,
  3: _0_2,
  4: _0_3,
  5: _0_4,
  6: _0_5,
  7: _0_6,
  8: _1_1,
  9: _1_2,
  10: _1_3,
  11: _1_4,
  12: _1_5,
  13: _1_6,
  14: _2_2,
  15: _2_3,
  16: _2_4,
  17: _2_5,
  18: _2_6,
  19: _3_3,
  20: _3_4,
  21: _3_5,
  22: _3_6,
  23: _4_4,
  24: _4_5,
  25: _4_6,
  26: _5_5,
  27: _5_6,
  28: _6_6,
};

const Domino = ({
  dominoKey,
  isFaceUp,
  className,
  onStop,
  isOnBoard,
  onMouseDown,
  onMouseOver,
  idx,
  isComputer,
  isMovingToBoard,
}) => {
  if (isComputer) {
    return (
      <img
        draggable="false"
        className={classNames(className,dominoKey === 1 ? "slide-down" : "", isMovingToBoard ? "slide-down" : "")}
        src={isFaceUp || dominoKey === 1 ? mapToPic[dominoKey] : blank}
        alt="domino"
        onMouseOver={onMouseOver}
        dominoKey={dominoKey}
        idx={idx}
      />
    );
  }
  if (isOnBoard) {
    return (
      <img
        draggable="false"
        className={className}
        src={mapToPic[dominoKey]}
        alt="domino"
        onMouseOver={onMouseOver}
        dominoKey={dominoKey}
        idx={idx}
      />
    );
  }
  return (
    <Draggable
      onStop={onStop}
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: 0, y: 0 }}
    >
      <img
        draggable="false"
        src={mapToPic[dominoKey]}
        alt="domino"
        className={classNames(className, dominoKey === 1 ? "slide-up" : "")}
        onMouseOver={onMouseOver}
        onMouseDown={onMouseDown}
      />
    </Draggable>
  );
};
export default Domino;
