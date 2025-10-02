import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, updateTask, deleteTask } from '../api/taskApi';
import { AiOutlineCheck } from 'react-icons/ai';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate(); // <-- for Back button

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (task) => {
    const dayKey = selectedDate.toISOString().split("T")[0];
    const newStatus = task.dailyStatus?.[dayKey] === "complete" ? "incomplete" : "complete";

    const updatedTask = {
      ...task,
      dailyStatus: { ...task.dailyStatus, [dayKey]: newStatus }
    };

    await updateTask(task._id, updatedTask);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const uniqueTypes = ['All', ...new Set(tasks.map(task => task.type))];
  const dayKey = selectedDate.toISOString().split("T")[0];

  const filteredTasks = (filterType === 'All' ? tasks : tasks.filter(t => t.type === filterType))
    .map(task => ({ ...task, status: task.dailyStatus?.[dayKey] || "incomplete" }));

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // go back to previous page
        className="mb-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow transition"
      >
        ← Back
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-purple-700">
        Tasks for {selectedDate.toDateString()}
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-purple-300 p-2 rounded-md shadow-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-purple-300 p-2 rounded-md shadow-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="p-3 text-left uppercase tracking-wide">Task Name</th>
                <th className="p-3 text-left uppercase tracking-wide">Type</th>
                <th className="p-3 text-left uppercase tracking-wide">Date</th>
                <th className="p-3 text-center uppercase tracking-wide">Status</th>
                <th className="p-3 text-center uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task._id} className="border-t hover:bg-purple-50 transition">
                  <td className="p-3 truncate max-w-[150px]">{task.title}</td>
                  <td className="p-3 truncate max-w-[100px]">{task.type}</td>
                  <td className="p-3 truncate max-w-[150px]">
                    {task.date}{task.endDate && task.endDate !== task.date ? ` - ${task.endDate}` : ''}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleStatusChange(task)}
                      className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full transition
                        ${task.status === 'complete' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {task.status === 'complete' && <AiOutlineCheck className="text-xl" />}
                    </button>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500 italic">
                    No tasks found for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
