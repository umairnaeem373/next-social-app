'use client'
import React, { useState } from "react";
import TaskList from "./TaskList";

type Props = {};




const Sch = (props: Props) => {
  const [scheduleId, setScheduleId] = useState('');
  const handleClick=()=>{
    setScheduleId('689f45acf5fd397c727daac3')
  }
  return (
    <div>
      <h1>Real-Time Task List</h1>
      {!scheduleId && <button onClick={handleClick}>get Tasks</button>}
      {scheduleId && <TaskList scheduleId={scheduleId} />}
    </div>
  );
};

export default Sch;
