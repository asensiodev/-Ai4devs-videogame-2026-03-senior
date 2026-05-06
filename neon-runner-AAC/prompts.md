# Prompts para desarrollar `neon-runner-AAC`

Objetivo: crear un juego runner **basico**, estilo **retro arcade**, controlado **solo con teclado** y **sin assets externos**.

## Prompt 0 - Contexto inicial del agente

```text
Quiero que actues como desarrollador senior frontend y construyas un juego web completo dentro de esta carpeta.

Contexto del proyecto:
- Nombre del juego: Neon Runner
- Carpeta: neon-runner-AAC
- Tipo: runner 2D basico
- Estilo visual: retro arcade (neon, scanlines suaves, pixel vibe)
- Control: solo teclado
- Recursos: sin imagenes ni audios externos (todo con HTML/CSS/JS)
- Tecnologias: HTML, CSS y JavaScript vanilla

Requisitos funcionales minimos:
1) Pantalla de inicio con instrucciones de controles.
2) Personaje que puede saltar para esquivar obstaculos.
3) Obstaculos que vienen de derecha a izquierda.
4) Deteccion de colisiones.
5) Sistema de puntuacion por tiempo/supervivencia.
6) Game over y opcion de reiniciar con teclado.
7) Todo jugable en navegador moderno.

Requisitos de estructura:
- Crea y usa estos archivos:
  - neon-runner-AAC/index.html
  - neon-runner-AAC/styles.css
  - neon-runner-AAC/game.js
- Mantener codigo claro y comentado solo donde aporte.

Antes de generar codigo:
- Explica en 6-10 bullets la arquitectura del juego y el bucle principal.
- Luego implementa una primera version completamente funcional.
```

## Prompt 1 - Refinar estructura y calidad del codigo

```text
Revisa y mejora la implementacion actual del juego Neon Runner con enfoque en mantenibilidad.

Quiero que:
1) Separes claramente estado del juego, render y logica de fisica.
2) Definas constantes configurables al inicio (gravedad, salto, velocidad, frecuencia de obstaculos, etc.).
3) Evites numeros magicos.
4) Asegures que no haya errores de scope o variables globales innecesarias.
5) Mantengas el comportamiento de runner basico.

Entrega:
- Cambios aplicados en index.html, styles.css y game.js.
- Breve explicacion de por que cada mejora aporta robustez.
```

## Prompt 2 - Pulir jugabilidad basica

```text
Quiero mejorar la sensacion de juego sin aumentar complejidad.

Aplica estos ajustes:
- Jump feel mas consistente (evitar dobles saltos accidentales).
- Dificultad progresiva suave: la velocidad aumenta poco a poco.
- Spawn de obstaculos con variacion controlada para que sea justo.
- Hitbox razonable para que no se sienta injusto.
- Reinicio rapido con tecla R cuando hay game over.

Importante:
- Sigue siendo un runner basico.
- Nada de assets externos.
- Mantener compatibilidad con Chrome, Firefox y Safari.
```

## Prompt 3 - Estetica retro arcade (sin assets)

```text
Mejora la presentacion visual del juego para estilo retro arcade neon, sin usar imagenes externas.

Quiero:
1) Fondo oscuro con detalles neon.
2) Tipografia con vibe arcade usando fuentes del sistema (sin importar fuentes externas).
3) Efecto visual sutil tipo scanline o glow, sin afectar rendimiento.
4) UI clara para score, estado del juego e instrucciones.
5) Responsive basico para escritorio y portatil.

No rompas la jugabilidad actual. Si tocas estilos estructurales, ajusta el layout para que siga centrado y limpio.
```

## Prompt 4 - Validacion tecnica automatizada basica

```text
Actua como QA tecnico del juego y realiza una validacion estructurada.

Tareas:
1) Revisa posibles errores logicos y edge cases (colisiones, reinicio, score, dificultad).
2) Propone y aplica pequenas correcciones necesarias.
3) Verifica accesibilidad basica de teclado (focus, inicio/reinicio con teclas).
4) Revisa rendimiento basico (evitar work innecesario por frame).

Luego entrega:
- Checklist de validacion con estado: OK / Ajustado / Pendiente.
- Lista de cambios aplicados.
- Riesgos residuales si los hubiera.
```

## Prompt 5 - Ultima pasada de limpieza

```text
Haz una pasada final de calidad sobre neon-runner-AAC:

- Simplifica codigo repetido.
- Mejora nombres de variables/funciones poco claros.
- Elimina codigo muerto si existe.
- Revisa que no haya warnings evidentes.
- Asegura que la experiencia final sea consistente.

Al final, entrega:
1) Resumen corto de mejoras finales.
2) Lista de controles del juego.
3) Confirmacion de archivos finales del juego.
```

## Recomendacion de uso

1) Abre una sesion nueva del agente en la raiz del repo.  
2) Pega `Prompt 0` y deja que implemente.  
3) Ejecuta los prompts del 1 al 4 y luego el 6, uno por uno.  
4) Si en algun paso rompe algo, vuelve al prompt anterior con:  
   "manteniendo todo lo que ya funciona, corrige solo X sin reescribir todo".
