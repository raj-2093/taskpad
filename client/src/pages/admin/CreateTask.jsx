import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";

export default function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

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

  const createTask = async () => {};

  const updateTask = async () => {};

  const handleSubmit = async () => {};

  const getTaskDetailsByID = async () => {};

  const deleteTask = async () => {};

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

            <div className="">
              <label htmlFor="" className="">Add Attachments</label>

              
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
