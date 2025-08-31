import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBook,
  FaChartLine,
  FaClock,
  FaUser,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTrophy,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Mock API function to simulate your attendance data
const mockAttendanceData = [
  {
    id: 59,
    student: {
      id: 6,
      name: "Hafiza Muskan",
      registrationNumber: "459cs22035",
      section: "A",
      department: "DCS",
      sem: 2,
    },
    attendanceDate: "2025-08-27",
    sessions:
      '[{"batch": null, "status": "present", "session": 1, "subjectId": 12}, {"batch": null, "status": "present", "session": 2, "subjectId": 12}, {"batch": null, "status": "present", "session": 3, "subjectId": 12}, {"batch": null, "status": "present", "session": 4, "subjectId": 12}, {"batch": null, "status": "present", "session": 5, "subjectId": 12}, {"batch": null, "status": "present", "session": 6, "subjectId": 12}, {"batch": null, "status": "present", "session": 7, "subjectId": 12}, {"batch": null, "status": "present", "session": 8, "subjectId": 12}]',
    batches: null,
  },
  {
    id: 60,
    attendanceDate: "2025-08-26",
    sessions:
      '[{"batch": null, "status": "present", "session": 1, "subjectId": 12}, {"batch": null, "status": "absent", "session": 2, "subjectId": 12}, {"batch": null, "status": "present", "session": 3, "subjectId": 12}, {"batch": null, "status": "present", "session": 4, "subjectId": 12}, {"batch": null, "status": "absent", "session": 5, "subjectId": 12}, {"batch": null, "status": "present", "session": 6, "subjectId": 12}, {"batch": null, "status": "present", "session": 7, "subjectId": 12}, {"batch": null, "status": "present", "session": 8, "subjectId": 12}]',
  },
  {
    id: 61,
    attendanceDate: "2025-08-25",
    sessions:
      '[{"batch": null, "status": "present", "session": 1, "subjectId": 12}, {"batch": null, "status": "present", "session": 2, "subjectId": 12}, {"batch": null, "status": "absent", "session": 3, "subjectId": 12}, {"batch": null, "status": "absent", "session": 4, "subjectId": 12}, {"batch": null, "status": "present", "session": 5, "subjectId": 12}, {"batch": null, "status": "present", "session": 6, "subjectId": 12}, {"batch": null, "status": "present", "session": 7, "subjectId": 12}, {"batch": null, "status": "present", "session": 8, "subjectId": 12}]',
  },
  {
    id: 62,
    attendanceDate: "2025-08-24",
    sessions:
      '[{"batch": null, "status": "absent", "session": 1, "subjectId": 12}, {"batch": null, "status": "absent", "session": 2, "subjectId": 12}, {"batch": null, "status": "absent", "session": 3, "subjectId": 12}, {"batch": null, "status": "absent", "session": 4, "subjectId": 12}, {"batch": null, "status": "absent", "session": 5, "subjectId": 12}, {"batch": null, "status": "absent", "session": 6, "subjectId": 12}, {"batch": null, "status": "absent", "session": 7, "subjectId": 12}, {"batch": null, "status": "absent", "session": 8, "subjectId": 12}]',
  },
  {
    id: 63,
    attendanceDate: "2025-08-23",
    sessions:
      '[{"batch": null, "status": "present", "session": 1, "subjectId": 12}, {"batch": null, "status": "present", "session": 2, "subjectId": 12}, {"batch": null, "status": "present", "session": 3, "subjectId": 12}, {"batch": null, "status": "present", "session": 4, "subjectId": 12}, {"batch": null, "status": "present", "session": 5, "subjectId": 12}, {"batch": null, "status": "present", "session": 6, "subjectId": 12}, {"batch": null, "status": "present", "session": 7, "subjectId": 12}, {"batch": null, "status": "present", "session": 8, "subjectId": 12}]',
  },
];

const realAttendance = async () => {
  try {
    const response = await fetch("/api/attendance");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return [];
  }
}

