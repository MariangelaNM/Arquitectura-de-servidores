Para esta actividad construiremos un API HTTP en node utilizando la librería express.js.
El API debe incluir las rutas necesarias para generar una respuesta en formato JSON a los siguientes puntos:

1. GET http://localhost:8000/api/employees

Devolverá un array JSON con el contenido del fichero "employees.json" que se adjunta al enunciado.
Es posible añadirlo al código fuente con require('/path/to/employees.json') y guardarlo en una constante.

2. GET http://localhost:8000/api/employees?page=1

Devolverá los primeros 2 empleados. Del elemento 0 al elemento 1 del listado

2. GET http://localhost:8000/api/employees?page=2

Devolverá del elemento 2 al elemento 3 del listado

3. GET http://localhost:8000/api/employees?page=N

Devolverá del elemento (2 * (N - 1)) al (2 * (N - 1)) + 1.

4. GET http://localhost:8000/api/employees/oldest

Devolverá el objeto individual correspondiente al empleado con más edad. En caso de existir más
de uno, se devolverá la primera ocurrencia

5. GET http://localhost:8000/api/employees?user=true

Devolverá listado de employees con privileges == "user"

6. POST http://localhost:8000/api/employees

Añadirá un elemento al listado en memoria del programa (se perderá cada vez que se reinicie).
Se validará que el body de la petición cumpla el mismo formato JSON que el resto de empleados.
Si no cumpliera dicha validación, se devolverá status 400 con el siguiente contenido:

{"code": "bad_request"}

7. GET http://localhost:8000/api/employees?badges=black

Devolverá listado de employees que incluya "black" en el atributo "badges"

8. GET http://localhost:8000/api/employees/NAME
Devolverá objeto employee cuyo nombre sea igual a NAME. NAME puede tomar diferentes valores:
Sue, Bob, etc.
Si no se encuentra el usuario con name == NAME se devolvera status 404 con el siguiente contenido:
{"code": "not_found"}
