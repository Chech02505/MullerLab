# Guía de entrega del proyecto — MüllerLab

**Estudiante:** Sergio Andres Cristancho Moreno  
**Código:** 01240371021  
**Asignatura:** Métodos Numéricos  
**Universidad:** Universidad de Santander — UDES

## Qué debe entregarse

Entregar la carpeta completa con **código fuente React + Vite** y `README.md`. Preferentemente, subir la carpeta sin `node_modules` ni `dist` a un repositorio público y entregar la URL de GitHub y la URL real de Vercel.

Si el docente acepta un archivo comprimido, entregar el ZIP completo sin eliminar el `package.json`, `README.md`, `src/`, `public/`, `vite.config.js` y `vercel.json`.

## Comprobación previa (en el computador)

```bash
npm install
npm test
npm run dev
```

En Chrome, Edge o Firefox:

1. Comprobar que aparece el panel Laboratorio.
2. Cargar el Ejemplo Oficial UDES y verificar la raíz próxima a 4.
3. Mover el deslizador de iteraciones y ver cómo cambia la parábola.
4. Exportar la tabla de resultados CSV.
5. Probar `x^2+1` y confirmar que aparece una raíz imaginaria `i` y el plano de Argand.
6. Abrir Duelo de métodos y Teoría y fórmulas.
7. Probar el diseño en el navegador con el ancho de pantalla pequeño.
8. Ejecutar `npm run build` sin errores.

## Instrucciones mínimas para GitHub y Vercel

Crear un repositorio público de GitHub, subir todos los archivos del proyecto y conectarlo desde Vercel → **Add New → Project**. Usar Framework **Vite**, comando de construcción `npm run build` y carpeta de salida `dist`. No se necesitan variables de entorno.

## Qué explicar en una revisión

- El método utiliza tres puntos y ajusta una parábola interpolante.
- `h0`, `h1`, `δ0` y `δ1` definen los coeficientes `a`, `b`, `c`.
- Para calcular `x3` se elige el denominador de mayor módulo.
- La raíz real o compleja se muestra junto con el residuo y el error porcentual estimado.
- Las operaciones se hacen en el navegador; no hay servidor de cálculo.
- La visualización real de la parábola se oculta si los coeficientes son complejos; en ese caso se muestra Argand.

## Datos faltantes por completar

- **URL del repositorio público en GitHub:** Pendiente de subir a cuenta del estudiante.
- **URL pública de Vercel:** Pendiente de realizar el primer despliegue.

No se deben inventar enlaces: las URLs se completan al publicar los recursos reales.
