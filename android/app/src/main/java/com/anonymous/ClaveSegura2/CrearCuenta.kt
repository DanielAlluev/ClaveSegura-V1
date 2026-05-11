package com.anonymous.ClaveSegura2
import com.anonymous.ClaveSegura2.Modelos.Usuarios
import com.anonymous.ClaveSegura2.Utilidades.EncriptacionAes
import com.anonymous.ClaveSegura2.Utilidades.Utilidades
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
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



class CrearCuenta (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String{
       return "CrearCuenta"
    }

    @ReactMethod
    fun authenticate(usuario: String, pass: String, nombre: String, apellidos: String, correo: String, promise: Promise) {
        
        val u = Usuarios(usuario, pass, nombre, apellidos, correo)
        val camposLogin = listOf("usuario", "pass","nombre","apellidos","correo")
        // 2. Mandas el objeto completo a la utilidad
        if (Utilidades.validarObjeto(u, promise,camposLogin)) {
        // Si todo está lleno, procedes a guardar o cifrar
        // guardar(u)
        promise.resolve(true)
        }

    }

    @ReactMethod
    fun insertar(usuario: String, pass: String, nombre: String, apellidos: String, correo: String,promise: Promise){
           val cliente = OkHttpClient()

          try {
            // 1. Encriptación
            val passEncry = EncriptacionAes.encrypt(pass)
android.util.Log.d("DEBUG_AES", "Longitud: ${passEncry.length} - Contenido: $passEncry")
            // 2. Creación del objeto (Cuidado: Usuario, no Usuarios)
            val u = Usuarios(usuario, passEncry, nombre, apellidos, correo)

            // 3. JSON
            val json = """
            {
                "idUsuario": 0,
                "usuario": "${u.usuario}",
                "pass": "${u.pass}",
                "nombre": "${u.nombre}",
                "apellidos": "${u.apellidos}",
                "correo": "${u.correo}"
            }
            """.trimIndent()
// Esto convierte tu objeto 'u' directamente a un JSON perfecto
    
            val body = json.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
            
            // Revisa que esta URL sea accesible desde el móvil
            val request = Request.Builder()
                .url("http://192.168.1.34:30005/api/Usuarios")
                .post(body)
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