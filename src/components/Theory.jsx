import React from 'react';
import { BookOpen, Boxes, CircleHelp, Code2, ExternalLink, ShieldCheck, Sigma, Sparkles } from 'lucide-react';

function Formula({children}){return <div className="formula">{children}</div>;}
export default function Theory() {
  return <div className="theory-layout">
    <section className="surface theory-intro"><div className="tiny-eyebrow">Fundamentación matemática</div><h2>El método de Müller, desde la interpolación hasta la raíz.</h2><p>Es un método abierto que construye un polinomio cuadrático a partir de tres puntos de la función. Selecciona una intersección de la parábola con el eje horizontal para producir la siguiente aproximación.</p><div className="theory-pills"><span>Tres puntos iniciales</span><span>Interpolación de grado 2</span><span>Aritmética compleja</span></div></section>
    <section className="surface theory-section"><div className="theory-number">01</div><h3>Construcción de la parábola</h3><p>Dados tres puntos distintos x₀, x₁ y x₂, definimos los desplazamientos y las pendientes divididas de la función:</p>
      <Formula>h₀ = x₁ − x₀&nbsp;&nbsp;&nbsp;&nbsp; h₁ = x₂ − x₁</Formula>
      <Formula>δ₀ = (f(x₁) − f(x₀)) / h₀</Formula>
      <Formula>δ₁ = (f(x₂) − f(x₁)) / h₁</Formula>
      <p>Se interpola respecto de la referencia x₂, con el cambio de variable t = x − x₂:</p><Formula>P(t) = a t² + b t + c</Formula><p>Las condiciones P(0)=f(x₂), P(−h₁)=f(x₁) y P(−h₁−h₀)=f(x₀) permiten obtener:</p>
      <Formula>a = (δ₁ − δ₀) / (h₀ + h₁)</Formula><Formula>b = a h₁ + δ₁&nbsp;&nbsp;&nbsp;&nbsp; c = f(x₂)</Formula>
    </section>
    <section className="surface theory-section"><div className="theory-number">02</div><h3>Fórmula de recurrencia</h3><p>Al imponer P(t)=0, la fórmula cuadrática proporciona las dos posibles raíces del polinomio interpolante:</p>
      <Formula>t = (−b ± √(b² − 4ac)) / (2a)</Formula>
      <p>Para mejorar la estabilidad numérica, se multiplica por el conjugado algebraico y se usa una expresión equivalente:</p>
      <Formula>t = −2c / (b ± √(b² − 4ac))</Formula>
      <Formula>x₃ = x₂ − 2c / (b ± √(b² − 4ac))</Formula>
      <p>La implementación elige entre los signos + y − el que produce el <strong>denominador de mayor módulo</strong>, evitando restar cantidades casi iguales y reduciendo la cancelación numérica. Para valores reales se relaciona con la elección sign(b) · √Δ; en complejos se comparan los módulos directamente.</p>
    </section>
    <section className="surface theory-section"><div className="theory-number">03</div><h3>Actualización y criterio de parada</h3><p>En cada iteración, se desplaza la ventana: (x₀, x₁, x₂) ← (x₁, x₂, x₃). Se vuelve a interpolar hasta cumplir la tolerancia o alcanzar el máximo permitido.</p>
      <Formula>εₐ (%) = |(x₃ − x₂) / x₃| × 100</Formula>
      <p>Cuando x₃ = 0, el error relativo porcentual no está definido; en ese caso se visualiza «n/d». La aplicación detiene la iteración si |f(x₃)| ≤ tol o si |x₃−x₂| ≤ tol · max(1, |x₃|). La tolerancia se interpreta en unidades de residuo y paso, <strong>no como porcentaje directo</strong>.</p>
    </section>
    <section className="surface theory-section"><div className="theory-number">04</div><h3>Complejos y discriminante</h3><p>La cantidad Δ = b² − 4ac puede tener raíz cuadrada no real. Por ejemplo, con f(x)=x²+1 y semillas −1, 0 y 1, la parábola es exactamente la función original: Müller puede hallar i o −i, aunque no exista raíz real.</p>
      <Formula>√(−1) = i&nbsp;&nbsp;&nbsp;&nbsp; i² = −1</Formula>
      <p>Las operaciones de suma, producto, cociente, módulo y raíz cuadrada se calculan en ℂ. Cuando las aproximaciones salen del eje real, el panel gráfico conserva f(x) sobre x real y muestra, adicionalmente, la trayectoria de aproximaciones en el plano de Argand.</p>
    </section>
    <section className="surface theory-section"><div className="theory-number">05</div><h3>Ventajas y limitaciones</h3>
      <div className="theory-columns"><div><h4>Ventajas</h4><ul><li>Emplea información de curvatura de tres evaluaciones.</li><li>No exige derivadas exactas.</li><li>Permite iteraciones y soluciones complejas.</li><li>Puede converger rápidamente con puntos iniciales adecuados.</li></ul></div><div><h4>Limitaciones</h4><ul><li>No garantiza hallar todas las raíces ni converger siempre.</li><li>Puede fallar si los puntos coinciden, si los denominadores se anulan o cerca de singularidades.</li><li>La selección de la rama puede influir en la raíz encontrada.</li><li>La estabilidad depende del redondeo y de la función utilizada.</li></ul></div></div>
      <p className="theory-note">La comparación con Secante y Newton-Raphson es experimental, con semillas especificadas. No implica que Müller sea universalmente superior.</p>
    </section>
    <section className="surface theory-section"><div className="theory-number">06</div><h3>Bibliografía y recursos de consulta</h3><p>Estas fuentes sirven para estudiar la formulación y el funcionamiento de la aplicación:</p><ul className="references"><li>Burden, R. L., & Faires, J. D. (2011). <em>Numerical analysis</em> (9th ed.). Brooks/Cole.</li><li>Chapra, S. C., & Canale, R. P. (2015). <em>Numerical methods for engineers</em> (7th ed.). McGraw-Hill.</li><li>math.js. (s. f.). <em>Expression syntax and complex numbers</em>. <a href="https://mathjs.org/docs/expressions/syntax.html" target="_blank" rel="noreferrer">mathjs.org/docs <ExternalLink size={13}/></a></li><li>Vite. (s. f.). <em>Getting started</em>. <a href="https://vite.dev/guide/" target="_blank" rel="noreferrer">vite.dev/guide <ExternalLink size={13}/></a></li></ul></section>
  </div>;
}
