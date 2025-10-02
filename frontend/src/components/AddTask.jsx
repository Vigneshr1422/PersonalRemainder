import React, { useState } from 'react';

const AddTask = ({ onAdd, taskFolders = [] }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(taskFolders[0] || '');
  const [newType, setNewType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('#34d399');

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalType = newType || type;
    if (!title || !startDate || !finalType) return;

    onAdd({
      title,
      type: finalType,
      date: startDate,
      endDate: endDate || startDate,
      color,
      status: 'incomplete',
      week: new Date(startDate).getWeek()
    });

    // Reset form
    setTitle('');
    setNewType('');
    setStartDate('');
    setEndDate('');
    setColor('#34d399');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md mx-auto bg-white">
      
      {/* Type Selection */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded flex-1 w-full"
        >
          {taskFolders.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input 
          type="text" 
          placeholder="Or create new type"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border p-2 rounded flex-1 w-full"
        />
      </div>

      {/* Task Title */}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* Dates */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="border p-2 rounded flex-1 w-full"
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="border p-2 rounded flex-1 w-full"
        />
      </div>

      {/* Color Picker */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <label className="text-sm font-medium">Pick Color:</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 p-0 border-0 rounded"
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition"
      >
        Add Task
      </button>
    </form>
  );
};

// Helper to get week number
Date.prototype.getWeek = function() {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
};

export default AddTask;
