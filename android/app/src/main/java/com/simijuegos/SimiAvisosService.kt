package com.simijuegos

import android.app.PendingIntent
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Recibe los avisos de Firebase (#173). Con la app cerrada o en el fondo, Android muestra solo el aviso
 * (canal «Duelos», ver AndroidManifest.xml) y al tocarlo abre MainActivity con el campo `url` del aviso.
 * Con la app abierta llega aquí y se muestra igual, arriba y con sonido, como en iPhone.
 */
class SimiAvisosService : FirebaseMessagingService() {

  override fun onNewToken(token: String) {
    SimiAvisosModule.tokenListo(token)
  }

  override fun onMessageReceived(m: RemoteMessage) {
    val titulo = m.notification?.title ?: m.data["titulo"] ?: return
    val texto = m.notification?.body ?: m.data["texto"] ?: ""
    val url = m.data["url"] ?: ""
    val grupo = m.data["grupo"] ?: url
    SimiAvisosModule.crearCanal(this)
    val abrir = Intent(this, MainActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
      putExtra("url", url)
    }
    val pi = PendingIntent.getActivity(
        this,
        (m.messageId ?: grupo).hashCode(),
        abrir,
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
    )
    val aviso = NotificationCompat.Builder(this, SimiAvisosModule.CANAL)
        .setSmallIcon(R.drawable.ic_aviso)
        .setColor(0xFF7B2CBF.toInt())
        .setContentTitle(titulo)
        .setContentText(texto)
        .setStyle(NotificationCompat.BigTextStyle().bigText(texto))
        .setPriority(NotificationCompat.PRIORITY_HIGH)
        .setAutoCancel(true)
        .setContentIntent(pi)
        .build()
    val nm = NotificationManagerCompat.from(this)
    if (!nm.areNotificationsEnabled()) return
    try {
      nm.notify(grupo, 1, aviso)
    } catch (e: SecurityException) {
      // Sin permiso de avisos: no hay nada que mostrar
    }
  }
}

/** Registra el módulo SimiAvisos. Se agrega a mano en MainApplication. */
class SimiAvisosPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
      listOf(SimiAvisosModule(reactContext))

  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> = emptyList()
}
