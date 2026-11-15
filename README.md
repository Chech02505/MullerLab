# MüllerLab · UDES — Proyecto Final de Métodos Numéricos

**Aplicación web interactiva para encontrar raíces reales y complejas con el método de Müller.**

| Información académica | Detalle |
| --- | --- |
| Universidad | Universidad de Santander — UDES |
| Programa | Ingeniería de Software |
| Asignatura | Métodos Numéricos |
| Autor | Sergio Andres Cristancho Moreno |
| Código estudiantil | 01240371021 |
| Año | 2026 |

Link de VERCEL para usar proyecto: https://muller-lab.vercel.app?utm_source=chatgpt.com

## 1. Descripción general

MüllerLab permite escribir una ecuación no lineal `f(x) = 0`, configurar tres aproximaciones iniciales, la tolerancia y el número máximo de iteraciones, y estudiar el procedimiento completo del **método de Müller**. La interfaz presenta la solución, el residuo, las iteraciones, una visualización geométrica y una comparación con los métodos de la Secante y Newton–Raphson.

Es una SPA (Single Page Application) sin servidor de aplicación ni base de datos: **todos los cálculos se ejecutan en el navegador** y el despliegue requiere solamente hospedaje de archivos estáticos. No recopila información personal ni transmite las funciones a un servicio remoto.

### Funcionalidades

- Calculadora de Müller para ecuaciones reales y complejas.
- **Botón “Cargar Ejemplo Oficial UDES”** que rellena `f(x)=x^3-13*x-12`, `x0=4.5`, `x1=5.5`, `x2=5.0`; contiene la raíz exacta `x=4`.
- Funciones con notación de `mathjs`: `x^3`, `sqrt(x)`, `sin(x)`, `cos(x)`, `exp(x)`, etc.; admite semillas complejas como `1+2i`.
- Selección de rama estable para el denominador y aritmética completa de los números complejos.
- Tabla con las **16 columnas**: iteración, x₀, x₁, x₂, h₀, h₁, δ₀, δ₁, a, b, c, discriminante, denominador, x₃, f(x₃) y error relativo porcentual εₐ.
- Exportación de todas las iteraciones a `CSV` con separador `;` y UTF-8 (compatible con Excel en español).
- Gráfica SVG del plano cartesiano con `f(x)`, la parábola interpolante, los tres puntos y la raíz `P(x₃)=0`, navegable con botones y control deslizante.
- Plano de Argand cuando los puntos de la iteración son complejos; una curva compleja **no se representa incorrectamente** en el plano cartesiano real.
- Comparación con Secante (partiendo de x₁ y x₂) y Newton-Raphson (partiendo de x₂, con derivada numérica por diferencias centrales).
- Sección de teoría con la derivación, estabilidad numérica, condiciones de parada, ventajas, limitaciones y bibliografía.
- Diseño adaptable a escritorio, tableta y móvil, en español y con estados accesibles.

## 2. Tecnologías

| Tecnología | Uso |
| --- | --- |
| **React 19** | Componentes, estado, navegación y controles |
| **Vite 7** | Servidor local, construcción optimizada de archivos estáticos |
| **Tailwind CSS 4** | Motor CSS utilitario integrado mediante `@tailwindcss/vite`, complementado con estilos propios |
| **mathjs 15** | Analizador, verificación y evaluación segura de expresiones matemáticas con valores complejos |
| **SVG dinámico** | Plano cartesiano, parábola de interpolación, Argand y gráfico comparativo sin servicios externos |
| **JavaScript ES Modules** | Motor numérico, exportación CSV y pruebas automatizadas |
| **lucide-react** | Iconografía de la interfaz |
| **GitHub + Vercel** | Almacenamiento del código y publicación estática |

No se requieren variables de entorno, cuentas de base de datos, API keys, ni un backend.

## 3. Requisitos

- Node.js **20.19.0 o superior**, recomendado Node.js 22 LTS.
- npm incluido con Node.js.
- Navegador actualizado (Chrome, Edge, Firefox, Safari).
- Conexión a Internet **solo para instalar las dependencias** y desplegar; la app construida funciona sin peticiones de red adicionales para los cálculos.

## 4. Instalación local, paso a paso

1. Descarga y descomprime el archivo ZIP.
2. Abre la carpeta `UDES_Muller_Lab_Sergio_Cristancho` en Visual Studio Code.
3. Abre **Terminal → Nueva terminal**.
4. Instala las dependencias:

   ```bash
   npm install
   ```

5. Inicia el servidor local:

   ```bash
   npm run dev
   ```

6. Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.
7. Pulsa **Cargar Ejemplo Oficial UDES** o escribe una función y selecciona **Calcular raíz**.
8. Para detener el servidor usa `Ctrl + C`.

> **Importante:** `index.html` no se debe abrir con doble clic ni solo con Live Server sin instalar dependencias: es un proyecto React + Vite. La instalación correcta se hace con `npm install` seguido de `npm run dev`.

### Compilación final

```bash
npm run build
npm run preview
```

El resultado de `npm run build` se ubica en `dist/`. `npm run preview` solo sirve para previsualización local.

### Pruebas unitarias

```bash
npm test
```

Se incluyen **38 pruebas unitarias** sobre el motor aritmético y el algoritmo, con casos de uso reales, complejos, degeneraciones, control de entradas y comparación con otros métodos. No requieren iniciar el servidor.

## 5. Ejemplo oficial UDES

Función:

```text
f(x) = x^3 - 13x - 12
x0 = 4.5
x1 = 5.5
x2 = 5.0
Tolerancia = 1e-8
Iteraciones máximas = 35
```

