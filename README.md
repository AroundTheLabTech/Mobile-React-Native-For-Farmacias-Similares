This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

La arquitectura hexagonal es un patrón de diseño que se centra en separar las capas de una aplicación para lograr un desacoplamiento efectivo entre la lógica del negocio y las dependencias externas (como bases de datos, APIs, frameworks, etc.). Esto se logra definiendo **puertos** (interfaces) y **adaptadores** (implementaciones de esas interfaces).

Aquí tienes una guía para implementar una arquitectura hexagonal en una aplicación **React Native**:

---

### **1. Estructura del Proyecto**
Organiza tu proyecto en directorios que representen las capas principales de la arquitectura hexagonal:

```
src/
├── app/                                       # Capa de inicio y configuración de la app (React Native)
│   ├── providers/                             # Proveedores globales de Context
│   │   ├── AuthContext.tsx
│   │   └── ...
│   ├── navigation/                            # Configuración de rutas o navegación
│   ├── config/                                # Configuración de la aplicación (constantes, env, etc.)
│   └── index.tsx                              # Punto de entrada principal
│
├── application/                               # Casos de uso y lógica de aplicación
│   ├── useCases/                              # Lógica de acciones específicas
│   │   ├── GetUsersUseCase.ts
│   │   ├── LoginUserUseCase.ts
│   │   └── ...
│   └── services/                              # Servicios que orquestan varios casos de uso
│
├── domain/                                    # Lógica de negocio
│   ├── models/                                # Entidades del dominio
│   ├── ports/                                 # Interfaces que define el dominio
│   │   ├── UserRepository.ts
│   │   └── ...
│   ├── exceptions/                            # Manejo de errores específicos del dominio
│   ├── context/                               # Contextos relacionados con el dominio
│   │   ├── UserContext.tsx
│   │   └── ...
│
├── infrastructure/                            # Adaptadores
│   ├── api/                                   # Implementaciones de las consultas
│   │   ├── UserApi.ts
│   │   └── ...
│   ├── http/                                  # Configuración HTTP (axios, fetch, etc.)
│   │   └── httpClient.ts
│   ├── database/                              # Persistencia de datos
│   └── mappers/                               # Conversión de datos (DTOs)
│
├── shared/                                    # Recursos compartidos
│   ├── utils/                                 # Funciones auxiliares
│   ├── constants/                             # Constantes globales
│   └── types/                                 # Tipos reutilizables
│
├── ui/                                        # Interfaz de usuario
│   ├── components/
│   │   ├── Button.tsx
│   │   └── ...
│   ├── screens/
│   │   ├── UserScreen/
│   │   │   ├── UserScreenContext.tsx
│   │   │   └── ...
│   └── navigation/
```

---

### **2. Lógica de Negocio (Dominio)**

#### **Modelos**
Define tus entidades principales en el dominio, enfocándote en representar las reglas del negocio.

```typescript
// src/domain/models/User.ts
export class User {
  constructor(public id: string, public name: string, public email: string) {}

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
```

#### **Interfaces (Puertos)**
Define interfaces para comunicarte con adaptadores.

```typescript
// src/domain/ports/UserRepository.ts
import { User } from "../models/User";

export interface UserRepository {
  getUserById(id: string): Promise<User>;
  createUser(user: User): Promise<void>;
}
```

#### **Casos de Uso**
Los casos de uso son los servicios que orquestan la lógica del negocio.

```typescript
// src/domain/services/GetUserUseCase.ts
import { UserRepository } from "../ports/UserRepository";
import { User } from "../models/User";

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new Error("User not found");
    return user;
  }
}
```

---

### **3. Infraestructura (Adaptadores)**

Implementa los adaptadores basados en las interfaces definidas en la capa de dominio.

