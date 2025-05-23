import { useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react'
import { CSS } from '@dnd-kit/utilities';

const TaskCard = ({ task, deleteTask, updateTask }) => {

    const [editMode, setEditMode] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    })


    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }
    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className='bg-blue-500 p-2 h-[100] opacity-50 items-center text-left rounded-xl hover:bg-blue-700 flex justify-between'
            >
                Dragging
            </div>
        );
    }
    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={toggleEditMode}
                className='bg-blue-900 h-[50] rounded-b-none rounded-md p-3 flex justify-between'>
                <input
                    autoFocus
                    value={task.content}
                    onBlur={toggleEditMode}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key == "Enter")
                            toggleEditMode();
                    }}
                    className='bg-blue-900 h-[50] rounded-b-none rounded-md p-3 flex justify-between'></input>

            </div>
        )
    }
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEditMode}
            className='bg-blue-500 p-2 h-[50px] items-center text-left rounded-xl hover:bg-blue-700 flex justify-between'>
            {task.content}
            <button
                className='bg-blue-200 text-black rounded-md p-2 hover:bg-white'
                onClick={() => deleteTask(task.id)}
            >Delete</button>
        </div>
    )
}

export default TaskCard
