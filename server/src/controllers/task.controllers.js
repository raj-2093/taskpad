import { Task } from "../models/Task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS_CODE } from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let filter = {};

  if (status) {
    filter.status = status;
  }

  let tasks;

  if (req.user.role === "admin") {
    tasks = await Task.find(filter).populate(
      "assignedTo",
      "name email profileImageUrl",
    );
  } else {
    tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
      "assignedTo",
      "name email profileImageUrl",
    );
  }

  tasks = await Promise.all(
    tasks.map(async (task) => {
      const completedCount = task.todoChecklist.filter(
        (item) => item.completed,
      ).length;
      return { ...task._doc, completedTodoCount: completedCount };
    }),
  );

  const allTasks = await Task.countDocuments(
    req.user.role === "admin" ? {} : { assignedTo: req.user._id },
  );

  const pendingTasks = await Task.countDocuments({
    ...filter,
    status: "Pending",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
  });

  const inProgressTasks = await Task.countDocuments({
    ...filter,
    status: "In Progress",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
  });

  const completedTasks = await Task.countDocuments({
    ...filter,
    status: "Completed",
    ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
  });

  return res.status(STATUS_CODE.RESOURCE_FETCHED).json(
    new ApiResponse(
      STATUS_CODE.RESOURCE_FETCHED,
      "Tasks fetched successfully",
      {
        tasks,
        statusSummary: {
          all: allTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        },
      },
    ),
  );
}, "getTasks");

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl",
  );

  if (!task)
    return res.status(STATUS_CODE.RESOURCE_NOT_FOUND).json(new ApiResponse(404, "Task not found"));

  return res
    .status(STATUS_CODE.RESOURCE_FETCHED)
    .json(new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "Task fetched successfully", {
      task,
    }));
}, "getTaskById");

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    attachments,
    todoChecklist,
  } = req.body;

  if (!Array.isArray(assignedTo)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "assignedTo must be an array of user IDs"));
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    createdBy: req.user._id,
    todoChecklist,
    attachments,
  });

  return res
    .status(STATUS_CODE.RESOURCE_CREATED)
    .json(
      new ApiResponse(
        STATUS_CODE.RESOURCE_CREATED,
        "Task created successfully",
        { task },
      ),
    );
}, "createTask");

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task)
    return res.status(404).json(new ApiResponse(404, "Task not found"));

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
  task.attachments = req.body.attachments || task.attachments;

  if (req.body.assignedTo) {
    if (!Array.isArray(req.body.assignedTo)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          new ApiResponse(
            STATUS_CODE.BAD_REQUEST,
            "assignedTo must be an array of user IDs",
          ),
        );
    }

    task.assignedTo = req.body.assignedTo;
  }

  const updatedTask = await task.save();

  return res
    .status(STATUS_CODE.RESOURCE_UPDATED)
    .json(
      new ApiResponse(
        STATUS_CODE.RESOURCE_UPDATED,
        "Task updated successfully",
        { task: updatedTask },
      ),
    );
}, "updateTask");

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task)
    return res
      .status(STATUS_CODE.RESOURCE_NOT_FOUND)
      .json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "Task not found"));

  await task.deleteOne();
  return res
    .status(STATUS_CODE.RESOURCE_DELETED)
    .json(
      new ApiResponse(
        STATUS_CODE.RESOURCE_DELETED,
        "Task deleted successfully",
      ),
    );
}, "deleteTask");

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task)
    return res
      .status(STATUS_CODE.RESOURCE_NOT_FOUND)
      .json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "Task not found"));

  const isAssigned = task.assignedTo.some(
    (userId) => userId.toString() === req.user._id.toString(),
  );

  if (!isAssigned && req.user.role !== "admin")
    return res
      .status(STATUS_CODE.RESOURCE_FORBIDDEN)
      .json(new ApiResponse(STATUS_CODE.RESOURCE_FORBIDDEN, "Not authorized"));

  task.status = req.body.status || task.status;

  if (task.status === "Completed") {
    task.todoChecklist.forEach((item) => (item.completed = true));
    task.progress = 100;
  }

  await task.save();

  return res
    .status(STATUS_CODE.RESOURCE_UPDATED)
    .json(new ApiResponse(STATUS_CODE.RESOURCE_UPDATED, "Task status updated"));
}, "updateTaskStatus");

const updateTaskChecklist = asyncHandler(async (req, res) => {
  const { todoChecklist } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task)
    return res
      .status(STATUS_CODE.RESOURCE_NOT_FOUND)
      .json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "Task not found"));

  if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
    return res
      .status(STATUS_CODE.RESOURCE_FORBIDDEN)
      .json(new ApiResponse(STATUS_CODE.RESOURCE_FORBIDDEN, "Not authorized"));
  }

  task.todoChecklist = todoChecklist;

  const completedCount = task.todoChecklist.filter(
    (item) => item.completed,
  ).length;
  const totalItems = task.todoChecklist.length;
  task.progress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  if (task.progress === 100) {
    task.status = "Completed";
  } else if (task.progress > 0) {
    task.status = "In Progress";
  } else {
    task.status = "Pending";
  }

  await task.save();

  const updatedTask = await Task.findById(req.params.id).populate(
    "assignedTo",
    "name email profileImageUrl",
  );

  return res.status(STATUS_CODE.RESOURCE_UPDATED).json(
    new ApiResponse(STATUS_CODE.RESOURCE_UPDATED, "Task checklist updated", {
      task: updatedTask,
    }),
  );
}, "updateTaskChecklist");

const getDashboardData = asyncHandler(async (req, res) => {
  const totalTasks = await Task.countDocuments();
  const pendingTasks = await Task.countDocuments({
    status: "Pending",
  });
  const completedTasks = await Task.countDocuments({
    status: "Completed",
  });
  const overdueTasks = await Task.countDocuments({
    status: { $ne: "Completed" },
    dueDate: { $lt: new Date() },
  });

  // Ensure all possible statuses are included
  const taskStatuses = ["Pending", "In Progress", "Completed"];
  const taskDistributionRaw = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const taskDistribution = taskStatuses.reduce((acc, status) => {
    const formattedKey = status.replace(/\s+/g, "");
    acc[formattedKey] =
      taskDistributionRaw.find((item) => item._id === status)?.count || 0;
    return acc;
  }, {});
  taskDistribution["All"] = totalTasks;

  const taskPriorities = ["Low", "Medium", "High"];
  const taskPriorityLevelsRaw = await Task.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
    acc[priority] =
      taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
    return acc;
  }, {});

  const recentTasks = await Task.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

  return res.status(STATUS_CODE.RESOURCE_FETCHED).json(new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "Dashboard data sent successfully", {
    statistics: {
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks
    },
    charts: {
      taskDistribution,
      taskPriorityLevels
    },
    recentTasks
  }));
}, "getDashboardData");

const getUserDashboardData = asyncHandler(
  async (req, res) => {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Task distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find({ assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title status priority dueDate createdAt");

    return res.status(STATUS_CODE.RESOURCE_FETCHED).json(new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "User dashboard data fetched successfully", {
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    }));
  
  },
  "getUserDashboardData",
);

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
