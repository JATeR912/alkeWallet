# Alke Wallet 🚀
### Módulo 2: Fundamentos del Desarrollo Front-end

Una aplicación de billetera virtual dinámica, responsiva y segura que permite a los usuarios gestionar sus activos financieros de manera digital.

---

## 🛠️ Tecnologías Utilizadas
* **HTML5:** Estructura semántica de las vistas.
* **CSS3:** Estilos personalizados, transiciones y adaptabilidad responsiva.
* **Bootstrap 4.6:** Framework de diseño para grillas responsivas, componentes visuales y modales interactivos.
* **jQuery 3.7:** Manipulación eficiente del DOM, manejo de eventos en tiempo real y efectos visuales.
* **JavaScript (ES6):** Lógica de negocio, condicionales y control aritmético.

---

## 💡 Decisiones de Arquitectura y Desarrollo

### 1. Manejo Numérico Preciso (parseInt)
Para la gestión del balance financiero, se optó conscientemente por utilizar `parseInt()`. Debido a que la moneda simulada opera exclusivamente con números enteros (como el Peso Chileno), trabajar con enteros evita el clásico "problema de punto flotante" de JavaScript (errores de precisión decimal como 0.1 + 0.2 = 0.30000000000000004). De esta manera, las operaciones aritméticas de suma y resta de dinero se mantienen 100% exactas y seguras.

### 2. Simulación de Base de Datos Local (LocalStorage)
Con el fin de cumplir con el requerimiento de un entorno dinámico y persistente sin implementar un backend real, se diseñó una estructura de datos centrada en el almacenamiento local del navegador (`LocalStorage`). 
* Los usuarios se guardan dentro de un objeto indexado por su correo electrónico.
* Cada cuenta almacena de forma independiente sus credenciales, saldo actual, agenda de contactos personalizada y su propio historial de movimientos.
* Esto permite que la información persista, evitando que los saldos se borren o se reinicien al recargar o cambiar las páginas.

### 3. Experiencia de Usuario Segura y Profesional (Modales de Confirmación)
En lugar de usar alertas nativas del navegador (`alert`, `confirm`, `prompt`) que interrumpen la experiencia del usuario, se implementaron **Modales de Bootstrap** controlados con jQuery. Las transacciones exigen la validación de un PIN secreto de 4 dígitos.

---

## 🔑 Credenciales de Prueba

Para evaluar el comportamiento completo del proyecto sin necesidad de crear una cuenta nueva, se puede utilizar el siguiente perfil el sistema:

* **Correo Electrónico:** `prueba@correo.com`
* **Contraseña:** `1234`
* **PIN de Seguridad:** `9876`
* **Saldo Inicial:** `$60.000`
---

## ⚙️ Requisitos del Sistema
Para ejecutar el proyecto de forma local, simplemente clona el repositorio y abre el archivo `index.html` en cualquier navegador web moderno.