// Attendance Calculator Hook
const useAttendanceCalculations = (attendanceData) => {
  return React.useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) {
      return {
        overallPercentage: 0,
        totalSessions: 0,
        presentSessions: 0,
        absentSessions: 0,
        recentTrend: "stable",
        academicStatus: "inactive",
        dailyAttendance: [],
        weeklyStats: { present: 0, absent: 0 },
      };
    }

    let totalSessions = 0;
    let presentSessions = 0;
    let absentSessions = 0;
    const dailyAttendance = [];
    const recentDays = [];

    attendanceData.forEach((record) => {
      const sessions = JSON.parse(record.sessions);
      let dayPresent = 0;
      let dayTotal = sessions.length;

      sessions.forEach((session) => {
        totalSessions++;
        if (session.status === "present") {
          presentSessions++;
          dayPresent++;
        } else if (session.status === "absent") {
          absentSessions++;
        }
      });

      const dayPercentage = dayTotal > 0 ? (dayPresent / dayTotal) * 100 : 0;
      dailyAttendance.push({
        date: record.attendanceDate,
        percentage: Math.round(dayPercentage),
        present: dayPresent,
        total: dayTotal,
        sessions: sessions,
      });

      recentDays.push(dayPercentage);
    });

    const overallPercentage =
      totalSessions > 0
        ? Math.round((presentSessions / totalSessions) * 100)
        : 0;

    // Calculate trend (comparing recent 2 days vs previous 2 days)
    let recentTrend = "stable";
    if (recentDays.length >= 4) {
      const recent = (recentDays[0] + recentDays[1]) / 2;
      const previous = (recentDays[2] + recentDays[3]) / 2;
      if (recent > previous + 5) recentTrend = "improving";
      else if (recent < previous - 5) recentTrend = "declining";
    }

    // Academic Status based on attendance percentage
    let academicStatus = "inactive";
    if (overallPercentage >= 85) academicStatus = "excellent";
    else if (overallPercentage >= 75) academicStatus = "active";
    else if (overallPercentage >= 65) academicStatus = "warning";
    else academicStatus = "critical";

    // Weekly stats (last 7 records)
    const weeklyData = dailyAttendance.slice(0, 7);
    const weeklyStats = weeklyData.reduce(
      (acc, day) => {
        acc.present += day.present;
        acc.total += day.total;
        return acc;
      },
      { present: 0, total: 0 }
    );
    weeklyStats.absent = weeklyStats.total - weeklyStats.present;

    return {
      overallPercentage,
      totalSessions,
      presentSessions,
      absentSessions,
      recentTrend,
      academicStatus,
      dailyAttendance,
      weeklyStats,
    };
  }, [attendanceData]);
};

// Generate dynamic recent activities based on attendance data
const generateRecentActivities = (attendanceStats) => {
  const activities = [];
  const today = new Date();

  if (attendanceStats.dailyAttendance.length > 0) {
    const latestDay = attendanceStats.dailyAttendance[0];
    const daysDiff = Math.floor(
      (today - new Date(latestDay.date)) / (1000 * 60 * 60 * 24)
    );

    activities.push({
      title: "Attendance Updated",
      description: `${latestDay.present}/${latestDay.total} sessions attended (${latestDay.percentage}%)`,
      time:
        daysDiff === 0
          ? "Today"
          : daysDiff === 1
          ? "Yesterday"
          : `${daysDiff} days ago`,
      type: latestDay.percentage >= 75 ? "success" : "warning",
    });
  }

  if (attendanceStats.recentTrend === "improving") {
    activities.push({
      title: "Attendance Improving",
      description: "Your attendance trend is positive this week",
      time: "This week",
      type: "success",
    });
  } else if (attendanceStats.recentTrend === "declining") {
    activities.push({
      title: "Attendance Alert",
      description: "Your attendance has declined recently",
      time: "This week",
      type: "warning",
    });
  }

  if (attendanceStats.overallPercentage >= 85) {
    activities.push({
      title: "Achievement Unlocked",
      description: "Excellent attendance record maintained",
      time: "Ongoing",
      type: "success",
    });
  }

  // Add some sample academic activities
  activities.push({
    title: "New Assignment Posted",
    description: "Data Structures - Assignment 3",
    time: "2 days ago",
    type: "info",
  });

  return activities.slice(0, 4); // Limit to 4 activities
};

