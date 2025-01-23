import React, { useEffect, useState } from "react";
import styles from "../Styles/Schedule.module.css"; 
import { UserData } from "../context/UserContext";
import { getTimeTable,addTaskToTimetable } from "@/services/schedule";
const Schedule = () => {
  const {user} = UserData();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!taskName || !description || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }

    const newTask = {
      userId: user._id,
      name: taskName,
      description,
      startTime,
      endTime,
    };
    const response = await fetch('http://localhost:5000/api/user/addTask', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'token': localStorage.getItem('token'),
      },
      body: JSON.stringify(newTask),
    });
    const variableTest = await response.json();
    if (!response.ok) {
      console.log(variableTest.message);
      alert("Task could not be added. Please try again later.");
      return;
    } else {
      alert("Task added successfully");
    }

    setTasks([...tasks, newTask]);

    setTaskName("");
    setDescription("");
    setStartTime("");
    setEndTime("");
  };

  const handleTaskStatusChange = (index,event) => {
    const updatedTasks = tasks.map((task, idx) =>
      idx === index
        ? { ...task, status: event.target.value }
        : task
    );
    setTasks(updatedTasks);
  };
  const handleRemoveTask=(index)=>{
    
    const updatedTasks=tasks.filter((_,idx)=>idx!==index);
    setTasks(updatedTasks);
  }
  const handleClearAllTasks=()=>{
    setTasks([]);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const data ={
        userId: user._id,
        date: new Date().toISOString().split("T")[0],
      };
      const res = await fetch('http://localhost:5000/api/user/getTimeTable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });
      const variableTest = await res.json();
      console.log(variableTest);
      if (!res.ok) {
        alert("Tasks could not be fetched. Please try again later.");
        return;
      }
      // alert(response.timeTable);
      if(variableTest.timeTable.length > 0){
        const tasks = variableTest.timeTable[0].tasks;
        setTasks(tasks);
      }
    };

    fetchTasks();
  }, [user._id]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
      <form onSubmit={handleSubmit} className={styles.taskForm}>
  {/* Task Name */}
  <div className={styles.inputContainer}>
    <label htmlFor="taskName" className={styles.label}>
      Task Name:
    </label>
    <input
      type="text"
      id="taskName"
      className={styles.inputField}
      value={taskName}
      onChange={(e) => setTaskName(e.target.value)}
      placeholder="Enter task name"
    />
  </div>

  {/* Description */}
  <div className={styles.inputContainer}>
    <label htmlFor="description" className={styles.label}>
      Description:
    </label>
    <textarea
      id="description"
      className={styles.inputField}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter task description"
    ></textarea>
  </div>

  {/* Start Time */}
  <div className={styles.inputContainer}>
    <label htmlFor="startTime" className={styles.label}>
      Start Time:
    </label>
    <input
      type="time"
      id="startTime"
      className={styles.inputField}
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
    />
  </div>

  {/* End Time */}
  <div className={styles.inputContainer}>
    <label htmlFor="endTime" className={styles.label}>
      End Time:
    </label>
    <input
      type="time"
      id="endTime"
      className={styles.inputField}
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
    />
  </div>

  {/* Submit Button */}
  <button type="button" className={styles.Schedulebutton} onClick={handleSubmit}>
    Add Task
  </button>
</form>

        {/* Task List */}
        <div className={styles.taskList}>
          <h3>Planned Activitites</h3>
          {tasks.map((task, index) => (
            <div key={index} className={styles.taskItem}>
              <div className={styles.taskDetails}>
                <h4 className={styles.taskName}>{task.taskName}</h4>
                <p className={styles.taskDescription}>{task.description}</p>
              </div>
    
              <div className={styles.timeContainer}>
                <p>Start: {task.startTime}</p>
                <p>End: {task.endTime}</p>
              </div>
    
                <div className={styles.statusContainer}>
                  <label>
                    <select 
                      value={task.status}
                      onChange={(e)=>handleTaskStatusChange(index,e)}
                      className={styles.statusDropdown}
                    >
                    <option value="Pending">Pending</option>
                    <option value="Started">Started</option>
                    <option value="Completed">Completed</option>
                    </select>
                    
                  </label>
                </div>
                <button className={styles.removeButton}
                onClick={()=>handleRemoveTask(index)}>
                  X
                </button>
              </div>
            ))}
        </div>
        <button 
          className={styles.clearAllButton} 
          onClick={handleClearAllTasks}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Schedule;


