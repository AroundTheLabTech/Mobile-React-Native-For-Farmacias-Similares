package com.simijuegos

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.google.firebase.messaging.FirebaseMessaging

/**
 * Avisos en el teléfono (notificaciones de los duelos) en Android (#173). Es el mismo módulo que el de
 * iPhone (SimiAvisos en ios/SimiJuegos/AppDelegate.mm), con los mismos métodos y eventos, así WebShell.tsx
 * y la web no distinguen: estado(), pedir(), tocadoPendiente() y los eventos simiAvisosToken y
 * simiAvisosTocado. La dirección del teléfono es el token de Firebase Cloud Messaging (entorno "fcm"); el
 * servicio simijuegos-avisos (herramientas/cloudflare-avisos en la web) manda por Firebase a esos teléfonos.
 */
class SimiAvisosModule(private val rc: ReactApplicationContext) : ReactContextBaseJavaModule(rc) {

  private var oyentes = 0

  init {
    modulo = this
  }

  override fun getName(): String = "SimiAvisos"

  private fun emitir(evento: String, datos: Map<String, String>) {
    if (oyentes <= 0 || !rc.hasActiveReactInstance()) return
    val m = Arguments.createMap()
    datos.forEach { (k, v) -> m.putString(k, v) }
    rc.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(evento, m)
  }

  // NativeEventEmitter de React Native los pide en Android
  @ReactMethod
  fun addListener(evento: String) {
    oyentes++
  }

  @ReactMethod
  fun removeListeners(cuantos: Double) {
    oyentes = maxOf(0, oyentes - cuantos.toInt())
  }

  /** estado(): { estado: 'permitido' | 'negado' | 'pendiente', token, entorno } */
  @ReactMethod
  fun estado(promise: Promise) {
    val e = estadoActual()
    if (e == "permitido" && token == null) pedirToken()
    val m = Arguments.createMap()
    m.putString("estado", e)
    if (token != null) m.putString("token", token) else m.putNull("token")
    m.putString("entorno", ENTORNO)
    promise.resolve(m)
  }

  /** pedir(): la pregunta de Android 13+ («¿Permitir que SimiJuegos te envíe notificaciones?»). */
  @ReactMethod
  fun pedir(promise: Promise) {
    if (NotificationManagerCompat.from(rc).areNotificationsEnabled()) {
      pedirToken()
      promise.resolve(true)
      return
    }
    // Antes de Android 13 no hay pregunta: si están apagados, solo se prenden en los ajustes
    if (Build.VERSION.SDK_INT < 33) {
      promise.resolve(false)
      return
    }
    val act = currentActivity as? PermissionAwareActivity
    if (act == null) {
      promise.resolve(false)
      return
    }
    try {
      act.requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), PEDIR_CODIGO) { codigo, _, resultados ->
        if (codigo != PEDIR_CODIGO) return@requestPermissions false
        preferencias(rc).edit().putBoolean("preguntado", true).apply()
        val si = resultados.isNotEmpty() && resultados[0] == android.content.pm.PackageManager.PERMISSION_GRANTED
        if (si) pedirToken()
        promise.resolve(si)
        true
      }
    } catch (e: Exception) {
      promise.resolve(false)
    }
  }

  /** tocadoPendiente(): el aviso con el que se abrió la app (una sola vez) */
  @ReactMethod
  fun tocadoPendiente(promise: Promise) {
    val u = pendiente
    pendiente = null
    promise.resolve(u)
  }

  private fun estadoActual(): String {
    if (NotificationManagerCompat.from(rc).areNotificationsEnabled()) return "permitido"
    if (Build.VERSION.SDK_INT < 33) return "negado"
    val act = currentActivity
    val preguntado = preferencias(rc).getBoolean("preguntado", false)
    // Android deja preguntar otra vez si la persona dijo que no una sola vez
    if (!preguntado) return "pendiente"
    if (act != null && ActivityCompat.shouldShowRequestPermissionRationale(act, Manifest.permission.POST_NOTIFICATIONS)) return "pendiente"
    return "negado"
  }

  companion object {
    const val ENTORNO = "fcm"
    const val CANAL = "duelos"
    private const val PEDIR_CODIGO = 7301

    @Volatile private var modulo: SimiAvisosModule? = null
    @Volatile private var token: String? = null // dirección de este teléfono
    @Volatile private var pendiente: String? = null // aviso que abrió la app y la web todavía no recoge

    private fun preferencias(ctx: Context) = ctx.getSharedPreferences("simi_avisos", Context.MODE_PRIVATE)

    fun tokenListo(t: String) {
      token = t
      modulo?.emitir("simiAvisosToken", mapOf("token" to t, "entorno" to ENTORNO))
    }

    fun tocado(url: String) {
      val m = modulo
      if (m != null && m.oyentes > 0 && m.rc.hasActiveReactInstance()) {
        m.emitir("simiAvisosTocado", mapOf("url" to url))
      } else {
        pendiente = url
      }
    }

    /** Pide a Firebase la dirección de este teléfono (llega en tokenListo). */
    fun pedirToken() {
      try {
        FirebaseMessaging.getInstance().token.addOnSuccessListener { t -> if (!t.isNullOrEmpty()) tokenListo(t) }
      } catch (e: Exception) {
        // Sin Firebase (no debería pasar): la app sigue sin avisos
      }
    }

    /** El canal «Duelos» (Android 8+ lo pide para mostrar avisos). Se crea al abrir la app. */
    fun crearCanal(ctx: Context) {
      if (Build.VERSION.SDK_INT < 26) return
      val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      if (nm.getNotificationChannel(CANAL) != null) return
      val canal = NotificationChannel(CANAL, "Duelos", NotificationManager.IMPORTANCE_HIGH)
      canal.description = "Cuando tu amigo juega su turno, acepta tu reto o te pide la revancha"
      nm.createNotificationChannel(canal)
    }
  }
}
