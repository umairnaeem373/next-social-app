"use client";
import fetchTasks from "@/api";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { autoConnect: false });

export interface TaskType {
  _id: string;
  isCompleted: boolean;
  title: string;
}

export default function TaskList({ scheduleId }: { scheduleId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const prevTasksRef = useRef<TaskType[]>([]);

  useEffect(() => {
    fetchTasks(scheduleId).then((res) => {
      setTasks(res.data);
    });

    socket.connect();
    socket.emit("tasks:join", { scheduleId });

    socket.on("tasks:updated", (task) => {
      console.log(task);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task._id
            ? {
                ...t,
                attributes: { ...t.attributes, isCompleted: task.isCompleted },
              }
            : t
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [scheduleId]);

  const toggleTask = (taskId: string, nextChecked: boolean) => {
    prevTasksRef.current = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, attributes: { ...t.attributes, isCompleted: nextChecked } }
          : t
      )
    );

    socket.emit(
      "tasks:toggle",
      { scheduleId, taskId, isCompleted: nextChecked },
      (res: any) => {
        if (!res?.ok) {
          setTasks(prevTasksRef.current);
          alert(res?.message || "Update failed");
        }
      }
    );
  };


  return (
    <ul>
      {tasks &&
        tasks.map(({ attributes: t }) => (
          <li key={t.Id}>
            <label>
              <input
                type="checkbox"
                checked={t.isCompleted}
                onChange={(e) => toggleTask(t.Id, e.target.checked)}
              />
              {t.title}
            </label>
          </li>
        ))}
    </ul>
  );
}
