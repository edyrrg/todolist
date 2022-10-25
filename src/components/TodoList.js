import React, { useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import axios from "axios";
import { useEffect } from "react";
import { getTodos, patchTodo } from "../util/api";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos().then((remoteTodos) => {
      setTodos(remoteTodos)
    })
  }, []);

  const addTodo = async (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    axios
      .post("http://localhost:3000/api/v1/to-dos", {
        ...todo,
        title: todo.text
      })
      .then(() => {
        getTodos().then((remoteTodos) => {
          setTodos(remoteTodos)
        })
      });

    // const newTodos = [todo, ...todos];

    //setTodos(newTodos);
    //console.log(...todos);
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    patchTodo(todoId, newValue)
      .then(() => {
        getTodos().then((remoteTodos) => {
          setTodos(remoteTodos)
        })
      })
  };

  const removeTodo = (id) => {
    axios
      .delete(`http://localhost:3000/api/v1/to-dos/${id}`)
      .then(() => {
        getTodos().then((remoteTodos) => {
          setTodos(remoteTodos)
        })
      })
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.is_done = !todo.is_done;
        patchTodo(id, { ...todo })
        // .then(() => {
        //   getTodos().then((remoteTodos) => {
        //     setTodos(remoteTodos)
        //   })
        // })
      }
      return todo;
    });
    setTodos(updatedTodos)
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