La función tiene **tres raíces reales** (`-3`, `-1`, `4`). Con las semillas anteriores, Müller converge a la raíz **x ≈ 4**. Se puede validar sustituyendo: `4^3 - 13*4 - 12 = 64 - 52 - 12 = 0`.

Para demostrar la aritmética compleja: `f(x)=x^2+1`, `x0=-1`, `x1=0`, `x2=1`. En este caso la función no posee raíces reales, pero Müller calcula **i** (o la raíz conjugada según la rama empleada).

## 6. Guía de uso

1. **Laboratorio:** configura la expresión, los puntos y los parámetros. Los campos iniciales permiten complejos (`2+3i`).
2. Haz clic en **Calcular raíz**. Si se introduce una función mal escrita, semillas duplicadas, una división por cero o no converge, se muestra una advertencia controlada.
3. En la tarjeta de resultado revisa la raíz aproximada, residuo, cantidad de iteraciones y estado.
4. En el panel de gráfica mueve el control de iteraciones o pulsa las flechas. Los puntos x₀, x₁, x₂ y la nueva aproximación cambian en cada paso.
5. Desplázate hasta **Tabla de iteraciones**, selecciona filas para visualizarlas y usa **Exportar CSV**.
6. Abre **Duelo de métodos** para comparar residuo y cantidad de iteraciones.
7. Abre **Teoría y fórmulas** para revisar la deducción y criterios de parada.

## 7. Modelo matemático y estabilidad

Sean `h0=x1-x0`, `h1=x2-x1`, `δ0=(f(x1)-f(x0))/h0` y `δ1=(f(x2)-f(x1))/h1`. Definimos la parábola `P(t)=a t² + b t + c`, con `t=x-x2`, y

```text
a = (δ1 - δ0) / (h0 + h1)
b = a*h1 + δ1
c = f(x2)
Δ = b² - 4ac
x3 = x2 - 2c / (b ± sqrt(Δ))
```

Se selecciona el denominador con **mayor módulo**, reduciendo la cancelación numérica; funciona también cuando el discriminante y los coeficientes son complejos. El motor realiza todas estas operaciones con aritmética compleja propia, mientras que `mathjs` se utiliza para analizar/evaluar la función introducida.

### Error relativo porcentual aproximado

```text
εa (%) = |(x3 - x2) / x3| × 100
```

Si `x3=0`, este error no está definido; se muestra `n/d` y se usa el cambio absoluto en el criterio de convergencia.

### Criterio de parada

Convergencia si se cumple alguna condición:

- `|f(x3)| <= tolerancia`, o
- `|x3-x2| <= tolerancia * max(1, |x3|)`.

Al alcanzar el límite de iteraciones se informa sin afirmar una convergencia inexistente. El programa detecta también división por cero y estancamiento.

## 8. Estructura del proyecto

```text
UDES_Muller_Lab_Sergio_Cristancho/
├── README.md
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
├── .github/workflows/ci.yml  # Tests y build automáticos en GitHub
├── index.html
├── public/
│   └── favicon.svg
├── docs/
│   ├── GUIA_ENTREGA.md
│   └── VERIFICACION.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── components/
    │   ├── Graph.jsx
    │   ├── Comparison.jsx
    │   ├── IterationTable.jsx
    │   └── Theory.jsx
    ├── lib/
    │   ├── complex.js
    │   ├── solver.js
    │   ├── expression.js
    │   ├── example.js
    │   └── export.js
    └── tests/
        ├── complex.test.js
        └── solver.test.js
```

## 9. Limitaciones y consideraciones técnicas

1. **No garantiza convergencia** para toda función o elección de puntos.
2. En funciones con singularidades, discontinuidades, derivadas no analíticas (`abs`, `conj`, `re`, `im`) o valores inmensos, el resultado puede divergir; Newton y Secante se ofrecen solo como referencia de cálculo.
3. La comparación no implica superioridad universal: Secante utiliza los últimos dos puntos y Newton el último punto con una derivada numérica.
4. Para funciones complejas la gráfica cartesiana solamente muestra el comportamiento sobre el eje real cuando f(x) es real; los puntos complejos se presentan en el plano de Argand. No es correcto dibujar en 2D real una parábola con coeficientes complejos como si fuera una parábola real.
5. Las expresiones matemáticas admiten funciones y operadores autorizados, pero bloquean asignaciones, acceso a objetos, matrices y expresiones de programación para limitar posibles abusos. La evaluación no usa `eval` de JavaScript.
6. No se almacenan resultados entre sesiones. Para guardarlos debe exportarse la tabla CSV.
7. Los cálculos emplean precisión de coma flotante IEEE-754 de JavaScript, con redondeo limitado.
8. La aplicación no resuelve polinomios de modo simbólico ni encuentra automáticamente todas sus raíces; se centra en el método iterativo de Müller.

## 10. Integridad de la entrega

- Se incluye **código fuente editable**, no una captura ni maqueta sin funcionalidad.
- Las 38 pruebas del motor numérico se ejecutaron con éxito en Node.js 22.
- Los archivos `.jsx` se verificaron sintácticamente mediante el compilador TypeScript compatible con JSX.
- **Validación pendiente en el entorno de entrega**: al preparar este paquete no se pudo descargar dependencias desde npm por restricciones de red del entorno de construcción; por tanto, la compilación Vite y la revisión visual en un navegador no se afirman como realizadas. Se recomienda ejecutar `npm install`, `npm run build` y hacer una prueba rápida en el computador antes de entregar o publicar.

---

**Autor:** Sergio Andres Cristancho Moreno · **Código:** 01240371021 · **Universidad de Santander – UDES**
