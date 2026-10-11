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
- **Compartir** con la hoja del teléfono (la web manda `simi:app-share` con texto, enlace e imagen).
- **Abrir los enlaces de duelo** en la sala de ese duelo, dentro de la app.

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

**En un solo paso (compila y sube a TestFlight):**

```bash
bash subir-a-testflight.sh
```

Instala dependencias, corre `pod install`, archiva y sube el build con la firma automática del equipo
`A9T5UUZVHZ` (Xcode tiene que tener iniciada la sesión de ese equipo en Settings → Accounts). Usa el
número de build del proyecto; para otro: `BUILD=32 bash subir-a-testflight.sh`.

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

## Compartir y enlaces de duelo (rama `actualizacion-de-comunidad`, 11 oct 2026)

La web explica los duelos en `docs/RETOS-ENTRE-AMIGOS.md` (repo de la web). Aquí está la parte de la app.

**Los duelos ya están en el sitio de pruebas de siempre** (la web los juntó con `plataforma-nueva` el 11 de
octubre), así que los dos builds abren el mismo sitio (`src/config/web.ts`) y los dos los muestran:

- **Build 30** (TestFlight, `release/1.0.2`): se ven y se juegan los duelos. Pero un enlace de duelo le
  abre el navegador, no la app (ahí hay que iniciar sesión otra vez), y al compartir sale la hoja de la
  web, sin imagen.
- **Build 31** (esta rama): además, los enlaces de duelo abren la app y se comparte con la hoja del
  teléfono, con la tarjeta como imagen. **Falta compilarlo en una Mac:** `bash subir-a-testflight.sh`.
- Hay otro enlace, `simijuegos-comunidad`, donde la web prueba cambios de comunidad antes de pasarlos al
  sitio de pruebas. La app no lo abre, pero acepta sus enlaces de duelo.

**Compartir.** `WebShell.tsx` atiende `simi:app-share` y avisa a la web que sabe hacerlo
(`window.__simiApp.share`).

- iPhone: la hoja de compartir de React Native, que acepta la imagen tal cual.
- Android: React Native solo comparte texto, así que hay un módulo propio, `SimiShare`
  (`android/app/src/main/java/com/simijuegos/SimiShareModule.kt`). Guarda la tarjeta en la caché y la
  comparte con `SimiShareFileProvider` (declarado en `AndroidManifest.xml`). No agrega librerías.

**Enlaces que abren la app.** `WebShell.tsx` (`destinoDeEnlace`) solo acepta la sala de un duelo y solo
toma del enlace el código y el juego. Sitios aceptados (los mismos en `SimiJuegos.entitlements` y en
`AndroidManifest.xml`): `simijuegos.com.mx`, `www.simijuegos.com.mx` y los dos enlaces de pruebas
(`simijuegos-pruebas` y `simijuegos-comunidad`).

| Enlace | Qué hace falta para que abra la app |
|---|---|
| `simijuegos://reto?c=CÓDIGO` | Nada más: va en `Info.plist` y en `AndroidManifest.xml`. La web lo ofrece con «Abrir en la app». |
| `https://<sitio>/reto?c=CÓDIGO` en iPhone | El permiso *Associated Domains* (`ios/SimiJuegos/SimiJuegos.entitlements`) y que el sitio publique `/.well-known/apple-app-site-association` (ya está en la web, con `A9T5UUZVHZ.com.FDS.simijuegos`). |
| `https://<sitio>/reto?c=CÓDIGO` en Android | Que el sitio publique `/.well-known/assetlinks.json` con la huella SHA-256 de la firma de la app. Hoy está vacío: ver abajo. |

**Al compilar iOS:** el proyecto ahora trae `CODE_SIGN_ENTITLEMENTS`. Con firma automática, Xcode activa
*Associated Domains* en el identificador `com.FDS.simijuegos` al archivar. Si marca que el perfil no
incluye ese permiso, se activa a mano en developer.apple.com (Identifiers → `com.FDS.simijuegos` →
Associated Domains) o, para salir del paso, se quita la línea `CODE_SIGN_ENTITLEMENTS` de las dos
configuraciones del proyecto: lo demás sigue funcionando (el esquema `simijuegos://` no lo necesita).

**Para que los enlaces web abran la app en Android** falta un dato que solo está en Play Console:
la huella SHA-256 del certificado de firma de la app (Configuración → Integridad de la app). Con ella, en
el repo de la web, `public/.well-known/assetlinks.json` queda así:

```json
[{ "relation": ["delegate_permission/common.handle_all_urls"],
   "target": { "namespace": "android_app", "package_name": "com.simijuegos",
               "sha256_cert_fingerprints": ["AA:BB:..."] } }]
```

No se puso la huella de la llave de depuración (la de «SimiJuegos QA»): esa llave es pública y cualquiera
podría firmar una app que recibiera los enlaces del sitio.

**Versión de esta rama:** 1.0.2, build 31 en iOS y `versionCode` 12 en Android (el 30 y el 11 eran los
de `release/1.0.2`).

**Sin probar en teléfono.** Esto se escribió en una PC con Windows: Android compila (variante QA), iOS no
se pudo compilar ahí y nada se probó en un dispositivo. Al probar: compartir una tarjeta con imagen en
los dos sistemas y abrir un enlace de duelo con la app cerrada y con la app abierta.

## Cada versión que se sube a una tienda

1. Subir la versión: `MARKETING_VERSION` y `CURRENT_PROJECT_VERSION` (iOS) y `versionName` y
   `versionCode` (Android). El número de build tiene que ser mayor que el último que se subió.
2. Subir el código a GitHub **antes** de compilar, y compilar desde ahí.
3. Al publicar, etiquetar el commit: `git tag v1.0.2-30 && git push --tags`.
