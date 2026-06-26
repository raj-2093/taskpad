import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useApi } from "../../context/ApiProvider";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { addThousandSeparators } from "../../utils/helper";
import InfoCard from "../../components/cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/charts/CustomPieChart";
import CustomBarChart from "../../components/charts/CustomBarChart";

const COLORS = ["#8D51FF", "#00B8D8", "#7BCE00"];

export default function Dashboard() {
  const { user, api } = useApi();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const cookChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const priorityLevelData = [
      { Priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { Priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { Priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(priorityLevelData);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      if (response.data.data) {
        setDashboardData(response.data.data);
        cookChartData(response.data.data?.charts || null);
      }
    } catch (error) {
      console.error(`Error at fetchDashboardData: ${error}`);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks');
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu={"Dashboard"}>
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
            ! {user?.name}
          </h2>
          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.All || 0)}
            color="bg-primary"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.Pending || 0)}
            color="bg-violet-500"
          />
          <InfoCard
            label="Tasks In Progress"
            value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandSeparators(dashboardData?.charts?.taskDistribution?.Completed || 0)}
            color="bg-lime-500  "
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">

        <div>
          <div className="card">
            <div className="flex items justify-between">
              <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPieChart
              data={pieChartData}
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items justify-between">
              <h5 className="font-medium">Task Priority Levels</h5>
            </div>

            <CustomBarChart
              data={pieChartData}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
