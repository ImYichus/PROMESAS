import json
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import get_object_or_404, render

from todos.models import Todo 


def home(request):
    return render(request, "home.html")


def todos(request):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if is_ajax:
        # --- GET (Read) ---
        if request.method == 'GET':
            try:
                # 🟢 LECTURA: Garantizamos safe=False y retornamos inmediatamente.
                todos = list(Todo.objects.all().values('id', 'task', 'completed'))
                return JsonResponse({'context': todos}, safe=False)
            except Exception:
                # 🛑 Capturamos si la DB falla al consultar (ej. tabla no existe)
                return JsonResponse({'error': 'Internal Server Error during data retrieval.'}, status=500)
        
        # --- POST (Create) ---
        if request.method == 'POST':
            # ... (Lógica de creación existente) ...
            try:
                data = json.loads(request.body)
                todo_payload = data.get('payload')
            except json.JSONDecodeError:
                return JsonResponse({'status': 'Error: Invalid JSON'}, status=400)
                
            Todo.objects.create(task=todo_payload['task'], completed=todo_payload['completed'])
            return JsonResponse({'status': 'Todo added!'})

        # --- Catch-all para otros métodos en /todos/ ---
        return JsonResponse({'status': 'Method not allowed for AJAX'}, status=405)
    
    # ⬇️ CORRECCIÓN: Manejar peticiones GET no-AJAX
    if request.method == 'GET':
        # Asume que quieres renderizar la página principal si no es AJAX
        return render(request, "home.html")
    
    # Otras peticiones no-AJAX (POST, etc.) siguen siendo no válidas
    else:
        return HttpResponseBadRequest('Invalid request')


def todo(request, todoId):
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if is_ajax:
        # Usamos el nombre de variable corregido
        todo_item = get_object_or_404(Todo, id=todoId)
        
        # --- PUT (Update) ---
        if request.method == 'PUT':
            try:
                # 🔑 AISLAMIENTO: La lectura solo ocurre en PUT
                data = json.loads(request.body)
                updated_values = data.get('payload', {})
            except json.JSONDecodeError:
                return JsonResponse({'status': 'Error: Invalid JSON'}, status=400)

            todo_item.task = updated_values.get('task', todo_item.task)
            todo_item.completed = updated_values.get('completed', todo_item.completed)
            todo_item.save()
            return JsonResponse({'status': 'Todo updated!'})

        # --- DELETE (Delete) ---
        if request.method == 'DELETE':
            # DELETE NO NECESITA leer request.body
            todo_item.delete()
            return JsonResponse({'status': 'Todo deleted!'})
            
        # --- Catch-all para otros métodos en /todos/<id>/ ---
        return JsonResponse({'status': 'Method not allowed for AJAX'}, status=405)
    else:
        return HttpResponseBadRequest('Invalid request')