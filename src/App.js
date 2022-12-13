import React from "react";
import { useState, useEffect } from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from './components/About'
import Footer from "./components/Footer";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);
  //FETCH TASKS
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:3000/tasks");
    const data = await res.json();
    return data;
  };
  //FETCH TASK
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`);
    const data = await res.json();
    return data;
  };
  //ADD TASK
  const addTask = (task) => {
    const res = await fetch('http://localhost:3000/tasks',{
      method: 'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(task),
    })
    const data = await res.json()
    setTasks([...tasks, data])
 
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  };
  //DELETE TASK
  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };
  //REMINDER
  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToggle,
    reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:3000/tasks`${id},{
      method: 'PUT'
      headers: {
        'content-type': 'application/json',
      },
      body :JSON,stringify(updTask),
    })
    const data = await res.json()
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };
  return (
    <Router>
    <div className="App">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      
      <Route path='/' exact render={(props)=>(
        <>
        {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "NO TASKS"
      )}
        </>
      )} />
      <Route path='/about' component={About} />
      <Footer />
    </div>
  </Router>
  );
};

export default App;
