import React, { useState } from "react";
import { CheckCircle, Circle, Clock } from 'lucide-react';

const Todo = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Designing",
      description: "Create a wireframe and design the homepage",
      startTime: "9:00 AM",
      endTime: "12:00 PM",
      state: "pending",
    },
    {
      id: 2,
      title: "Developing pages",
      description: "Build the authentication API",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      state: "started",
    },
    {
      id: 3,
      title: "Documentation",
      description: "Prepare documentation",
      startTime: "4:00 PM",
      endTime: "5:00 PM",
      state: "pending",
    }
  ]);

  const handleStateChange = (id, newState) => {
    if (newState === "complete") {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, state: newState } : task
        )
      );
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'started':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
        <span className="text-sm text-gray-500">{tasks.length} remaining</span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              {getStateIcon(task.state)}
              <div>
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.startTime} - {task.endTime}</p>
              </div>
            </div>
            
            <select
              value={task.state}
              onChange={(e) => handleStateChange(task.id, e.target.value)}
              className="px-3 py-1 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="started">Started</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
