import { Backdrop, Box, Modal, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import { showToastMessage } from "../../utils/helper";

const style = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};
const DeleteTaskModal = ({ open, handleClose, fetchData, id }: any) => {
  const onCloseClick = () => {
    handleClose();
  };

  const handleDelete = () => {
    if (id) {
      axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/tasks/${id}`)
        .then((response) => {
          console.log(response);
          showToastMessage("Successfully Deleted Task", "success");
          fetchData();
          onCloseClick();
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEnforceFocus
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          sx={style}
          style={{
            outline: "none",
          }}
        >
          <div className="lg:w-[425px] w-[90vw] bg-white min-h-[205px] max-h-[600px] lg:p-8 p-6 rounded-2xl flex flex-col gap-4 items-center overflow-auto">
            <div className="flex justify-between items-center w-full">
              <Typography variant="h6" sx={{ color: "#765996" }}>
                Delete Task
              </Typography>
              <img
                src="/icons/Close.svg"
                alt="close"
                onClick={onCloseClick}
                className="cursor-pointer"
              />
            </div>

            <div className="text-lg text-start font-medium border p-2 w-full rounded">
              Are you sure you want to delete task?
            </div>

            <div className="flex justify-end w-full gap-4">
              <PrimaryBtn
                label="Cancel"
                bgColor={"#765996"}
                onClick={onCloseClick}
                width={"w-fit"}
              />
              <PrimaryBtn
                label="Delete"
                bgColor={"#765996"}
                onClick={handleDelete}
                width={"w-fit"}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DeleteTaskModal;
