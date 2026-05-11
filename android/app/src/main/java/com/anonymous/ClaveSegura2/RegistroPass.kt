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




class RegistrarPass (reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String{
       return "RegistrarPass"
    }

    @ReactMethod
    fun authenticate(titulo: String, urlpag: String, AppName: String, UsuarioCredencial: String, PassCredencial: String, Notas: String,promise: Promise) {
       val u = AplicaccionPass(titulo,urlpag,AppName,UsuarioCredencial,PassCredencial,Notas)
        val camposLogin = listOf("Titulo", "Url","NombreApp","UsuerApp","PassApp","Notas")
        // 2. Mandas el objeto completo a la utilidad
        if (Utilidades.validarObjeto(u, promise,camposLogin)) {
        // Si todo está lleno, procedes a guardar o cifrar
        // guardar(u)
        promise.resolve(true)
        }

    }

    @ReactMethod
    fun insertar(idUsuario: String,titulo: String, urlpag: String, AppName: String, UsuarioCredencial: String, PassCredencial: String, Notas: String,promise: Promise){
           val cliente = OkHttpClient()



          try {
            // 1. Encriptación
            KeyStoreUtil.generateAndStoreKey()
            val idrecibido= idUsuario
            val idlimpio= idrecibido.toIntOrNull() ?: 0
            android.util.Log.d("DEBUG_TFG", "El idUsuario que voy a enviar es: $idUsuario")
            val AppNameEncript = KeyStoreUtil.encrypt(AppName)
            val UserEncript=KeyStoreUtil.encrypt(UsuarioCredencial)
            val PassEncript=KeyStoreUtil.encrypt(PassCredencial)
            // 2. Creación del objeto (Cuidado: Usuario, no Usuarios)
            val u = AplicaccionPass(titulo,urlpag,AppName,UsuarioCredencial,PassCredencial,Notas)

            // 3. JSON
            val json = """
            {
                "idUsuario": $idUsuario,
                "idCredenciales": 0,           
                "notas":"${u.Notas}",
                "titulo": "${u.Titulo}",
                "urlPagina": "${u.Url}",
                "appName": "${u.NombreApp}",
                "usuarioCredenciales": "${u.UsuerApp}",
                "passCredenciales": "${u.PassApp}"
            }
            """.trimIndent()
// Esto convierte tu objeto 'u' directamente a un JSON perfecto
    
            val body = json.toRequestBody("application/json; charset=utf-8".toMediaTypeOrNull())
            
            // Revisa que esta URL sea accesible desde el móvil
            val request = Request.Builder()
                .url("http://192.168.1.34:30005/api/Credenciales")
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