// Dashboard overview cards with real calculations
const DashboardOverview = ({ student, attendanceData }) => {
  const attendanceStats = useAttendanceCalculations(attendanceData);
  const recentActivities = generateRecentActivities(attendanceStats);

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-green-400";
      case "active":
        return "text-emerald-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "active":
        return "Active";
      case "warning":
        return "Need Improvement";
      case "critical":
        return "Critical";
      default:
        return "Inactive";
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === "improving") return "📈";
    if (trend === "declining") return "📉";
    return "📊";
  };

  const cards = [
    {
      title: "Student Profile",
      icon: FaUser,
      content: (
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-emerald-300">
            {student?.name?.toUpperCase() || "HAFIZA MUSKAN"}
          </h3>
          <p className="text-gray-300 text-sm">
            Registration:{" "}
            {student?.registrationNumber?.toUpperCase() || "459CS22035"}
          </p>
          <div className="flex gap-2 text-sm">
            <span className="bg-emerald-700 px-2 py-1 rounded">
              {student?.department || "DCS"}
            </span>
            <span className="bg-emerald-700 px-2 py-1 rounded">
              Sem {student?.sem || "2"}
            </span>
            <span className="bg-emerald-700 px-2 py-1 rounded">
              Sec {student?.section || "A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Attendance Analytics",
      icon: FaChartLine,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Overall Attendance</span>
            <span
              className={`font-bold text-lg ${
                attendanceStats.overallPercentage >= 75
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {attendanceStats.overallPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                attendanceStats.overallPercentage >= 75
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${attendanceStats.overallPercentage}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-green-900/30 rounded">
              <div className="text-green-400 font-bold">
                {attendanceStats.presentSessions}
              </div>
              <div className="text-gray-400">Present</div>
            </div>
            <div className="text-center p-2 bg-red-900/30 rounded">
              <div className="text-red-400 font-bold">
                {attendanceStats.absentSessions}
              </div>
              <div className="text-gray-400">Absent</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Trend</span>
            <span className="flex items-center gap-1">
              {getTrendIcon(attendanceStats.recentTrend)}
              <span
                className={
                  attendanceStats.recentTrend === "improving"
                    ? "text-green-400"
                    : attendanceStats.recentTrend === "declining"
                    ? "text-red-400"
                    : "text-gray-400"
                }
              >
                {attendanceStats.recentTrend.charAt(0).toUpperCase() +
                  attendanceStats.recentTrend.slice(1)}
              </span>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Academic Status",
      icon: FaBook,
      content: (
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-700/30 rounded-lg">
            <div
              className={`text-2xl font-bold ${getStatusColor(
                attendanceStats.academicStatus
              )}`}
            >
              {getStatusText(attendanceStats.academicStatus)}
            </div>
            <div className="text-gray-400 text-sm mt-1">Current Status</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Total Sessions</span>
              <span className="text-white font-medium">
                {attendanceStats.totalSessions}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Days Tracked</span>
              <span className="text-white font-medium">
                {attendanceStats.dailyAttendance.length}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Weekly Average</span>
              <span className="text-white font-medium">
                {attendanceStats.weeklyStats.total > 0
                  ? Math.round(
                      (attendanceStats.weeklyStats.present /
                        attendanceStats.weeklyStats.total) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {attendanceStats.overallPercentage < 75 && (
            <div className="bg-red-900/20 border border-red-700/30 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <FaExclamationTriangle />
                <span className="font-medium">Action Required</span>
              </div>
              <p className="text-red-300 text-xs mt-1">
                Attendance below 75% threshold
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome Back,{" "}
          <span className="text-emerald-400">
            {student?.name?.split(" ")[0] || "Hafiza"}
          </span>
        </h1>
        <p className="text-gray-400">
          Here's your academic overview with live attendance data
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <IconComponent className="text-white text-lg" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {card.title}
                </h2>
              </div>
              {card.content}
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity with Dynamic Data */}
      <motion.div
        className="mt-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <FaClock className="text-white text-lg" />
          </div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-400"
                      : activity.type === "warning"
                      ? "bg-yellow-400"
                      : activity.type === "info"
                      ? "bg-blue-400"
                      : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm">
                    {activity.description}
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Stats Summary */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {[
          {
            label: "Total Days",
            value: attendanceStats.dailyAttendance.length,
            icon: FaCalendarCheck,
            color: "blue",
          },
          {
            label: "Present Days",
            value: attendanceStats.dailyAttendance.filter(
              (d) => d.percentage > 50
            ).length,
            icon: FaCheckCircle,
            color: "green",
          },
          {
            label: "Perfect Days",
            value: attendanceStats.dailyAttendance.filter(
              (d) => d.percentage === 100
            ).length,
            icon: FaTrophy,
            color: "yellow",
          },
          {
            label: "Attendance Rate",
            value: `${attendanceStats.overallPercentage}%`,
            icon: FaGraduationCap,
            color: attendanceStats.overallPercentage >= 75 ? "green" : "red",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-4 rounded-lg border border-gray-700/30 text-center`}
          >
            <stat.icon
              className={`text-2xl mx-auto mb-2 ${
                stat.color === "blue"
                  ? "text-blue-400"
                  : stat.color === "green"
                  ? "text-green-400"
                  : stat.color === "yellow"
                  ? "text-yellow-400"
                  : stat.color === "red"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNavbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: "Dashboard", icon: FaUser },
    { name: "Attendance", icon: FaCalendarCheck },
    { name: "Results", icon: FaBook },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                activeTab === item.name
                  ? "text-emerald-400 bg-emerald-600/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IconComponent className="text-xl mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function DynamicStudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock student data - in real app this comes from your location.state or localStorage
  const student = {
    id: 6,
    name: "Hafiza Muskan",
    registrationNumber: "459cs22035",
    section: "A",
    department: "DCS",
    sem: 2,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-emerald-800/5 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 bg-gray-900/90 backdrop-blur-sm shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              <span className="hidden sm:inline">
                Sanjay Gandhi Polytechnic
              </span>
              <span className="inline sm:hidden">SGP ERP</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium text-sm">
                {student?.name?.toUpperCase() || "N/A"}
              </p>
              <p className="text-gray-400 text-xs">
                {student?.registrationNumber?.toUpperCase() || "N/A"}
              </p>
            </div>
            <FaUserCircle className="text-emerald-400 text-3xl" />
            <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Logout
            </button>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button className="bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg text-white text-sm font-medium">
              Logout
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-xl p-2"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-4 pb-4 bg-gray-800/50 border-t border-gray-700/50"
            >
              <div className="flex items-center gap-3 pt-3">
                <FaUserCircle className="text-emerald-400 text-3xl" />
                <div>
                  <p className="text-white font-medium">
                    {student?.name?.toUpperCase() || "N/A"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {student?.registrationNumber?.toUpperCase() || "N/A"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {student?.sem || "N/A"} Sem • {student?.section || "N/A"}{" "}
                    Sec
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Marquee */}
      <div className="bg-emerald-600/20 py-2 border-b border-emerald-500/30">
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-emerald-300 text-sm">
            Welcome to SGP ERP Portal • Check your attendance regularly •
            Maintain 75% attendance for eligibility • New features coming soon •
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow px-4 py-6 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "Dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardOverview
                student={student}
                attendanceData={mockAttendanceData}
              />
            </motion.div>
          )}

          {activeTab === "Attendance" && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/30 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-emerald-300 mb-4">
                    Attendance Dashboard
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Your attendance component would be integrated here
                  </p>

                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Attendance Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-900/30 p-4 rounded-lg">
                        <div className="text-green-400 text-2xl font-bold">
                          87%
                        </div>
                        <div className="text-gray-300 text-sm">
                          Overall Attendance
                        </div>
                      </div>
                      <div className="bg-blue-900/30 p-4 rounded-lg">
                        <div className="text-blue-400 text-2xl font-bold">
                          32
                        </div>
                        <div className="text-gray-300 text-sm">
                          Total Sessions
                        </div>
                      </div>
                      <div className="bg-emerald-900/30 p-4 rounded-lg">
                        <div className="text-emerald-400 text-2xl font-bold">
                          28
                        </div>
                        <div className="text-gray-300 text-sm">
                          Present Sessions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-600/30 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-emerald-300 mb-4">
                    Academic Results
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Your IA marks component would be integrated here
                  </p>

                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Latest Results
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-600/30 rounded">
                        <span className="text-gray-300">Data Structures</span>
                        <span className="text-emerald-400 font-bold">
                          85/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-600/30 rounded">
                        <span className="text-gray-300">Computer Networks</span>
                        <span className="text-emerald-400 font-bold">
                          78/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-600/30 rounded">
                        <span className="text-gray-300">
                          Database Management
                        </span>
                        <span className="text-emerald-400 font-bold">
                          92/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
