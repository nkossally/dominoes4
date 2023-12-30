export const getClassNameForRow2 = (matchVal, otherVal) => {
  let className;
  if (matchVal < otherVal) {
    className = "domino-upsidedown";
  } else if (matchVal > otherVal) {
    className = "domino-vertical";
  } else {
    className = "domino-vertical";
  }
  return className;
};

export const getClassNameForRow4 = (matchVal, otherVal) => {
  let className;
  if (matchVal < otherVal) {
    className = "domino-vertical";
  } else if (matchVal > otherVal) {
    className = "domino-upsidedown";
  } else {
    className = "domino-vertical";
  }
  return className;
};

export const getClassNameForRow1 = (matchVal, otherVal) => {
  let className;
  if (matchVal > otherVal) {
    className = "domino-left-high";
  } else if (matchVal < otherVal) {
    className = "domino-left-low";
  }
  if (matchVal === otherVal) {
    className = "domino-vertical";
  }
  return className;
};

export const getClassNameForRow3 = (matchVal, otherVal, isRightOfBlank) => {
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

export const getClassNameForRow5 = (matchVal, otherVal) => {
  let className;

  if (matchVal > otherVal) {
    className = "domino-left-low";
  } else if (matchVal < otherVal) {
    className = "domino-left-high";
  }

  if (matchVal === otherVal) {
    className = "domino-vertical";
  }
  return className;
};
