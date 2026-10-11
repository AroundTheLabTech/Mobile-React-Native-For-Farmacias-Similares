// La app muestra la web de SimiJuegos por dentro (src/screens/WebShell): un solo diseño y un solo
// código de interfaz para web y app. Lo que se publica en la web sale en la app sin compilar.
// (Para volver a las pantallas propias de la app: ver el comentario de App.tsx.)

// Sitio que abre la app.
//   Pruebas:  https://simijuegos-pruebas.late-limit-0cf9.workers.dev
//   Oficial:  https://simijuegos.com.mx
// Builds 30 y 31 (TestFlight, para revisar): abren el sitio de pruebas, que tiene la rama plataforma-nueva
// del repo de la web, ya con los duelos entre amigos (se juntaron el 11 oct 2026).
// (Hay otro enlace, simijuegos-comunidad, para probar cambios de comunidad antes de pasarlos al de
// pruebas. La app no lo abre, pero sí acepta sus enlaces de duelo: ver SITIOS en WebShell.tsx.)
// Antes de mandar a la App Store se cambia a https://simijuegos.com.mx en otro build, una vez que la web
// nueva esté en master.
export const WEB_BASE_URL = 'https://simijuegos-pruebas.late-limit-0cf9.workers.dev';
