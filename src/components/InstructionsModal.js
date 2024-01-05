import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import infoIcon from "../images/info icon.png";

export default function InstructionsModal({ onCloseCallback }) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  const buttonStyle = {
    position: "absolute",
    top: 5,
    right: 5,
    "text-transform": "capitalize",
    color: "#00e0ff",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
  };

  return (
    <div>
      <Button sx={buttonStyle} onClick={handleOpen}>
        <img src={infoIcon} className="info-icon" />
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div class="box-outer">
            <div class="main_box">
              <div class="bar top"></div>
              <div class="bar right delay"></div>
              <div className="modal-text-box">
                <Typography id="modal-modal-description" sx={{ mt: -0.6 }}>
                  A domino is playable if one of its numbers matches that of one
                  of the edge dominoes on the board.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                  Select a domino on the board by hovering over it, and select a
                  domino from your hand by clicking or dragging.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                  {" "}
                  The player that is dealt a blank domino automaically plays
                  first.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                  Pass if no moves are available.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                  Play all dominoes or the most dominoes to win.
                </Typography>
              </div>
            </div>
            <div class="bar bottom delay"></div>
            <div class="bar left"></div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
