import { Backdrop, Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import TextFields from "../../components/common/TextFields";
import { DateTimeField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import PrimaryBtn from "../../components/common/PrimaryBtn";
import axios from "axios";
import { showToastMessage } from "../../utils/helper";
import moment from "moment";

const style = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};

type TaskParams = {
  title: string;
  description: string;
  deadline: Dayjs | null;
};

const EditModal = ({ open, handleClose, fetchData, data, id }: any) => {
  console.log(data, "editData");
  const onCloseClick = () => {
    handleClose();
  };
  const [params, setParams] = useState<TaskParams>({
    title: "",
    description: "",
    deadline: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setParams((prev) => ({ ...prev, deadline: newValue }));
  };

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      title: data?.title || "",
      description: data?.description || "",
      deadline: data?.deadline ? dayjs(data?.deadline) : null,
    }));
  }, [data]);

  const handleSubmit = () => {
    const payload = {
      id: data?.id,
      title: params?.title,
      description: params?.description,
      deadline: params?.deadline,
      isCompleted: false,
      createdAt: data?.createdAt,
      updatedAt: moment(),
    };

    if (!params?.title || !params?.description || !params?.deadline) {
      showToastMessage("Fill form details correctly", "error");
      return;
    }

    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/tasks/${data?.id}`, payload)
      .then((response) => {
        console.log(response);
        showToastMessage("Successfully Updated Task", "success");
        fetchData();
        onCloseClick();
      })
      .catch((err) => {
        console.log(err);
        showToastMessage("Please check the form errors", "error");
      });
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
          <div className="lg:w-[525px] w-[90vw] bg-white min-h-[205px] max-h-[600px] lg:p-8 p-6 rounded-2xl flex flex-col gap-4 items-center overflow-auto">
            <div className="flex justify-between items-center w-full">
              <Typography variant="h5" sx={{ color: "#765996" }}>
                Edit Task
              </Typography>
              <img
                src="/icons/Close.svg"
                alt="close"
                onClick={onCloseClick}
                className="cursor-pointer"
              />
            </div>

            <div className="w-full flex flex-col gap-5">
              <Input
                name="title"
                label="Title"
                value={params?.title}
                handleChange={handleChange}
              />

              <TextFields
                name="description"
                label="Description"
                rows={4}
                value={params?.description}
                handleChange={handleChange}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimeField
                  label="Due Date"
                  name="deadline"
                  value={params?.deadline}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </div>

            <div className="flex justify-end w-full gap-4">
              <PrimaryBtn
                label="Cancel"
                bgColor={"#765996"}
                onClick={onCloseClick}
                width={"w-fit"}
              />
              <PrimaryBtn
                label="Update"
                bgColor={"#765996"}
                onClick={handleSubmit}
                width={"w-fit"}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
