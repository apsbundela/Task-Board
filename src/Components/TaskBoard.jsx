import React, { useMemo, useState } from 'react'
import ColumnContainer from './ColumnContainer';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';


const TaskBoard = () => {
    const [columns, setColumns] = useState([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const [tasks, setTasks] = useState([]);

    const generateId = () => {
        //Generate random number b/w 0 to 10000
        return Math.floor(Math.random() * 1000);
    }

    //********************* Methods for Column Creation, Deletion and Updation************************* */

    const createNewColumns = () => {
        const columnToAdd = {
            id: generateId(),
            title: `Click here to Edit Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd]);
    }

    const deleteColumn = (id) => {
        const filteredColumn = columns.filter((col) => col.id != id)
        setColumns(filteredColumn);

        const newTask = tasks.filter((t) => t.columnId !== id)
        setTasks(newTask);
    }

    const updateColumn = (id, title) => {
        const newColumn = columns.map((col) => {
            if (col.id != id) return col;
            return { ...col, title };
        })
        setColumns(newColumn);
    }

    //********************* Methods for TAsks Creation, Deletion and Updation************************* *

    const createTask = (columnId) => {
        const newTask = {
            id: generateId(),
            columnId,
            content: `Click here to Edit Task ${tasks.length + 1}`,
        }
        setTasks([...tasks, newTask])
    }

    const deleteTask = (id) => {
        const newTask = tasks.filter((task) => task.id != id)
        setTasks(newTask)
    }

    const updateTask = (id, content) => {
        const newTasks = tasks.map((task) => {
            if (task.id != id) return task;
            return { ...task, content };
        })
        setTasks(newTasks);
    }


    //********************* Methods for Drags and Drops ********************************************** *

    const onDragStart = (event) => {
        if (event.active.data.current?.type == "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type == "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }

    }

    const onDragOver = (event) => {

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type == "Task";
        const isOverTask = over.data.current?.type == "Task";

        if (!isActiveTask) return;
        //Dropping one task to another task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overeIndex = tasks.findIndex((t) => t.id === overId)

                //if (tasks[activeIndex].columnId !== tasks[overeIndex].columnId)
                tasks[activeIndex].columnId = tasks[overeIndex].columnId
                return arrayMove(tasks, activeIndex, overeIndex)
            })
        }


        const isOverColumn = over.data.current?.type === "Column"
        //Dropping task to another Column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                //if (tasks[activeIndex].columnId !== tasks[overeIndex].columnId)
                tasks[activeIndex].columnId = overId;
                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }
    }

    const onDragEnd = (event) => {
        setActiveColumn(null);
        setActiveTask(null)
        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId == overColumnId) return;
        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id == activeColumnId);
            const overColumnIndex = columns.findIndex((col) => col.id == overColumnId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })
    }

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    }))

    return (
        <div className='m-auto flex items-center w-full overflow-x-auto overflow-y-hidden bg-amber-500'>
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className='m-auto'>
                    <div className='flex gap-4'>
                        <SortableContext items={columnsId}>
                            {
                                columns.map((column) => (
                                    <ColumnContainer
                                        key={column.id}
                                        column={column}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        createTask={createTask}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                        tasks={tasks.filter((tasks) => tasks.columnId == column.id)}
                                    />
                                ))
                            }
                        </SortableContext>
                        <button className='h-[50px] w-[400] p-2 cursor-pointer rounded-lg bg-blue-950 border-2' onClick={createNewColumns}>Add Column</button>

                    </div>
                </div>
                {
                    createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <ColumnContainer
                                    column={activeColumn}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter((tasks) => tasks.columnId == activeColumn.id)}
                                />)}
                            {
                                activeTask && (
                                    <TaskCard
                                        task={activeTask}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}

                                    />
                                )
                            }
                        </DragOverlay>,
                        document.body
                    )
                }

            </DndContext>
        </div>
    )
}

export default TaskBoard
