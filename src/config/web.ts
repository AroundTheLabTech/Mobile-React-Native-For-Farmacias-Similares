// La app muestra la web de SimiJuegos por dentro (src/screens/WebShell): un solo diseño y un solo
// código de interfaz para web y app. Lo que se publica en la web sale en la app sin compilar.
// (Para volver a las pantallas propias de la app: ver el comentario de App.tsx.)

// Sitio que abre la app.
//   Pruebas:  https://simijuegos-pruebas.late-limit-0cf9.workers.dev
//   Oficial:  https://simijuegos.com.mx
// Build 30 (TestFlight, para revisar): abre el sitio de pruebas, que ya tiene la rama plataforma-nueva
// del repo de la web. Antes de mandar a la App Store se cambia a https://simijuegos.com.mx en otro
// build, una vez que plataforma-nueva esté en master (la web nueva publicada).
export const WEB_BASE_URL = 'https://simijuegos-pruebas.late-limit-0cf9.workers.dev';
