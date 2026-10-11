package com.simijuegos

import android.content.ClipData
import android.content.Intent
import android.util.Base64
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

/**
 * Compartir una imagen con la hoja del teléfono (WhatsApp, Instagram, Mensajes...).
 *
 * La web arma la tarjeta (victoria en un duelo, nivel, insignia o récord) y la manda como
 * data:image/jpeg;base64,... (WebShell.tsx, mensaje simi:app-share). El compartir que trae React
 * Native en Android solo manda texto, así que aquí la imagen se guarda en la caché de la app y se
 * comparte con un permiso de solo lectura para la app que el jugador elija (SimiShareFileProvider).
 */
class SimiShareModule(private val contexto: ReactApplicationContext) :
    ReactContextBaseJavaModule(contexto) {

  override fun getName(): String = "SimiShare"

  @ReactMethod
  fun shareImage(dataUrl: String, texto: String, titulo: String, promise: Promise) {
    try {
      val coma = dataUrl.indexOf(',')
      if (!dataUrl.startsWith("data:image/") || coma < 0) {
        promise.reject("simi_share", "La imagen no es válida")
        return
      }
      val esPng = dataUrl.startsWith("data:image/png")
      val bytes = Base64.decode(dataUrl.substring(coma + 1), Base64.DEFAULT)
      // Siempre el mismo archivo: no se acumulan imágenes en el teléfono
      val carpeta = File(contexto.cacheDir, "compartir")
      carpeta.mkdirs()
      val archivo = File(carpeta, if (esPng) "simijuegos.png" else "simijuegos.jpg")
      archivo.writeBytes(bytes)
      val uri = FileProvider.getUriForFile(contexto, contexto.packageName + ".simishare", archivo)

      val enviar = Intent(Intent.ACTION_SEND)
      enviar.type = if (esPng) "image/png" else "image/jpeg"
      enviar.putExtra(Intent.EXTRA_STREAM, uri)
      if (texto.isNotEmpty()) {
        enviar.putExtra(Intent.EXTRA_TEXT, texto)
      }
      enviar.clipData = ClipData.newRawUri("SimiJuegos", uri)
      enviar.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)

      val elegir = Intent.createChooser(enviar, if (titulo.isNotEmpty()) titulo else "Compartir")
      elegir.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
      val actividad = contexto.currentActivity
      if (actividad != null) {
        actividad.startActivity(elegir)
      } else {
        elegir.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        contexto.startActivity(elegir)
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("simi_share", e)
    }
  }
}
