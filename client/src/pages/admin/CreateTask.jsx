import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import { useApi } from "../../context/ApiProvider";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

export default function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();
  const { api } = useApi();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await api.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task created successfully");
      clearData();

    } catch(error) {
      console.error(`Error at createTask: ${error}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await api.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        {
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );

      toast.success("Task Updated Successfully");
    } catch(error) {
      console.error(`Error at updateTask: ${error}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Input validation
    for (const [key, value] of Object.entries(taskData)) {
      if (["title", "description"].includes(key)) {
        if (!value.trim()) {
          setError(`${key} is required`);
          return;
        }
      }
      else if (key == "dueDate") {
        if (!value) {
          setError(`${key} is required`);
          return;
        }
      }
      else if (["assignedTo", "todoChecklist"].includes(key)) {
        if (value.length === 0) {
          const msg = 
          key == "assignedTo" ? "Task not assigned to any member" 
          : "Add atleast one todo task";
          setError(msg);
          return;
        }
      }
    }

    if (taskId) {
      updateTask();
      return;
    }

    createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await api.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if(response.data) {
        const taskInfo = response?.data?.data?.task;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch(error) {
      console.log(`Error at getTaskDetailsByID: ${error}`);
    }
  };

  const deleteTask = async () => {
    try {
      await api.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error(`Error at deleteTask: ${error}, error message: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    if(taskId) {
      getTaskDetailsByID(taskId);
    }

    return () => {};
  }, [taskId])

  return (
    <DashboardLayout activeMenu={"Create Task"}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                </button>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                type="text"
                placeholder="Create App UI"
                className="form-input"
                value={taskData?.title}
                onChange={({ currentTarget }) =>
                  handleValueChange("title", currentTarget.value)
                }
              />
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                name=""
                id=""
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ currentTarget }) =>
                  handleValueChange("description", currentTarget.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label
                  htmlFor=""
                  className="text-xs font-medium text-slate-600"
                >
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label
                  htmlFor=""
                  className="text-xs font-medium text-slate-600"
                >
                  Due Date
                </label>

                <input
                  type="date"
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskData.dueDate === null ? "" : taskData.dueDate}
                  onChange={({ currentTarget }) =>
                    handleValueChange("dueDate", currentTarget.value)
                  }
                />
              </div>
              <div className="col-span-12 md:col-span-3">
                <label
                  htmlFor=""
                  className="text-xs font-medium text-slate-600"
                >
                  Assign To
                </label>

                <SelectUsers
                  selectedUsers = {taskData.assignedTo}
                  setSelectedUsers = { (value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput
                todoList={taskData?.todoChecklist}
                setTodoList={(value) => 
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label htmlFor="" className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput 
                attachments={taskData?.attachments}
                setAttachments={(value) => handleValueChange("attachments", value)}
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button 
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title={"Delete Task"}
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
}
