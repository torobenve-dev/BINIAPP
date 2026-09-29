# BINIVISION — Bini App

Sistema web interno para la gestión y organización de eventos de **Binivision**, desarrollado para centralizar información operativa y facilitar la planificación, armado y seguimiento de cada evento.

Bini App nace a partir de una necesidad real dentro del trabajo con eventos audiovisuales: reemplazar información dispersa entre planillas, PDFs, mensajes de WhatsApp y anotaciones manuales por una herramienta única, clara y accesible para el equipo.

---

## 🎯 Objetivo

El objetivo de Bini App es convertirse en una herramienta central de trabajo para Binivision.

La aplicación busca centralizar la información de los eventos y facilitar tareas como:

- 📅 Visualizar eventos y fechas importantes.
- 📋 Consultar la información de cada evento.
- 🎬 Organizar el armado y la operación.
- 📦 Gestionar materiales y equipamiento.
- 👥 Registrar el personal asignado.
- 🕐 Organizar horarios de armado, evento y desarme.
- 📍 Registrar locaciones y contactos.
- 📝 Documentar consideraciones importantes.
- ⚠️ Registrar problemas y situaciones posteriores al evento.
- 📊 Facilitar la planificación y coordinación del equipo.

La idea es que la información necesaria para trabajar en un evento pueda encontrarse en un solo lugar.

---

## 💡 El problema

En la operación diaria de eventos, la información puede encontrarse distribuida entre diferentes medios:

- PDFs enviados por WhatsApp.
- Planillas de Excel.
- Listados de materiales.
- Mensajes y conversaciones.
- Anotaciones en papel.
- Información transmitida verbalmente.
- Listados separados por áreas o sectores del evento.

Esto puede generar información duplicada, errores de interpretación y dificultades para saber cuál es la información actualizada.

Bini App busca centralizar este flujo de información.

---

## 🚀 Estado actual

El proyecto se encuentra en desarrollo.

Actualmente cuenta con una interfaz funcional que incluye:

- Dashboard principal.
- Calendario de eventos.
- Listado de eventos.
- Creación y edición de eventos.
- Vista detallada de cada evento.
- Información general del evento.
- Materiales.
- Personal asignado.
- Información post-evento.
- Estado del evento.
- Navegación entre las diferentes vistas.

También se mantiene la **Calculadora de Horas**, utilizada para registrar y calcular jornadas laborales.

### Estados de los eventos

Los eventos pueden encontrarse en diferentes estados:

- 🟢 **Confirmado**
- 🟡 **En armado**
- 🔵 **En operación**
- ⚫ **Finalizado**

---

## 🛠️ Tecnologías

El proyecto está desarrollado utilizando tecnologías web modernas.

### Frontend

- **React**
- **JavaScript**
- **HTML**
- **CSS**
- **Vite**

### Herramientas

- **Git**
- **GitHub**
- **Visual Studio Code**
- **npm**

---

## 📁 Estructura del proyecto

La estructura del proyecto se encuentra organizada por componentes y funcionalidades.

```text
calculadora-horas/
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Eventos.jsx
│   │   ├── EventoDetalle.jsx
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── App.css
│   └── ...
│
├── public/
│
├── package.json
├── package-lock.json
└── README.md
```

> La estructura continuará evolucionando a medida que se incorporen nuevos módulos.

---

## 📅 Próximos módulos

El proyecto está pensado para crecer progresivamente.

Entre las funcionalidades previstas se encuentran:

### Gestión de eventos

- Información completa del evento.
- Cliente / productora.
- Contactos.
- Lugar.
- Fechas y horarios.
- Consideraciones técnicas.
- Documentación relacionada.

### Materiales

Sistema para organizar el equipamiento necesario para cada evento.

La intención es poder transformar listados dispersos en un pedido de materiales claro, evitando repetir elementos que aparecen en diferentes sectores del evento.

Ejemplo:

```text
Pantalla
├── VX1000 x1
├── UTP x20
├── Escaladores x1
└── Procesadores x...

Audio
├── Consola x1
├── Micrófonos x...
└── ...

Iluminación
├── Wash x...
├── PAR x...
└── ...
```

### Personal

Registro del equipo asignado a cada evento.

### Armado y desarme

Organización de:

- Fecha de armado.
- Horario.
- Fecha del evento.
- Horario.
- Fecha de desarme.
- Horario.

### Puesta técnica

Información relacionada con:

- Pantallas LED.
- Audio.
- Iluminación.
- Señales.
- Mapping.
- Distribución técnica.
- Otros requerimientos específicos.

### Post-evento

Registro de:

- Problemas encontrados.
- Soluciones aplicadas.
- Aspectos positivos.
- Aspectos a mejorar.
- Observaciones para futuros eventos.

---

## 🧮 Calculadora de horas

Bini App también incorpora una calculadora de jornadas laborales.

Permite registrar:

- Fecha.
- Tipo de trabajador.
- Hora de entrada.
- Hora de salida.
- Horas trabajadas.
- Horas extra.

Actualmente contempla diferentes reglas según el tipo de trabajador.

Para trabajadores **fijos**, la jornada normal considerada es de:

```text
Lunes a viernes
09:00 → 18:00
```

Las horas realizadas fuera de ese horario se contabilizan como horas extra.

Para trabajadores **eventuales**, el tiempo registrado se considera directamente como horas trabajadas.

La jornada se divide por día calendario: cada jornada finaliza a las **00:00**, comenzando una nueva jornada después de ese horario.

---

## 🎨 Diseño

La interfaz busca mantener una estética sencilla, clara y orientada al uso interno.

La identidad visual toma como referencia a **BINIVISION**, utilizando el color turquesa como elemento de identidad y combinándolo progresivamente con una interfaz más limpia y profesional.

La prioridad del diseño es que la información importante pueda encontrarse rápidamente durante la preparación y operación de un evento.

---

## 🧠 Filosofía del proyecto

Bini App está siendo desarrollado a partir de problemas reales encontrados en el trabajo cotidiano.

Por eso, el desarrollo sigue una filosofía simple:

> **Primero entender el problema. Después construir la solución.**

Las funcionalidades no se agregan solamente por ser técnicamente posibles, sino porque deben resolver una necesidad concreta del equipo.

El proyecto también funciona como una experiencia práctica de desarrollo de software, aplicando conocimientos de programación a una situación real de trabajo.

---

## 🔮 Visión a futuro

La visión es convertir Bini App en una plataforma interna capaz de acompañar el ciclo completo de un evento:

```text
CLIENTE
   ↓
PLANIFICACIÓN
   ↓
EVENTO
   ↓
MATERIALES
   ↓
PERSONAL
   ↓
ARMADO
   ↓
OPERACIÓN
   ↓
DESARME
   ↓
POST-EVENTO
```

De esta manera, la información generada durante cada etapa puede mantenerse conectada y disponible para el equipo.

---

## 👨‍💻 Desarrollo

**Bini App** es un proyecto desarrollado para **Binivision** como una herramienta interna y, al mismo tiempo, como un proyecto práctico de desarrollo Full Stack.

Actualmente se encuentra en etapa de desarrollo y expansión.

---

## 📌 Nombre del proyecto

**BINIVISION — Bini App**

Proyecto activo:

```text
calculadora-horas
```

El proyecto comenzó originalmente como una calculadora de horas y evolucionó progresivamente hacia Bini App.
