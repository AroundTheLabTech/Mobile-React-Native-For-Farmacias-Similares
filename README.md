This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# Need to execute pod install:
cd ios && pod install && cd ..

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Empaquetado

Construir un APK para Android:

### 1. **Limpiar el Proyecto**
Antes de construir el APK, es recomendable limpiar el proyecto para asegurarse de que no haya caché o archivos viejos que puedan causar problemas.

```bash
cd android
./gradlew clean
cd ..
```

### 2. **Construir el APK en Modo Debug (Para pruebas rápidas)**
Para generar un APK en modo **debug**, usa el siguiente comando:

```bash
npx react-native run-android
```

Esto generará un APK de **debug** y lo instalará en tu dispositivo o emulador. El APK se encuentra en:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. **Construir el APK en Modo Release (Versión Final)**
Para generar un APK en **modo release**, primero asegúrate de tener configurados los detalles de la firma (keystore) en el archivo `android/app/build.gradle`.

Si aún no has configurado tu keystore, sigue estos pasos:

#### **Configurar la Firma (Keystore)**
- Crea un archivo **keystore** con el siguiente comando:
  
  ```bash
  keytool -genkeypair -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
  ```

- Luego, agrega la configuración del keystore en el archivo `android/app/build.gradle` dentro de la sección `signingConfigs`:

  ```gradle
  signingConfigs {
      release {
          storeFile file('path/to/my-release-key.keystore')
          storePassword 'password'
          keyAlias 'my-key-alias'
          keyPassword 'password'
      }
  }
  ```

  Asegúrate de que la ruta y las contraseñas estén correctas.

- Luego, dentro de la sección `buildTypes`, agrega la configuración de la firma para **release**:

  ```gradle
  buildTypes {
      release {
          signingConfig signingConfigs.release
          // Otras configuraciones como proguard, etc.
      }
  }
  ```

#### **Generar el APK de Release**

Una vez configurado el keystore, puedes generar el APK en modo **release** con este comando:

```bash
cd android
./gradlew assembleRelease
cd ..
```

Este comando generará el APK de release y lo ubicará en:

```
android/app/build/outputs/apk/release/app-release.apk
```

Este APK está listo para distribución, ya sea para probar en dispositivos reales o para subir a tiendas de aplicaciones como Google Play.

### 4. **Generar APK para Firmar Manualmente**

Si no deseas configurar un keystore, también puedes generar un APK en **release** sin firmarlo y luego firmarlo manualmente con el siguiente comando:

```bash
cd android
./gradlew assembleRelease -Dsigning.keyAlias=my-key-alias -Dsigning.keyPassword=my-key-password -Dsigning.storeFile=path/to/my-release-key.keystore -Dsigning.storePassword=my-key-store-password
cd ..
```

Esto generará el APK sin firma, y puedes firmarlo después con las herramientas de Java.

### Resumen de Comandos:
1. **Limpiar el proyecto**:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. **Generar APK de Debug**:
   ```bash
   npx react-native run-android
   ```

   2.1 **Generar APK de Debug**:
   ```bash
   npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
   ```


3. **Generar APK de Release**:
   ```bash
   cd android
   ./gradlew assembleRelease
   cd ..
   ```

## Eliminar el caché de la app

### Limpiar la caché de **Gradle** (Android)

1. **Eliminar la caché de Gradle manualmente:**

   Gradle guarda los archivos de caché en el directorio `.gradle` dentro de tu proyecto y también en la caché global de Gradle. Para limpiar la caché de Gradle, puedes hacer lo siguiente:

   - Navega hasta la carpeta de tu proyecto React Native.
   - Borra el directorio `.gradle` dentro de la carpeta del proyecto. Puedes hacerlo manualmente o con el siguiente comando en la terminal:
     
     ```bash
     rm -rf android/.gradle
     ```

   - También puedes limpiar la caché global de Gradle (en tu sistema) ejecutando el siguiente comando en tu terminal:

     ```bash
     gradle cleanBuildCache
     ```

2. **Limpiar la caché de la build de Android:**

   Gradle también guarda ciertos archivos de construcción intermedios en la carpeta `android/build`. Para limpiar estos archivos, ve a la carpeta de tu proyecto y elimina el directorio `build` de Android:

   ```bash
   rm -rf android/build
   ```

### Limpiar la caché de **React Native** (npm)

A veces, la caché de los paquetes de **npm** puede causar problemas al ejecutar la aplicación. Puedes limpiar la caché de npm con el siguiente comando:

```bash
npm cache clean --force
```

### Pasos completos para limpiar todo

Para asegurarte de que todo esté limpio, sigue estos pasos:

