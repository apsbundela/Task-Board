import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from "@dnd-kit/utilities"
import React, { useMemo, useState } from 'react'
import TaskCard from './TaskCard';

const ColumnContainer = ({ column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask }) => {

    const [isEditMode, setEditMode] = useState(false);
    const taskIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,

        },
        disabled: isEditMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (<div
            ref={setNodeRef}
            style={style}
            className='bg-blue-900 w-[350px] h-[500px] rounded-md flex flex-col opacity-55 border-rose-500'>
        </div>)
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            className='bg-blue-900 w-[350px] h-[500px] rounded-md flex flex-col'>

            {/* column title */}
            <div
                {...attributes}
                {...listeners}
                onClick={() => setEditMode(true)}
                className='bg-blue-600 h-[60] rounded-b-none rounded-md p-3 flex justify-between'>
                {!isEditMode && column.title}
                {isEditMode &&
                    (<input
                        className='bg-blue-900 focus:border-rose-500 border-rounded outline-none px-2'
                        autoFocus
                        onBlur={() => setEditMode(false)}
                        onChange={(e) => updateColumn(column.id, e.target.value)}
                    />)}

                <button
                    className='bg-blue-200 text-black rounded-md p-2 hover:bg-white'
                    onClick={() => deleteColumn(column.id)}
                >Delete</button>
            </div>

            {/* column task container */}
            <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'>
                <SortableContext items={taskIds}>
                    {
                        tasks.map((task) => (
                            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
                        ))
                    }
                </SortableContext>

            </div>

            {/* footer */}
            <button
                className='flex gap-2 items-center border-2 rounded-md p-4 bg-blue-900 hover:bg-blue-500 outline-none text-center'
                onClick={() => createTask(column.id)}
            >Add Task</button>
        </div>
    )
}

export default ColumnContainer
