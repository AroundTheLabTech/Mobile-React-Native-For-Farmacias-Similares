package com.simijuegos

import androidx.core.content.FileProvider
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/** Registra el módulo SimiShare (compartir imágenes). Se agrega a mano en MainApplication. */
class SimiSharePackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
      listOf(SimiShareModule(reactContext))

  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> = emptyList()
}

/**
 * Proveedor de archivos propio para compartir (ver AndroidManifest.xml). Es una clase aparte para no
 * chocar con el FileProvider que ya declaran otras librerías (react-native-webview trae el suyo).
 */
class SimiShareFileProvider : FileProvider()
