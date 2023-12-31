import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export default function GameOverModal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 200,
    bgcolor: "background.paper",
    "text-align": "center",
    // outline: '2px solid #00e0ff',
    boxShadow: 24,
    p: 4,
  };

  const textStyle ={ 
    mt: 2, 
    "font-size": 40,
    "font-weight": "900",
    "text-transform": "uppercase"
   }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={textStyle}>
            Game Over
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
