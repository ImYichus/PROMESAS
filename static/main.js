// main.js - Código Completo y Consolidado

// Función de utilidad para obtener el token CSRF de la cookie.
// Es necesaria para peticiones POST, PUT y DELETE en Django.
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

// ----------------------------------------------------
// READ (GET) - Función para obtener y renderizar todas las tareas.
// (Esta es la función que se llama al cargar la página en home.html)
// ----------------------------------------------------
async function operationGetAllTodos(url) { 
  const todoList = document.getElementById("todoList");
  // Muestra un mensaje de carga mientras se espera la respuesta
  todoList.innerHTML = '<li>Cargando tareas...</li>'; 

  try {
    // 1. Realiza la petición GET
    const response = await fetch(url, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      }
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} (${response.statusText})`);
    }

    // 2. Parsea la respuesta JSON
    const data = await response.json();

    // 3. Renderiza la lista
    todoList.innerHTML = ""; // Limpiar el contenedor

    if (Array.isArray(data.context) && data.context.length > 0) {
      // Itera sobre la lista de tareas (data.context)
      data.context.forEach(todo => {
        const todoHTMLElement = `
          <li class="list-group-item d-flex justify-content-between align-items-center ${todo.completed ? 'list-group-item-success' : ''}">
            <span>[ID: ${todo.id}] Task: ${todo.task}</span>
            <span class="badge ${todo.completed ? 'bg-success' : 'bg-warning text-dark'}">
              ${todo.completed ? 'Completada' : 'Pendiente'}
            </span>
          </li>`
        todoList.innerHTML += todoHTMLElement;
      });
    } else {
        todoList.innerHTML = '<li>No hay tareas para mostrar. Crea una nueva.</li>';
    }


  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    todoList.innerHTML = `<li>Error: No se pudo cargar la lista. ${error.message}</li>`;
  }
}


// ----------------------------------------------------
// CREATE (POST) - Añade una nueva tarea
// ----------------------------------------------------
async function addTodo(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // Especificar el tipo de contenido
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
    
    // ✅ Recarga la lista para ver el nuevo elemento
    operationGetAllTodos(url); 

  } catch (error) {
    console.error('Error al agregar tarea:', error);
  }
}


// ----------------------------------------------------
// UPDATE (PUT) - Actualiza una tarea existente
// ----------------------------------------------------
async function updateTodo(url, payload) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json", // Especificar el tipo de contenido
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      // Solo enviamos los campos que tienen valor
      body: JSON.stringify({payload: payload}) 
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tarea actualizada exitosamente:', data);
    
    // ✅ Recarga la lista para ver el cambio
    operationGetAllTodos('/todos/'); 

  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}


// ----------------------------------------------------
// DELETE - Elimina una tarea
// ----------------------------------------------------
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
    
    // ✅ Recarga la lista para ver que el elemento ha desaparecido
    operationGetAllTodos('/todos/'); 

  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
}

// ----------------------------------------------------
// Inicialización de Event Listeners (La lógica de home.html)
// ----------------------------------------------------
// Nota: Esta parte DEBE estar en un bloque <script> en home.html,
// o cargarse después de que el DOM esté listo, si usas un archivo .js externo.
// Si usas un archivo .js externo, quita el "(function() { ... })();"
/* (function() {

    console.log("ready!");

    const allTodosUrl = "{% url 'todos' %}";

    // ✅ CORRECCIÓN CLAVE: Llama a la función de lectura al inicio.
    operationGetAllTodos(allTodosUrl); 

    // GET all todos (Listener para el botón de recarga manual)
    const readButton = document.getElementById("getTodos");
    readButton.addEventListener("click", () => {
      operationGetAllTodos(allTodosUrl);
    });

    // ... (Listeners para POST, PUT, DELETE) ...

})();
*/