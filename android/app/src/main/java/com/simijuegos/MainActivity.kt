package com.simijuegos

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SimiJuegos"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Avisos de los duelos (#173): al tocar un aviso, Android abre la app con su `url` (/reto?c=...) y
  // WebShell.tsx lleva al duelo. Con la app cerrada llega en onCreate; con la app abierta, en onNewIntent.
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    avisoTocado(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    avisoTocado(intent)
  }

  private fun avisoTocado(i: Intent?) {
    if (i == null || (i.flags and Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) != 0) return
    val url = i.getStringExtra("url")
    if (!url.isNullOrEmpty() && url.startsWith("/")) {
      i.removeExtra("url") // que no se repita al volver a la app
      SimiAvisosModule.tocado(url)
    }
  }
}
