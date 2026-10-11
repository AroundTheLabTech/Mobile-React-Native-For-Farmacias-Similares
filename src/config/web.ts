// La app muestra la web de SimiJuegos por dentro (src/screens/WebShell): un solo diseño y un solo
// código de interfaz para web y app. Lo que se publica en la web sale en la app sin compilar.
// (Para volver a las pantallas propias de la app: ver el comentario de App.tsx.)

// Sitio que abre la app.
//   Pruebas (juegos, rama plataforma-nueva):          https://simijuegos-pruebas.late-limit-0cf9.workers.dev
//   Pruebas de comunidad (actualizacion-de-comunidad): https://simijuegos-comunidad.late-limit-0cf9.workers.dev
//   Oficial:                                           https://simijuegos.com.mx
// Build 30 (TestFlight): abre el sitio de pruebas de los juegos.
// Build 31 (esta rama, actualizacion-de-comunidad): abre el sitio de pruebas de comunidad, que es donde
// están los duelos entre amigos. Cada rama de la web publica en su enlace para no borrarse entre sí
// (11 oct 2026). Al juntar comunidad con plataforma-nueva, esto regresa al sitio de pruebas de los juegos.
// Antes de mandar a la App Store se cambia a https://simijuegos.com.mx en otro build, una vez que la web
// nueva esté en master.
export const WEB_BASE_URL = 'https://simijuegos-comunidad.late-limit-0cf9.workers.dev';
