package com.anonymous.ClaveSegura2
import com.anonymous.ClaveSegura2.Modelos.UsuariosLogin
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.anonymous.ClaveSegura2.Utilidades.EncriptacionAes
import com.anonymous.ClaveSegura2.Utilidades.Utilidades
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import java.io.IOException

class LoginClave(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
private var idUsuarioGuardado: String? = null

    override fun getName(): String {
        return "LoginClave"
    }

    @ReactMethod
    fun authenticate(user: String, pass: String, promise: Promise) {
         val u = UsuariosLogin(user,pass)
        val camposLogin = listOf("usuario", "pass")
        // 2. Mandas el objeto completo a la utilidad
        if (Utilidades.validarObjeto(u, promise,camposLogin)) {
        // Si todo está lleno, procedes a guardar o cifrar
        // guardar(u)
        promise.resolve(true)
        }
    }

    @ReactMethod
    fun Login(user: String, pass: String, promise: Promise) { // Corregido el ';' por ':'
        val cliente = OkHttpClient()
        
        // Asumiendo que KeyStoreUtil está correctamente implementado en tu proyecto
       val passEncry = EncriptacionAes.encrypt(pass)

        val urlParametros = "http://100.74.88.91/:30005/api/Usuarios/Login".toHttpUrlOrNull()
            ?.newBuilder()
            ?.addQueryParameter("usuario", user)
            ?.addQueryParameter("pass", passEncry)
            ?.build()

        if (urlParametros == null) {
            promise.reject("Error", "Url Invalida")
            return
        }

        val request = Request.Builder().url(urlParametros).header("Cache-Control", "no-cache").build()

        cliente.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                promise.reject("Error", e.message)
            }

            override fun onResponse(call: Call, response: Response) {
                // Usamos .use para asegurar que el body se cierre correctamente
                response.use {
                    if (!response.isSuccessful) {
                        promise.reject("Error_Servidor", "Código: ${response.code}")
                    } else {
                        val idUsuario = response.body?.string()
                        if (idUsuario != null) {
                            android.util.Log.d("API_LOGIN", "ID recibido del servidor: $idUsuario")
                           promise.resolve(idUsuario)

                            } else {
                                promise.reject("Error_Data", "Cuerpo de respuesta vacío")
                        }
              
                    }
                }
            }
        })
    }
}







