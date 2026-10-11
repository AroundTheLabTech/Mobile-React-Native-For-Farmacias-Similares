# App de SimiJuegos (iOS y Android)

La app **muestra la web de SimiJuegos por dentro** (`src/screens/WebShell/WebShell.tsx`). Catálogo,
juegos, ranking, perfil, cuentas y borrar cuenta son de la web (repo
`Games-Platform-for-Doctor-Simi-NextJS`). Lo que se publica en la web sale en la app sin compilar ni
pasar por Apple o Google.

La app solo hace lo que la web no puede:

- Girar la pantalla según el juego (la web manda `simi:app-orientation`).
- El botón Atrás de Android (la web decide con `window.__simiAppBack`).
- La pausa al mandar la app al fondo y la pantalla de «sin conexión».
- Abrir en el navegador del teléfono los enlaces externos y las páginas legales.

## Qué se cambia aquí y qué en la web

| Quiero cambiar | Dónde |
|---|---|
| Pantallas, textos, colores, juegos, monedas, cuentas | Repo de la web. Aquí no se toca nada. |
| El sitio que abre la app | `src/config/web.ts` (`WEB_BASE_URL`) |
| Versión, ícono, nombre, permisos | `ios/` y `android/`. Necesita build nuevo y revisión de la tienda. |
| Volver a las pantallas propias de antes | `App.tsx` (ver el comentario; están en `AppClasica.tsx`) |

## Compilar iOS

Con Xcode 26 en una Mac:

```bash
npm install
cd ios && pod install && cd ..
```

Y en Xcode: abrir `ios/SimiJuegos.xcworkspace` → Product → Archive.

Lo que ya está resuelto en el repo (no hace falta hacer nada a mano):

- **Arquitectura clásica** (`ENV['RCT_NEW_ARCH_ENABLED'] = '0'` en el `Podfile`), igual que Android.
  Con la nueva, la app compila pero truena al abrir.
- **`fmt` en C++17** (en el `Podfile`): con C++20 no compila en Xcode 26.
- **`react-native-svg` 15.11.2**: la 15.12 y posteriores usan cosas de React Native 0.78+.

## Compilar Android

- `newArchEnabled=false` en `android/gradle.properties`.
- **Firma de la tienda:** las cuatro claves `MYAPP_UPLOAD_*` (archivo de la llave, alias y contraseñas)
  **no van en el repositorio**. Van en `~/.gradle/gradle.properties` de quien compila
  (Windows: `%USERPROFILE%\.gradle\gradle.properties`), junto con el archivo de la llave.
- **Versión de pruebas «SimiJuegos QA»:** `./gradlew assemblePlayQa`. Se firma con la llave de
  depuración y usa `com.simijuegos.qa`, así que se instala junto a la app de la tienda sin tocarla.
- En computadoras con poca memoria: agregar `-PSIMI_POCA_RAM`.

## Cada versión que se sube a una tienda

1. Subir la versión: `MARKETING_VERSION` y `CURRENT_PROJECT_VERSION` (iOS) y `versionName` y
   `versionCode` (Android). El número de build tiene que ser mayor que el último que se subió.
2. Subir el código a GitHub **antes** de compilar, y compilar desde ahí.
3. Al publicar, etiquetar el commit: `git tag v1.0.2-30 && git push --tags`.
