import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import infoIcon from "../images/info icon.png"

export default function InstructionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const buttonStyle = {
    position: "absolute",
    top: 5,
    right: 5,
    "text-transform": "capitalize",
    color: "#00e0ff",
    "font-size": 20,
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #00e0ff",
    boxShadow: 24,
    p: 4,
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            A domino is playable if one of it's numbers matches that of one of the edge
            dominoes on the board.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Select a domino on the board by hovering over it, and select a
            domino from your hand by clicking or dragging.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {" "}
            The player that is dealt a blank domino automaically plays first.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Pass if no moves are available.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
