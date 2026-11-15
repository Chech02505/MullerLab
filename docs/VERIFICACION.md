# Verificación técnica y casos de prueba

## Estado del paquete

Se ha implementado el motor de aritmética compleja y los tres algoritmos numéricos con pruebas automatizadas. **38 / 38 pruebas pasadas** con `node --test`. Los componentes React `.jsx` se han analizado con el compilador TypeScript, sin errores de sintaxis.

**Limitación de esta revisión:** la máquina de construcción no pudo acceder al registro npm para instalar React, Vite, mathjs y Tailwind. Por eso no se pudo ejecutar una compilación Vite real ni revisar el aspecto definitivo con navegador. Hacer esa revisión en el equipo de entrega siguiendo el README.

## Pruebas incluidas

- Suma, resta, producto, división, módulo y raíz cuadrada de complejos.
- Semillas iniciales del ejemplo oficial.
- Convergencia alrededor de x = 4 en el caso UDES.
- Estructura de las 16 columnas del historial.
- Discriminante y coeficientes de la interpolación.
- Elección del denominador de mayor módulo.
- `f(x) = x² + 1` y resultado complejo.
- Semillas explícitamente complejas.
- `f(x) = x - 2` y caso lineal (a = 0).
- Detección de raíz exacta inicial.
- Manejo de función constante, semillas repetidas, tolerancia inválida y límite de iteraciones.
- Caso x₃ = 0 (error relativo porcentual indefinido).
- Convergencia Secante y Newton–Raphson para el caso UDES.
- Comparación de los tres algoritmos.
- `f(x) = cos(x) - x` con raíz aproximada 0.7390851332.

## Ejecución

```bash
npm test
```

## Verificación de usuario pendiente

1. Ejecutar `npm install` con Internet.
2. Ejecutar `npm run build` y `npm run preview`.
3. Probar en la UI cada uno de los ejemplos, el deslizador, los botones de navegación y la exportación CSV.
4. Importar el proyecto a Vercel y verificar la URL de producción real.