1. **Eliminar caché de Gradle y archivos de build:**
   
   En tu terminal, ejecuta los siguientes comandos:

   ```bash
   rm -rf android/.gradle
   rm -rf android/build
   ```

2. **Limpiar caché de npm:**

   ```bash
   npm cache clean --force
   ```

3. **Reinstalar las dependencias de npm:**

   Asegúrate de que las dependencias estén actualizadas después de limpiar la caché:

   ```bash
   npm install
   ```

4. **Ejecutar la aplicación de nuevo:**

   Ahora puedes intentar ejecutar de nuevo la aplicación en Android con:

   ```bash
   npm run android
   ```

### Usar **Gradle Wrapper** para limpiar caché

Si no estás seguro de la configuración de Gradle, también puedes usar el **Gradle Wrapper** (en lugar de Gradle global) para limpiar los archivos de caché y realizar una compilación limpia. Ejecuta el siguiente comando dentro del directorio `android/` de tu proyecto:

```bash
cd android
./gradlew clean
```

Este comando elimina las compilaciones anteriores y limpia la caché de Gradle de manera más controlada.

### Resumen

- Elimina manualmente el directorio `.gradle` dentro de `android/` y el directorio `build/` de la misma carpeta.
- Limpia la caché de npm con `npm cache clean --force`.
- Ejecuta `npm install` para reinstalar las dependencias.
- Usa `./gradlew clean` en la carpeta `android` para limpiar la caché de Gradle si es necesario.

Para **iOS** en un proyecto de **React Native**, también es posible que la caché de la construcción y las dependencias de **CocoaPods** causen problemas. Aquí te dejo los pasos para limpiar la caché y asegurarte de que la app se compile correctamente en iOS:

### 1. Limpiar la caché de **CocoaPods**

CocoaPods maneja las dependencias de iOS. Puedes limpiar la caché de CocoaPods con el siguiente comando:

```bash
pod cache clean --all
```

Esto eliminará la caché de todos los pods descargados, lo que es útil si estás teniendo problemas con dependencias desactualizadas o corruptas.

### 2. Limpiar los archivos de construcción de Xcode

Los archivos generados por Xcode también pueden estar causando problemas. Puedes limpiar los archivos de construcción con:

```bash
cd ios
xcodebuild clean
```

Este comando limpiará el directorio de construcción de Xcode. Después de esto, Xcode volverá a construir la aplicación desde cero la próxima vez que la ejecutes.

### 3. Eliminar y reinstalar los Pods

A veces, eliminar y reinstalar los **Pods** puede resolver problemas relacionados con dependencias en iOS. Sigue estos pasos:

1. Navega a la carpeta `ios` de tu proyecto React Native.
   
2. Elimina el directorio `Pods/` y el archivo `Podfile.lock`:

   ```bash
   rm -rf Pods
   rm -rf Podfile.lock
   ```

3. Luego, reinstala los pods:

   ```bash
   pod install
   ```

   Este comando reinstalará todas las dependencias de CocoaPods.

### 4. Limpiar la caché de **npm** o **yarn**

Al igual que con Android, es posible que la caché de npm o yarn esté afectando la construcción. Para limpiar la caché de npm, puedes ejecutar:

```bash
npm cache clean --force
```

Si usas **Yarn**, puedes limpiar su caché con:

```bash
yarn cache clean
```

### 5. Eliminar el directorio de **build** de iOS

El directorio `build` contiene archivos de compilación intermedios. Puedes eliminarlo manualmente con:

```bash
rm -rf ios/build
```

Esto garantiza que se genere una compilación limpia la próxima vez que construyas la aplicación.

### 6. Ejecutar la aplicación en iOS

Finalmente, después de limpiar la caché, puedes ejecutar la aplicación en iOS con:

```bash
npx react-native run-ios
```

O si estás usando un dispositivo físico o un simulador específico, puedes usar:

```bash
npx react-native run-ios --device "NombreDelDispositivo"
```

### Resumen de los pasos para iOS:

1. **Limpiar la caché de CocoaPods:**

   ```bash
   pod cache clean --all
   ```

2. **Limpiar la construcción de Xcode:**

   ```bash
   cd ios
   xcodebuild clean
   ```

3. **Eliminar y reinstalar los Pods:**

   ```bash
   rm -rf Pods
   rm -rf Podfile.lock
   pod install
   ```

4. **Limpiar la caché de npm o yarn:**

   ```bash
   npm cache clean --force
   ```

   o

   ```bash
   yarn cache clean
   ```

5. **Eliminar la carpeta `build`:**

   ```bash
   rm -rf ios/build
   ```

6. **Ejecutar la aplicación en iOS:**

   ```bash
   npx react-native run-ios
   ```

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
