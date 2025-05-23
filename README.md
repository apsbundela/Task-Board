# Drag & Drop Task Board (React + dnd-kit)

A drag-and-drop enabled Kanban-style task board built with **React** and **@dnd-kit**. You can dynamically create columns and tasks, drag and drop tasks between columns, reorder them, and edit/delete tasks or columns inline.

## Features

- Add, edit, and delete columns
- Add, edit, and delete tasks within columns
- Drag & drop tasks within and between columns
- Drag & drop columns to reorder
- Fully powered by `@dnd-kit` for smooth sorting and overlays
- Inline editing with auto-save on blur or Enter key

## Tech Stack

- React
- Tailwind CSS
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

## Installation

## Real-Time Synchronization

1. **Backend Setup ( Socket.IO):**
   - Set up a basic server with Socket.IO.
   - Listen for task events like `task-created`, `task-updated`, `task-deleted`, and `task-moved`.
   - Broadcast these events to all connected clients except the sender.
 

**Clone the repository:**

   ```bash
   git clone https://github.com/your-username/task-board.git
   cd task-board
