import React, { useEffect, useState } from "react";
import PrimaryBtn from "../components/common/PrimaryBtn";
import axios from "axios";
import { Box, Card, CardContent, Typography } from "@mui/material";
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
        <Typography variant="h6" mb={1}>
          <strong>Title: </strong>
          {task.title}
        </Typography>
        <Typography variant="body1" mb={1} color="text.primary">
          <strong>Description:</strong> {task?.description}
        </Typography>
        <Typography variant="body1" mb={1} color="text.primary">
          <strong>Deadline:</strong>{" "}
          {moment(task?.deadline).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="body1" mb={1} color="text.primary">
          <strong>Created At:</strong>{" "}
          {moment(task?.createdAt).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="body1" mb={1} color="text.primary">
          <strong>Updated At:</strong>{" "}
          {moment(task?.updatedAt).format("DD-MM-YYYY HH:mm")}
        </Typography>
        <Typography variant="body1" mb={1} color="text.primary">
          <strong>Status: </strong>{" "}
          {task.isCompleted
            ? "Success"
            : moment(task.deadline).isBefore(moment())
            ? "Failed"
            : "Ongoing"}
        </Typography>
        {!task.isCompleted && (
          <Typography variant="h6" mb={1} color="text.primary">
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
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [todoList, setTodoList] = useState<any>([]);
  const [taskFilters, setTaskFilters] = useState("All");
  const [addTask, setAddTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
      .patch(`${apiUrl}/tasks/${taskId}`, {
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
      .get(`${process.env.REACT_APP_API_BASE_URL}/tasks`)
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((err) => console.log(err));
  };


  const getFilteredTasks = () => {
    const now = moment();

    let filtered = todoList.filter((task: any) => {
      const deadline = moment(task.deadline);
      const matchesFilter =
        taskFilters === "All" ||
        (taskFilters === "Ongoing" &&
          !task.isCompleted &&
          deadline.isAfter(now)) ||
        (taskFilters === "Success" && task.isCompleted) ||
        (taskFilters === "Failure" &&
          !task.isCompleted &&
          deadline.isBefore(now));

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    filtered.sort((a: any, b: any) => {
      const timeA = moment(a.deadline).valueOf();
      const timeB = moment(b.deadline).valueOf();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    return filtered;
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
      <div className="flex justify-between lg:pt-10 lg:pb-2 py-6 items-center">
        <h1 className="font-serif lg:text-4xl text-2xl font-semibold text-[#765996]">
          Smart Todo
        </h1>

        <PrimaryBtn
          label="Add Task"
          bgColor={"#765996"}
          onClick={() => setAddTask(true)}
        />
      </div>

      <div className="flex flex-col lg:gap-4 gap-3">
        <div className="flex md:flex-row flex-col md:gap-6 gap-2 md:items-center md:justify-between">
          <h1 className="font-serif lg:text-3xl text-xl font-medium text-[#765996]">
            Task List ({filteredTasks.length})
          </h1>
          <div className="flex items-center lg:gap-6 gap-3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded lg:py-3 px-2 py-2 w-full md:text-lg"
            />
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-[#765996] text-white lg:py-3 py-2 rounded w-full text-sm md:text-base"
            >
              Sort by Deadline ({sortOrder === "asc" ? "Asc" : "Desc"})
            </button>
          </div>
        </div>

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
              <h1 className="font-serif lg:text-xl text-lg font-medium text-[#765996]">
                {item?.name}
              </h1>
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
