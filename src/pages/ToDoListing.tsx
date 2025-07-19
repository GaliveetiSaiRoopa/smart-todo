import React, { useEffect, useState } from "react";
import PrimaryBtn from "../components/common/PrimaryBtn";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import moment from "moment";
import AddTaskModal from "./modals/AddTaskModal";
import EditModal from "./modals/EditModal";
import DeleteTaskModal from "./modals/DeleteTaskModal";
import { showToastMessage } from "../utils/helper";
import dayjs from "dayjs";


const filters = [
  { name: "All" },
  { name: "Ongoing" },
  { name: "Success" },
  { name: "Failure" },
];

const getCountdownText = (deadline: string, currentTime: dayjs.Dayjs) => {
  const due = dayjs(deadline);
  let diff = due.diff(currentTime, "second");
  let time = diff;
  if (diff < 0) {
    time = Math.abs(diff);
  }
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  const min = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const hrs = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");

  if (diff > 0) return `Due in ${hrs} hrs: ${min} min: ${sec} sec`;
  if (diff === 0) return "Due now";
  return `Overdue by ${hrs} hrs: ${min} min: ${sec} sec`;
};

const TaskCard = ({
  task,
  updateStatus,
  editTask,
  deleteTask,
  currentTime,
}: any) => {
  return (
    <Card sx={{ mb: 2, backgroundColor: "#ffffff" }}>
      <CardContent>
        <Typography variant="h5" mb={2}>
          <strong>Title: </strong>
          {task.title}
        </Typography>
        <Typography variant="h6" mb={2} color="text.primary">
          <strong>Description:</strong> {task?.description}
        </Typography>
        <Typography variant="h6" mb={2} color="text.primary">
          <strong>Deadline:</strong>{" "}
          {moment(task?.deadline).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="h6" mb={2} color="text.primary">
          <strong>Created At:</strong>{" "}
          {moment(task?.createdAt).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="h6" mb={2} color="text.primary">
          <strong>Updated At:</strong>{" "}
          {moment(task?.updatedAt).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="h6" mb={2} color="text.primary">
          <strong>Status: </strong>{" "}
          {task.isCompleted
            ? "Success"
            : moment(task.deadline).isBefore(moment())
            ? "Failed"
            : "Ongoing"}
        </Typography>
        {!task.isCompleted && (
          <Typography variant="h6" mb={2} color="text.primary">
            {getCountdownText(task.deadline, currentTime)}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <PrimaryBtn
            label={task?.isCompleted ? "Mark Incomplete" : "Mark Complete"}
            bgColor={"#765996"}
            onClick={() => updateStatus()}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <PrimaryBtn
              label="Edit"
              onClick={() => editTask()}
              bgColor={"#765996"}
            />
            <PrimaryBtn
              label="Delete"
              onClick={() => deleteTask()}
              bgColor={"#765996"}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ToDoListing = () => {
  const base_url = "http://localhost:3001";
  const [todoList, setTodoList] = useState<any>([]);
  const [taskFilters, setTaskFilters] = useState("All");
  const [addTask, setAddTask] = useState(false);
  const [editTask, setEditTask] = useState({
    isOpen: false,
    data: {},
    id: null,
  });
  const [deleteTask, setDeleteTask] = useState({ isOpen: false, id: null });
  const [currentTime, setCurrentTime] = useState(dayjs());

  const handleEditTask = (item: any) => {
    setEditTask({ isOpen: true, data: item, id: item?.id });
  };

  const handleDeleteTask = (id: any) => {
    setDeleteTask({ isOpen: true, id: id });
  };

  const closeEditModal = () => {
    setEditTask({ isOpen: false, data: {}, id: null });
  };

  const closeDeleteModal = () => {
    setDeleteTask({ isOpen: false, id: null });
  };

  const handleStatus = (taskId: number, currentStatus: boolean) => {
    axios
      .patch(`${base_url}/tasks/${taskId}`, {
        isCompleted: !currentStatus,
        updatedAt: Date.now(),
      })
      .then(() => {
        showToastMessage("Task status updated", "success");
        fetchData();
      })
      .catch(() => {
        showToastMessage("Update failed", "error");
      });
  };

  const fetchData = () => {
    axios
      .get(`${base_url}/api/tasks`)
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((err) => console.log(err));
  };

  const getFilteredTasks = () => {
    const now = moment();
    return todoList.filter((task: any) => {
      const deadline = moment(task.deadline);
      switch (taskFilters) {
        case "Ongoing":
          return !task.isCompleted && deadline.isAfter(now);
        case "Success":
          return task.isCompleted;
        case "Failure":
          return !task.isCompleted && deadline.isBefore(now);
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bg-[#ffffff] min-h-screen w-full flex flex-col lg:gap-8 gap-4 lg:px-20 px-6 overflow-y-scroll">
      <div className="flex justify-between lg:pt-10 lg:pb-6 py-6 items-center">
        <Typography variant="h4" sx={{ color: "#765996" }}>
          Smart Todo
        </Typography>

        <PrimaryBtn
          label="Add Task"
          bgColor={"#765996"}
          onClick={() => setAddTask(true)}
        />
      </div>

      <div className="flex flex-col lg:gap-6 gap-3">
        <Typography variant="h5" sx={{ color: "#765996" }}>
          Task List ({filteredTasks.length})
        </Typography>
        <div className="flex gap-6">
          {filters.map((item) => (
            <button
              key={item.name}
              className={`${
                taskFilters === item.name
                  ? "border-[#765996] border-b-2 text-[#765996] font-semibold"
                  : " text-slate-500 font-medium"
              } py-2`}
              onClick={() => setTaskFilters(item.name)}
            >
              <Typography variant="h6" sx={{ color: "#765996" }}>
                {item.name}
              </Typography>
            </button>
          ))}
        </div>

        {/* {TaskList} */}
        <Box my={3}>
          {filteredTasks.length === 0 ? (
            <div className="font-semibold text-2xl flex justify-center items-center w-full border py-4">
              No Active Tasks
            </div>
          ) : (
            filteredTasks.map((task: any) => (
              <TaskCard
                task={task}
                updateStatus={() => handleStatus(task?.id, task?.isCompleted)}
                editTask={() => handleEditTask(task)}
                deleteTask={() => handleDeleteTask(task?.id)}
                currentTime={currentTime}
              />
            ))
          )}
        </Box>
      </div>

      {/* Modals */}
      {addTask && (
        <AddTaskModal
          open={addTask}
          handleClose={() => setAddTask(false)}
          fetchData={fetchData}
        />
      )}
      {editTask.isOpen && (
        <EditModal
          open={editTask.isOpen}
          handleClose={closeEditModal}
          fetchData={fetchData}
          data={editTask.data}
          id={editTask.id}
        />
      )}
      {deleteTask.isOpen && (
        <DeleteTaskModal
          open={deleteTask.isOpen}
          handleClose={closeDeleteModal}
          fetchData={fetchData}
          id={deleteTask.id}
        />
      )}
    </div>
  );
};

export default ToDoListing;
