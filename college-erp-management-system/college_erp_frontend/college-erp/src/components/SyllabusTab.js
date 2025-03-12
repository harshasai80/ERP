import React, { useState, useEffect } from "react";
import { syllabusData } from "./Data/demoData";
import Alert from "./Alert";

function SyllabusTab() {
  const [classId, setClassId] = useState("");
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [topicDate, setTopicDate] = useState("");
  const [topicTime, setTopicTime] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (classId) {
      loadSyllabus();
    }
  }, [classId]);

  const loadSyllabus = () => {
    if (!classId) return;

    if (syllabusData[classId]) {
      setTopics([...syllabusData[classId]]);

      // Calculate progress
      const completedCount = syllabusData[classId].filter(
        (topic) => topic.status === "completed"
      ).length;
      const percentage = Math.round(
        (completedCount / syllabusData[classId].length) * 100
      );
      setProgressPercentage(percentage);
    } else {
      setTopics([]);
      setProgressPercentage(0);
    }
  };

  const updateTopic = (index) => {
    // In a real app, you would send this data to the server
    const topic = topics[index];
    showAlert(
      `Topic "${topic.topic}" updated to ${topic.status} with planned date ${topic.date}`,
      "success"
    );

    // Update local data copy
    const updatedTopics = [...topics];

    // Update in the original data source (just for demo purposes)
    if (syllabusData[classId]) {
      syllabusData[classId] = updatedTopics;
    }

    // Recalculate progress
    const completedCount = updatedTopics.filter(
      (topic) => topic.status === "completed"
    ).length;
    const percentage = Math.round(
      (completedCount / updatedTopics.length) * 100
    );
    setProgressPercentage(percentage);
  };

  const handleStatusChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index].status = value;
    setTopics(updatedTopics);
  };

  const handleDateChange = (index, value) => {
    const updatedTopics = [...topics];
    updatedTopics[index].date = value;
    setTopics(updatedTopics);
  };

  const addTopic = () => {
    if (!classId) {
      showAlert("Please select a class", "error");
      return;
    }

    if (!newTopic.trim()) {
      showAlert("Please enter a topic name", "error");
      return;
    }

    if (!topicDate) {
      showAlert("Please select a planned date", "error");
      return;
    }

    const newTopicObj = {
      topic: newTopic,
      status: "pending",
      date: topicDate,
    };

    // Add to local state
    const updatedTopics = [...topics, newTopicObj];
    setTopics(updatedTopics);

    // Update in the original data source (just for demo purposes)
    if (syllabusData[classId]) {
      syllabusData[classId] = updatedTopics;
    }

    showAlert(
      `New topic "${newTopic}" added with planned date ${topicDate} at ${topicTime}`,
      "success"
    );

    // Reset form fields
    setNewTopic("");
    setTopicDate("");
    setTopicTime("");

    // Recalculate progress
    const completedCount = updatedTopics.filter(
      (topic) => topic.status === "completed"
    ).length;
    const percentage = Math.round(
      (completedCount / updatedTopics.length) * 100
    );
    setProgressPercentage(percentage);
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });

    // Hide alert after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-md mt-5">
      <h2 className="text-xl font-bold mb-4">Syllabus Management</h2>

      <div className="mb-4">
        <label htmlFor="syllabus-class" className="block mb-2">
          Select Class:
        </label>
        <select
          id="syllabus-class"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full p-2.5 border border-gray-300 rounded-md"
        >
          <option value="">Select a class</option>
          <option value="cse101">CSE101 - Introduction to Computing</option>
          <option value="cse201">CSE201 - Data Structures</option>
          <option value="cse301">CSE301 - Database Systems</option>
        </select>
      </div>

      {classId && (
        <div id="syllabus-content">
          <div className="my-5">
            <h3 className="text-lg font-semibold mb-2">
              Syllabus Completion Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-md h-6">
              <div
                className="h-full bg-blue-500 rounded-md text-center text-white leading-6"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage}%
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Topics</h3>
            <table className="w-full border-collapse my-5">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                    Topic
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                    Planned Date
                  </th>
                  <th className="border border-gray-300 p-3 bg-gray-700 text-white text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {topics.map((topic, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border border-gray-300 p-3">
                      {topic.topic}
                    </td>
                    <td className="border border-gray-300 p-3">
                      <select
                        value={topic.status}
                        onChange={(e) =>
                          handleStatusChange(index, e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-md"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="border border-gray-300 p-3">
                      <input
                        type="date"
                        value={topic.date}
                        onChange={(e) =>
                          handleDateChange(index, e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="border border-gray-300 p-3">
                      <button
                        onClick={() => updateTopic(index)}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Add New Topic</h3>
            <div className="mb-4">
              <label htmlFor="new-topic" className="block mb-2">
                Topic Name:
              </label>
              <input
                type="text"
                id="new-topic"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="topic-date" className="block mb-2">
                Planned Date:
              </label>
              <input
                type="date"
                id="topic-date"
                value={topicDate}
                onChange={(e) => setTopicDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="topic-time" className="block mb-2">
                Lecture Time:
              </label>
              <input
                type="time"
                id="topic-time"
                value={topicTime}
                onChange={(e) => setTopicTime(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={addTopic}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Add Topic
            </button>
          </div>
        </div>
      )}

      {alert.show && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default SyllabusTab;
