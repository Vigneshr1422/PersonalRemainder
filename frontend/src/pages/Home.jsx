import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTask from "../components/AddTask";
import { getTasks, addTask } from "../api/taskApi";
import { AiOutlineCalendar } from "react-icons/ai";

// update status API
const updateTaskStatus = async (id, date, status) => {
  try {
    const res = await fetch(
      `https://personalremainder.onrender.com/tasks/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyStatus: { [date]: status } }),
      }
    );
    return await res.json();
  } catch (err) {
    console.error("Failed to update task status", err);
  }
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [taskTypes, setTaskTypes] = useState([
    "Aptitude",
    "Coding",
    "Personal",
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openTask, setOpenTask] = useState(null);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  // fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // add task
  const handleAdd = async (task) => {
    if (!taskTypes.includes(task.type))
      setTaskTypes((prev) => [...prev, task.type]);
    await addTask(task);
    fetchTasks();
    setShowAdd(false);
  };

  const today = new Date();

  // tasks in calendar cell
  const tasksOnDay = (day) => {
    if (!day) return [];
    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayStr = dayDate.toISOString().split("T")[0];
    return tasks
      .filter((task) => {
        const start = new Date(task.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(task.endDate || task.date);
        end.setHours(23, 59, 59, 999);
        return start <= dayDate && dayDate <= end;
      })
      .map((task) => ({
        ...task,
        status: task.dailyStatus?.[dayStr] || "incomplete",
      }));
  };

  // selected day tasks
  const selectedTasks = tasks
    .filter((task) => {
      const start = new Date(task.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(task.endDate || task.date);
      end.setHours(23, 59, 59, 999);
      return start <= selectedDate && selectedDate <= end;
    })
    .map((task) => {
      const dateStr = selectedDate.toISOString().split("T")[0];
      return {
        ...task,
        status: task.dailyStatus?.[dateStr] || "incomplete",
      };
    });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const goPrevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const goNextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDate(new Date(year, month, day));
  };

  // toggle task status
  const toggleTaskStatus = async (task) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const newStatus =
      task.status === "complete" ? "incomplete" : "complete";
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? {
              ...t,
              dailyStatus: { ...t.dailyStatus, [dateStr]: newStatus },
            }
          : t
      )
    );
    await updateTaskStatus(task._id, dateStr, newStatus);
  };

  // fetch note for task
  const fetchNote = async (taskId) => {
    try {
      const res = await fetch(
        `https://personalremainder.onrender.com/messages/${taskId}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setNote(data[data.length - 1].content);
      } else {
        setNote("");
      }
    } catch (err) {
      console.error("Failed to fetch note", err);
    }
  };

  // save note
  const saveNote = async () => {
    if (!note.trim() || !openTask) return;
    try {
      await fetch(
        `https://personalremainder.onrender.com/messages/${openTask._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: note }),
        }
      );
      setOpenTask(null);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 flex items-center justify-center gap-2 text-gradient bg-clip-text text- bg-gradient-to-r from-purple-500 to-pink-500">
        <AiOutlineCalendar className="text-4xl md:text-5xl" />
        Task Dashboard
      </h1>
      <div className="overflow-hidden bg-purple-100 rounded-lg p-2 mb-4">
  <div className="flex animate-marquee">
    <p className="text-purple-700 font-bold whitespace-nowrap mr-8">
      💻 Intha Website aa Build pannathu ungal Vignesh 🪄💖
    </p>
  </div>
</div>


      {/* Calendar Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-2 sm:gap-0">
        <button
          onClick={goPrevMonth}
          className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto"
        >
          ⬅ Prev
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </h2>
        <button
          onClick={goNextMonth}
          className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto"
        >
          Next ➡
        </button>
      </div>

      {/* Main content: Calendar 3/4 + Task details 1/4 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar */}
        <div className="w-full lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
              {calendarDays.map((day, idx) => {
                if (!day)
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 p-2 rounded-xl pointer-events-none"
                    ></div>
                  );
                const dayDate = new Date(year, month, day);
                const dayStr = dayDate.toISOString().split("T")[0];
                const isToday =
                  dayDate.toDateString() === today.toDateString();
                const isSelected =
                  dayDate.toDateString() === selectedDate.toDateString();
                const dayTasks = tasksOnDay(day);

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    className={`p-2 rounded-xl shadow-md flex flex-col transition cursor-pointer bg-white hover:bg-purple-50
                      ${
                        isToday ? "border-2 border-purple-500" : ""
                      } ${isSelected ? "ring-2 ring-pink-500" : ""}`}
                  >
                    <div
                      className={`text-base sm:text-lg font-bold ${
                        isToday ? "text-purple-600" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="mt-2 space-y-1 overflow-hidden max-h-32">
                      {dayTasks.length > 0 ? (
                        dayTasks.map((task) => (
                          <div
                            key={task._id}
                            className="p-1 text-sm rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition bg-gradient-to-r from-purple-100 to-pink-100"
                          >
                            <span className="truncate">{task.title}</span>
                            <span
                              className="ml-2 text-sm cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskStatus(task);
                              }}
                            >
                              {task.status === "complete" ? "✅" : "❌"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          No tasks
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Task details panel */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg p-4 max-h-[75vh] overflow-y-auto">
          <h3 className="text-lg font-bold text-purple-600 mb-3">
            Tasks for {selectedDate.toDateString()}
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-gray-400">No tasks for this day</p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-pink-500 shadow-sm hover:shadow-md transition"
                >
                  <div className="truncate">
                    <p className="font-semibold text-purple-700">
                      {task.title}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {task.type} | {task.date}
                      {task.endDate && task.endDate !== task.date
                        ? ` - ${task.endDate}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm px-2 py-1 bg-purple-500 text-white rounded"
                      onClick={() => {
                        setOpenTask(task);
                        fetchNote(task._id);
                      }}
                    >
                      Notes
                    </button>
                    <span
                      className="text-2xl cursor-pointer"
                      onClick={() => toggleTaskStatus(task)}
                    >
                      {task.status === "complete" ? "✅" : "❌"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 my-6 justify-center">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition w-full sm:w-auto"
        >
          ➕ Add Task
        </button>
        <button
          onClick={() => setSelectedDate(today)}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-600 transition w-full sm:w-auto"
        >
          📌 Today
        </button>
        <button
          onClick={() => navigate("/list")}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition w-full sm:w-auto"
        >
          📋 List
        </button>
      </div>

      {/* Add Task Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>
            <AddTask onAdd={handleAdd} taskFolders={taskTypes} />
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {openTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-2">
          <div className="bg-white w-full max-w-lg h-[60vh] sm:rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-bold text-purple-600">
                {openTask.title} - Notes
              </h3>
              <button
                onClick={() => setOpenTask(null)}
                className="text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-full border rounded-lg p-2 resize-none"
                placeholder="Write your notes here..."
              />
            </div>

            <div className="p-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setOpenTask(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader style */}
      <style>{`
        .loader {
          border-top-color: #6366f1;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AddTask from "../components/AddTask";
// import { getTasks, addTask } from "../api/taskApi";
// import { AiOutlineCalendar } from "react-icons/ai";

// // update status API
// const updateTaskStatus = async (id, date, status) => {
//   try {
//     const res = await fetch(
//       `https://todoapp-slmn.onrender.com/tasks/${id}`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ dailyStatus: { [date]: status } }),
//       }
//     );
//     return await res.json();
//   } catch (err) {
//     console.error("Failed to update task status", err);
//   }
// };

// const Home = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showAdd, setShowAdd] = useState(false);
//   const [taskTypes, setTaskTypes] = useState([
//     "Aptitude",
//     "Coding",
//     "Personal",
//   ]);
//   const [showTasks, setShowTasks] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [openTask, setOpenTask] = useState(null);
//   const [note, setNote] = useState("");
//   const navigate = useNavigate();

//   // fetch tasks
//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const res = await getTasks();
//       setTasks(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // add task
//   const handleAdd = async (task) => {
//     if (!taskTypes.includes(task.type))
//       setTaskTypes((prev) => [...prev, task.type]);
//     await addTask(task);
//     fetchTasks();
//     setShowAdd(false);
//   };

//   const today = new Date();

//   // tasks in calendar cell
//   const tasksOnDay = (day) => {
//     if (!day) return [];
//     const dayDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day
//     );
//     const dayStr = dayDate.toISOString().split("T")[0];
//     return tasks
//       .filter((task) => {
//         const start = new Date(task.date);
//         start.setHours(0, 0, 0, 0);
//         const end = new Date(task.endDate || task.date);
//         end.setHours(23, 59, 59, 999);
//         return start <= dayDate && dayDate <= end;
//       })
//       .map((task) => ({
//         ...task,
//         status: task.dailyStatus?.[dayStr] || "incomplete",
//       }));
//   };

//   // selected day tasks
//   const selectedTasks = tasks
//     .filter((task) => {
//       const start = new Date(task.date);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(task.endDate || task.date);
//       end.setHours(23, 59, 59, 999);
//       return start <= selectedDate && selectedDate <= end;
//     })
//     .map((task) => {
//       const dateStr = selectedDate.toISOString().split("T")[0];
//       return {
//         ...task,
//         status: task.dailyStatus?.[dateStr] || "incomplete",
//       };
//     });

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();
//   const firstDayOfMonth = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const calendarDays = [];
//   for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
//   for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

//   const goPrevMonth = () =>
//     setCurrentDate(new Date(year, month - 1, 1));
//   const goNextMonth = () =>
//     setCurrentDate(new Date(year, month + 1, 1));

//   const handleDayClick = (day) => {
//     if (!day) return;
//     setSelectedDate(new Date(year, month, day));
//     setShowTasks(true);
//   };

//   // toggle task status
//   const toggleTaskStatus = async (task) => {
//     const dateStr = selectedDate.toISOString().split("T")[0];
//     const newStatus =
//       task.status === "complete" ? "incomplete" : "complete";
//     setTasks((prev) =>
//       prev.map((t) =>
//         t._id === task._id
//           ? {
//               ...t,
//               dailyStatus: { ...t.dailyStatus, [dateStr]: newStatus },
//             }
//           : t
//       )
//     );
//     await updateTaskStatus(task._id, dateStr, newStatus);
//   };

//   // fetch note for task
//   const fetchNote = async (taskId) => {
//     try {
//       const res = await fetch(
//          `http://localhost:5000/messages/${taskId}`
//                 // `https://todoapp-slmn.onrender.com/messages/${taskId}`

//       );
//       const data = await res.json();
//       if (data.length > 0) {
//         setNote(data[data.length - 1].content);
//       } else {
//         setNote("");
//       }
//     } catch (err) {
//       console.error("Failed to fetch note", err);
//     }
//   };

//   // save note
//   const saveNote = async () => {
//     if (!note.trim() || !openTask) return;
//     try {
//       await fetch(
//         `https://todoapp-slmn.onrender.com/messages/${openTask._id}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ content: note }),
//         }
//       );
//       setOpenTask(null);
//     } catch (err) {
//       console.error("Failed to save note", err);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-full">
//       <h1 className="text-3xl md:text-4xl font-extrabold mb-6 flex items-center justify-center gap-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
//         <AiOutlineCalendar className="text-4xl md:text-5xl" />
//         Task Dashboard
//       </h1>

//       {/* Calendar Navigation */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-2 sm:gap-0">
//         <button
//           onClick={goPrevMonth}
//           className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto"
//         >
//           ⬅ Prev
//         </button>
//         <h2 className="text-xl sm:text-2xl font-semibold">
//           {currentDate.toLocaleString("default", {
//             month: "long",
//           })}{" "}
//           {year}
//         </h2>
//         <button
//           onClick={goNextMonth}
//           className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto"
//         >
//           Next ➡
//         </button>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
//         </div>
//       ) : (
//         /* Calendar */
//         <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
//           {calendarDays.map((day, idx) => {
//             if (!day)
//               return (
//                 <div
//                   key={idx}
//                   className="bg-gray-50 p-2 rounded-xl pointer-events-none"
//                 ></div>
//               );
//             const dayDate = new Date(year, month, day);
//             const dayStr = dayDate.toISOString().split("T")[0];
//             const isToday =
//               dayDate.toDateString() === today.toDateString();
//             const isSelected =
//               dayDate.toDateString() === selectedDate.toDateString();
//             const dayTasks = tasksOnDay(day);

//             return (
//               <div
//                 key={idx}
//                 onClick={() => handleDayClick(day)}
//                 className={`p-2 rounded-xl shadow-md flex flex-col transition cursor-pointer bg-white hover:bg-purple-50
//                   ${
//                     isToday ? "border-2 border-purple-500" : ""
//                   } ${isSelected ? "ring-2 ring-pink-500" : ""}`}
//               >
//                 <div
//                   className={`text-base sm:text-lg font-bold ${
//                     isToday ? "text-purple-600" : "text-gray-700"
//                   }`}
//                 >
//                   {day}
//                 </div>
//                 <div className="mt-2 space-y-1 overflow-hidden max-h-32">
//                   {dayTasks.length > 0 ? (
//                     dayTasks.map((task) => (
//                       <div
//                         key={task._id}
//                         className="p-1 text-sm rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition bg-gradient-to-r from-purple-100 to-pink-100"
//                       >
//                         <span className="truncate">{task.title}</span>
//                         <span
//                           className="ml-2 text-sm cursor-pointer"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleTaskStatus(task);
//                           }}
//                         >
//                           {task.status === "complete" ? "✅" : "❌"}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <span className="text-gray-400 text-xs italic">
//                       No tasks
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row gap-3 my-6 justify-center">
//         <button
//           onClick={() => setShowAdd(true)}
//           className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition w-full sm:w-auto"
//         >
//           ➕ Add Task
//         </button>
//         <button
//           onClick={() => {
//             setSelectedDate(today);
//             setShowTasks(true);
//           }}
//           className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-600 transition w-full sm:w-auto"
//         >
//           📌 Today
//         </button>
//         <button
//           onClick={() => navigate("/list")}
//           className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition w-full sm:w-auto"
//         >
//           📋 List
//         </button>
//       </div>

//       {/* Add Task Modal */}
//       {showAdd && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2">
//           <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
//             <button
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//               onClick={() => setShowAdd(false)}
//             >
//               ×
//             </button>
//             <AddTask onAdd={handleAdd} taskFolders={taskTypes} />
//           </div>
//         </div>
//       )}

//       {/* Selected Day Tasks */}
//       {showTasks && selectedTasks.length > 0 && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-11/12 sm:w-96 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 overflow-y-auto max-h-[60vh]">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="text-lg font-bold text-purple-600">
//               Tasks for {selectedDate.toDateString()}
//             </h3>
//             <button
//               className="text-gray-500 hover:text-gray-800 font-bold text-xl"
//               onClick={() => setShowTasks(false)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="space-y-2">
//             {selectedTasks.map((task) => (
//               <div
//                 key={task._id}
//                 className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-pink-500 shadow-sm hover:shadow-md transition"
//               >
//                 <div className="truncate">
//                   <p className="font-semibold text-purple-700">
//                     {task.title}
//                   </p>
//                   <p className="text-gray-500 text-sm">
//                     {task.type} | {task.date}
//                     {task.endDate && task.endDate !== task.date
//                       ? ` - ${task.endDate}`
//                       : ""}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     className="text-sm px-2 py-1 bg-purple-500 text-white rounded"
//                     onClick={() => {
//                       setOpenTask(task);
//                       fetchNote(task._id);
//                     }}
//                   >
//                     Notes
//                   </button>
//                   <span
//                     className="text-2xl cursor-pointer"
//                     onClick={() => toggleTaskStatus(task)}
//                   >
//                     {task.status === "complete" ? "✅" : "❌"}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Notes Modal */}
//       {openTask && (
//         <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-2">
//           <div className="bg-white w-full max-w-lg h-[60vh] sm:rounded-2xl shadow-2xl flex flex-col">
//             <div className="flex justify-between items-center p-3 border-b">
//               <h3 className="text-lg font-bold text-purple-600">
//                 {openTask.title} - Notes
//               </h3>
//               <button
//                 onClick={() => setOpenTask(null)}
//                 className="text-xl"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="flex-1 p-3">
//               <textarea
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 className="w-full h-full border rounded-lg p-2 resize-none"
//                 placeholder="Write your notes here..."
//               />
//             </div>

//             <div className="p-3 border-t flex justify-end gap-2">
//               <button
//                 onClick={() => setOpenTask(null)}
//                 className="px-4 py-2 rounded-lg border"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveNote}
//                 className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loader style */}
//       <style>{`
//         .loader {
//           border-top-color: #6366f1;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;

// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import AddTask from "../components/AddTask";
// // import { getTasks, addTask } from "../api/taskApi";
// // import { AiOutlineCalendar } from 'react-icons/ai';

// // <h1 className="text-3xl md:text-4xl font-extrabold mb-6 flex items-center justify-center gap-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
// //   <AiOutlineCalendar className="text-4xl md:text-5xl" />
// //   Task Dashboard
// // </h1>

// // const updateTaskStatus = async (id, date, status) => {
// //   try {
// // const res = await fetch(`https://todoapp-slmn.onrender.com/tasks/${id}`, {
// //       method: "PATCH",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ dailyStatus: { [date]: status } }),
// //     });
// //     return await res.json();
// //   } catch (err) {
// //     console.error("Failed to update task status", err);
// //   }
// // };

// // const Home = () => {
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [showAdd, setShowAdd] = useState(false);
// //   const [taskTypes, setTaskTypes] = useState(["Aptitude", "Coding", "Personal"]);
// //   const [showTasks, setShowTasks] = useState(false);
// //   const [selectedDate, setSelectedDate] = useState(new Date());
// //   const [currentDate, setCurrentDate] = useState(new Date());
// //   const navigate = useNavigate();

// //   const fetchTasks = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await getTasks();
// //       setTasks(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTasks();
// //   }, []);

// //   const handleAdd = async (task) => {
// //     if (!taskTypes.includes(task.type)) setTaskTypes(prev => [...prev, task.type]);
// //     await addTask(task);
// //     fetchTasks();
// //     setShowAdd(false);
// //   };

// //   const today = new Date();

// //   const tasksOnDay = (day) => {
// //     if (!day) return [];
// //     const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
// //     const dayStr = dayDate.toISOString().split("T")[0];
// //     return tasks.filter(task => {
// //       const start = new Date(task.date); start.setHours(0,0,0,0);
// //       const end = new Date(task.endDate || task.date); end.setHours(23,59,59,999);
// //       return start <= dayDate && dayDate <= end;
// //     }).map(task => ({ ...task, status: task.dailyStatus?.[dayStr] || "incomplete" }));
// //   };

// //   const selectedTasks = tasks.filter(task => {
// //     const start = new Date(task.date); start.setHours(0,0,0,0);
// //     const end = new Date(task.endDate || task.date); end.setHours(23,59,59,999);
// //     return start <= selectedDate && selectedDate <= end;
// //   }).map(task => {
// //     const dateStr = selectedDate.toISOString().split("T")[0];
// //     return { ...task, status: task.dailyStatus?.[dateStr] || "incomplete" };
// //   });

// //   const year = currentDate.getFullYear();
// //   const month = currentDate.getMonth();
// //   const firstDayOfMonth = new Date(year, month, 1).getDay();
// //   const daysInMonth = new Date(year, month + 1, 0).getDate();

// //   const calendarDays = [];
// //   for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
// //   for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

// //   const goPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
// //   const goNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
// //   const handleDayClick = (day) => { if (!day) return; setSelectedDate(new Date(year, month, day)); setShowTasks(true); };

// //   const toggleTaskStatus = async (task) => {
// //     const dateStr = selectedDate.toISOString().split("T")[0];
// //     const newStatus = task.status === "complete" ? "incomplete" : "complete";
// //     setTasks(prev => prev.map(t => t._id === task._id ? { ...t, dailyStatus: { ...t.dailyStatus, [dateStr]: newStatus } } : t));
// //     await updateTaskStatus(task._id, dateStr, newStatus);
// //   };

// //   return (
// //     <div className="container mx-auto p-4 max-w-full">
// //    <h1 className="text-3xl md:text-4xl font-extrabold mb-6 flex items-center justify-center gap-2 text- bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
// // 📆  Task Dashboard
// // </h1>



// //       {/* Calendar Navigation */}
// //       <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-2 sm:gap-0">
// //         <button onClick={goPrevMonth} className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto">⬅ Prev</button>
// //         <h2 className="text-xl sm:text-2xl font-semibold">{currentDate.toLocaleString("default", { month: "long" })} {year}</h2>
// //         <button onClick={goNextMonth} className="px-4 py-2 bg-purple-200 rounded shadow hover:bg-purple-300 transition w-full sm:w-auto">Next ➡</button>
// //       </div>

// //       {/* Loading */}
// //       {loading ? (
// //         <div className="flex justify-center items-center h-64">
// //           <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
// //         </div>
// //       ) : (
// //         /* Calendar */
// //         <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 sm:gap-3">
// //           {calendarDays.map((day, idx) => {
// //             if (!day) return <div key={idx} className="bg-gray-50 p-2 rounded-xl pointer-events-none"></div>;
// //             const dayDate = new Date(year, month, day);
// //             const dayStr = dayDate.toISOString().split("T")[0];
// //             const isToday = dayDate.toDateString() === today.toDateString();
// //             const isSelected = dayDate.toDateString() === selectedDate.toDateString();
// //             const dayTasks = tasksOnDay(day);

// //             return (
// //               <div
// //                 key={idx}
// //                 onClick={() => handleDayClick(day)}
// //                 className={`p-2 rounded-xl shadow-md flex flex-col transition cursor-pointer bg-white hover:bg-purple-50
// //                   ${isToday ? "border-2 border-purple-500" : ""} ${isSelected ? "ring-2 ring-pink-500" : ""}`}
// //               >
// //                 <div className={`text-base sm:text-lg font-bold ${isToday ? "text-purple-600" : "text-gray-700"}`}>{day}</div>
// //                 <div className="mt-2 space-y-1 overflow-hidden max-h-32">
// //                   {dayTasks.length > 0 ? dayTasks.map(task => (
// //                     <div key={task._id} className="p-1 text-sm rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition bg-gradient-to-r from-purple-100 to-pink-100">
// //                       <span className="truncate">{task.title}</span>
// //                       <span className="ml-2 text-sm cursor-pointer" onClick={() => toggleTaskStatus(task)}>
// //                         {task.status === "complete" ? "✅" : "❌"}
// //                       </span>
// //                     </div>
// //                   )) : <span className="text-gray-400 text-xs italic">No tasks</span>}
// //                 </div>
// //               </div>
// //             )
// //           })}
// //         </div>
// //       )}

// //       {/* Action Buttons */}
// //       <div className="flex flex-col sm:flex-row gap-3 my-6 justify-center">
// //         <button onClick={() => setShowAdd(true)} className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-600 transition w-full sm:w-auto">➕ Add Task</button>
// //         <button onClick={() => { setSelectedDate(today); setShowTasks(true); }} className="bg-purple-500 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-600 transition w-full sm:w-auto">📌 Today</button>
// //         <button onClick={() => navigate("/list")} className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition w-full sm:w-auto">📋 List</button>
// //       </div>

// //       {/* Add Task Modal */}
// //       {showAdd && (
// //         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-2">
// //           <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
// //             <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold" onClick={() => setShowAdd(false)}>×</button>
// //             <AddTask onAdd={handleAdd} taskFolders={taskTypes} />
// //           </div>
// //         </div>
// //       )}

// //       {/* Selected Day Tasks */}
// //       {showTasks && selectedTasks.length > 0 && (
// //         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-11/12 sm:w-96 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 overflow-y-auto max-h-[60vh]">
// //           <div className="flex justify-between items-center mb-3">
// //             <h3 className="text-lg font-bold text-purple-600">Tasks for {selectedDate.toDateString()}</h3>
// //             <button className="text-gray-500 hover:text-gray-800 font-bold text-xl" onClick={() => setShowTasks(false)}>×</button>
// //           </div>

// //           <div className="space-y-2">
// //             {selectedTasks.map(task => (
// //               <div key={task._id} className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-pink-500 shadow-sm hover:shadow-md transition">
// //                 <div className="truncate">
// //                   <p className="font-semibold text-purple-700">{task.title}</p>
// //                   <p className="text-gray-500 text-sm">{task.type} | {task.date}{task.endDate && task.endDate !== task.date ? ` - ${task.endDate}` : ""}</p>
// //                 </div>
// //                 <span className="text-2xl cursor-pointer" onClick={() => toggleTaskStatus(task)}>
// //                   {task.status === "complete" ? "✅" : "❌"}
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Loader style */}
// //       <style>{`
// //         .loader {
// //           border-top-color: #6366f1;
// //           animation: spin 1s linear infinite;
// //         }
// //         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Home;

