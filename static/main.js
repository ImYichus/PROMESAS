// https://docs.djangoproject.com/en/3.2/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-and-csrf-cookie-httponly-are-false
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function getAllTodos(url) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "<li>Cargando tareas...</li>"; 

  try {

    const response = await fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      }
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();

    todoList.innerHTML = ""; 

    (data.context).forEach(todo => {
      const todoHTMLElement = `
        <li>
          <p>Task: ${todo.task}</p>
          <p>Completed?: ${todo.completed}</p>
        </li>`
      todoList.innerHTML += todoHTMLElement;
    });

  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    todoList.innerHTML = `<li>Error: No se pudo cargar la lista. ${error.message}</li>`;
  }
}


async function addTodo(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"), 
      },
      body: JSON.stringify({payload: payload})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tarea agregada exitosamente:', data);

  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }
}


async function updateTodo(url, payload) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({payload: payload})
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tarea actualizada exitosamente:', data);

  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}


async function deleteTodo(url) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      }
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tarea eliminada exitosamente:', data);

  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
}
