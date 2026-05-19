package com.anonymous.ClaveSegura2
import com.anonymous.ClaveSegura2.Modelos.AplicaccionPass
import com.anonymous.ClaveSegura2.Utilidades.KeyStoreUtil
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.anonymous.ClaveSegura2.Utilidades.Utilidades
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException




class VentanaPrincipal (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String{
       return "VentanaPrincipal"
    }
    @ReactMethod
    fun CargarDatos(idUsuario: String, promise: Promise){
           val cliente = OkHttpClient()



          try {
            // Revisa que esta URL sea accesible desde el móvil
            val request = Request.Builder()
                .url("http://100.74.88.91:30005/api/Credenciales?idUsuario=$idUsuario")
                .get()
                .build()

            cliente.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    promise.reject("NETWORK_ERROR", "No se pudo conectar al servidor: ${e.message}")
                }

                override fun onResponse(call: Call, response: Response) {
                    response.use { 
                        if (!response.isSuccessful) {
                            promise.reject("SERVER_ERROR", "Código de error: ${response.code}")
                        } else {
                            promise.resolve(response.body?.string())
                        }
                    }
                }
            })

        } catch (e: Exception) {
            promise.reject("ENCRYPTION_ERROR", "Error al procesar datos: ${e.message}")
        }


    }
}