```typescript
// src/infrastructure/api/UserApiRepository.ts
import { UserRepository } from "../../domain/ports/UserRepository";
import { User } from "../../domain/models/User";

export class UserApiRepository implements UserRepository {
  async getUserById(id: string): Promise<User> {
    const response = await fetch(`https://api.example.com/users/${id}`);
    const data = await response.json();
    return new User(data.id, data.name, data.email);
  }

  async createUser(user: User): Promise<void> {
    await fetch("https://api.example.com/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

---

### **4. Interfaz de Usuario (UI)**

La UI interactúa con los casos de uso en lugar de interactuar directamente con los adaptadores.

```typescript
// src/ui/screens/UserScreen.tsx
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GetUserUseCase } from "../../domain/services/GetUserUseCase";
import { UserApiRepository } from "../../infrastructure/api/UserApiRepository";

const userRepository = new UserApiRepository();
const getUserUseCase = new GetUserUseCase(userRepository);

export const UserScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserUseCase.execute("123");
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <View>
      {user ? (
        <Text>{`Hello, ${user.name}`}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};
```

---

### **5. Configuración de la App**

Inicia la aplicación y configura dependencias globales si es necesario.

```typescript
// src/app/index.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserScreen } from "../ui/screens/UserScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---


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

   npx react-native run-android
   ```

   2.2 **Generar APK de Debug (Opcion 2)**:
   ```bash
   cd android
   ./gradlew assembleDebug
   cd ..
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

## Subida de la app a play store
### 1. **Generar la Clave de Subida**
Primero, necesitas generar una clave de subida para firmar tu aplicación antes de subirla a la Play Store. Puedes hacerlo usando `keytool`:

```bash
keytool -genkeypair -v -keystore simijuegos-upload.keystore -alias simijuegos-mobile-app -keyalg RSA -keysize 2048 -validity 10000
```

Recuerda guardar la contraseña de la clave y el alias, ya que los necesitarás más adelante.

### 2. **Configurar Gradle**
Coloca el archivo `simijuegos-upload.keystore` en la carpeta `android/app` y actualiza el archivo `android/gradle.properties` y el archivo `android/local.properties` (si no existe debes crearlo) con las siguientes variables:

```properties
MYAPP_UPLOAD_STORE_FILE=simijuegos-upload.keystore
MYAPP_UPLOAD_KEY_ALIAS=simijuegos-mobile-app
UPLOAD_STORE_PASSWORD=UPLOAD_STORE_PASSWORD
UPLOAD_KEY_PASSWORD=UPLOAD_KEY_PASSWORD
```

### 3. **Actualizar `build.gradle`**
Asegúrate de que el archivo `android/app/build.gradle` esté configurado para usar la clave de subida:

```groovy
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

react {
    autolinkLibrariesWithApp()
}

def enableProguardInReleaseBuilds = false
def jscFlavor = 'org.webkit:android-jsc:+'

import java.util.Properties
def loadPropertiesFile() {
    def propertiesFile = rootProject.file("../.env")
    def properties = new Properties()
    if (propertiesFile.exists()) {
        properties.load(new FileInputStream(propertiesFile))
    } else {
        throw new GradleException("Properties file '${propertiesFile}' not found")
    }
    return properties
}

def env = loadPropertiesFile()

android {
    ndkVersion rootProject.ext.ndkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion
    compileSdk rootProject.ext.compileSdkVersion

    namespace "com.simijuegos"
    defaultConfig {
        applicationId "com.simijuegos"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }
    flavorDimensions "store"
    productFlavors {
        play {
            dimension "store"
        }
        amazon {
            dimension "store"
        }
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (!env['MYAPP_UPLOAD_STORE_FILE'] || !env['UPLOAD_STORE_PASSWORD'] || !env['MYAPP_UPLOAD_KEY_ALIAS'] || !env['UPLOAD_KEY_PASSWORD']) {
                throw new GradleException("One or more environment variables are missing.")
            }
            storeFile file(env['MYAPP_UPLOAD_STORE_FILE'])
            storePassword env['UPLOAD_STORE_PASSWORD']
            keyAlias env['MYAPP_UPLOAD_KEY_ALIAS']
            keyPassword env['UPLOAD_KEY_PASSWORD']
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }

    applicationVariants.all { variant -> 
        variant.outputs.all { output -> 
            def newApkName = "SimiJuegos-${variant.buildType.name}-${variant.versionName}.apk"
            output.outputFileName = newApkName
        }
    }
}

dependencies {
    implementation("com.facebook.react:react-android")
    implementation 'com.android.billingclient:billing:5.0.0'
    implementation 'com.google.android.gms:play-services-base:18.0.0'

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }

    implementation(project(path: ":react-native-iap", configuration: "default"))
}

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

Si se deséa cambiar el nombre del APK generado podemos modificar el `outputFileName` en el archivo `android/app/build.gradle`.

### Pasos para Cambiar el Nombre del APK

1. Abre el archivo `android/app/build.gradle`.
2. Añade el siguiente bloque dentro de `android` para configurar el nombre de salida del APK:

```groovy
android {
    ...
    // Configura el nombre del archivo APK de salida
    applicationVariants.all { variant ->
        variant.outputs.all { output ->
            def newApkName = "SimiJuegos-${variant.buildType.name}-${variant.versionName}.apk"
            output.outputFileName = newApkName
        }
    }
    ...
}
```
### Generar el APK

El APK generado debería tener el nombre que configuraste, como `SimiJuegos-release-1.0.apk`, en lugar de `app-release.apk`.

### 4. **Generar el APK de Lanzamiento**
Con la configuración completa, puedes generar el APK de lanzamiento:

```bash
cd android
# Puede no ser necesario si está bien configurados los .env
set UPLOAD_STORE_PASSWORD=your-keystore-password
set UPLOAD_KEY_PASSWORD=your-key-password
./gradlew assembleRelease
```

Esto generará un archivo `SimiJuegos-release.apk` en la carpeta `android/app/build/outputs/apk/release`.

### 5. **Subir a la Play Store**
1. **Accede a tu cuenta de Google Play Console** y selecciona tu proyecto.
2. **Sube el archivo APK** generado (`app-release.apk`) a través de la sección de lanzamientos.
3. Completa los detalles necesarios como descripción, capturas de pantalla, etc.
4. **Revisa y publica** tu aplicación.

### 6. **Automatización con CI/CD**
Para automatizar este proceso, puedes usar herramientas como Buddy o GitHub Actions para configurar un flujo de trabajo de Integración y Despliegue Continuo (CI/CD).

### Recursos Adicionales
- [Guía oficial de React Native para publicar en Google Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Blog de LogRocket sobre despliegue en Google Play Store](https://blog.logrocket.com/how-to-deploy-a-react-native-app-to-the-google-play-store/)

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
