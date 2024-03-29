import React, { useState } from "react";
import "./App.css";

interface Task {
  id: number;
  text: string;
  subtasks: Task[];
}

const TaskComponent: React.FC<{
  task: Task;
  onDelete: (taskId: number) => void;
  onMasterDelete: (taskText: string) => void;
}> = ({ task, onDelete, onMasterDelete }) => {
  const [subtaskInput, setSubtaskInput] = useState<string>("");

  const handleSubtaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskInput(e.target.value);
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim() !== "") {
      task.subtasks.push({
        id: task.subtasks.length + 1,
        text: subtaskInput,
        subtasks: [],
      });
      setSubtaskInput("");
    }
  };

  const handleDeleteTask = (taskId: number) => {
    onDelete(taskId);
  };

  const handleMasterDelete = (taskText: string) => {
    onMasterDelete(taskText);
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <div>
        {task.text}{" "}
        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>{" "}
        <button onClick={() => handleMasterDelete(task.text)}>
          Delete Duplicate
        </button>
      </div>
      <div>
        {task.subtasks.map((subtask) => (
          <TaskComponent
            key={subtask.id}
            task={subtask}
            onDelete={onDelete}
            onMasterDelete={onMasterDelete}
          />
        ))}
      </div>
      <div>
        <input
          type="text"
          value={subtaskInput}
          onChange={handleSubtaskInputChange}
          placeholder="Enter subtask..."
        />
        <button onClick={handleAddSubtask}>Add Subtask</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      const newTask: Task = {
        id: tasks.length + 1,
        text: taskInput,
        subtasks: [],
      };
      setTasks([...tasks, newTask]);
      setTaskInput("");
    }
  };

  const handleResetTask = () => setTasks([]);

  const handleDeleteTask = (taskId: number, parentTask?: Task) => {
    if (parentTask) {
      parentTask.subtasks = parentTask.subtasks.filter(
        (task) => task.id !== taskId
      );
      setTasks([...tasks]);
    } else {
      const filteredTasks = tasks.filter(
        (task) => task.id !== taskId && task.id !== -1
      );
      setTasks(filteredTasks);
    }
  };

  const handleMasterDelete = (taskText: string) => {
    const newTasks: Task[] = [];
    const seen: { [key: string]: boolean } = {};

    tasks.forEach((task) => {
      const removeDuplicates = (currentTask: Task): Task => {
        if (!seen[currentTask.text]) {
          seen[currentTask.text] = true;
          const subtasksWithoutDuplicates = currentTask.subtasks
            .map((subtask) => removeDuplicates(subtask))
            .filter(Boolean); // Filter out null tasks
          return { ...currentTask, subtasks: subtasksWithoutDuplicates };
        }
        return { id: -1, text: "", subtasks: [] }; // Return an empty task if it's a duplicate
      };

      const newTask = removeDuplicates(task);
      if (newTask) {
        newTasks.push(newTask);
      }
    });

    setTasks(newTasks);
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          value={taskInput}
          onChange={handleTaskInputChange}
          placeholder="Enter task..."
        />
        <button onClick={handleAddTask}>Add Task</button>
        <button onClick={handleResetTask}>Reset</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskComponent
              task={task}
              onDelete={handleDeleteTask}
              onMasterDelete={handleMasterDelete}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
