package com.anonymous.ClaveSegura2
import com.anonymous.ClaveSegura2.Modelos.UsuariosLogin
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.anonymous.ClaveSegura2.Utilidades.EncriptacionAes
import com.anonymous.ClaveSegura2.Utilidades.Utilidades
import java.io.IOException
import com.facebook.react.bridge.WritableNativeMap
import java.security.SecureRandom

class GenerarPass(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
private var idUsuarioGuardado: String? = null

    override fun getName(): String {
        return "GenerarPass"
    }
    private val random = SecureRandom()
    private val Mayusculas="QWERTYUIOPASDFGHJKLZXCVBNM"
    private val Minusculas="qwertyuiopasdfghjklzxcvbnm"
    private val Numeros="1234567890"
    private val Simbolo="!@#$%^&*()-_+={}[]|;:<>?/"

    @ReactMethod
    fun generarContrasena(longitud: Int,
    usarMay: Boolean, minMay: Int, 
    usarMin: Boolean, minMin: Int, 
    usarNum: Boolean, minNum: Int, 
    usarSim: Boolean, minSim: Int, 
    promise: Promise){

        try {
            // ── Validaciones ─────────────────────────────────────────────────
            if (longitud < 4) {
                promise.reject("ERROR_LONGITUD", "La longitud mínima es 4 caracteres")
                return
            }
            if (!usarMay && !usarMin && !usarNum && !usarSim) {
                promise.reject("ERROR_TIPOS", "Selecciona al menos un tipo de carácter")
                return
            }

            // ── Construir pool de caracteres ──────────────────────────────────
            val pool = buildString {
                if (usarMay) append(Mayusculas)
                if (usarMin) append(Minusculas)
                if (usarNum) append(Numeros)
                if (usarSim) append(Simbolo)
            }

            val resultado = mutableListOf<Char>()

            if (usarMay) repeat(minMay) { resultado.add(charAleatorio(Mayusculas)) }
            if (usarMin) repeat(minMin) { resultado.add(charAleatorio(Minusculas)) }
            if (usarNum) repeat(minNum) { resultado.add(charAleatorio(Numeros))    }
            if (usarSim) repeat(minSim) { resultado.add(charAleatorio(Simbolo))    }

            repeat(longitud - resultado.size) {
                resultado.add(charAleatorio(pool))
            }

            for (i in resultado.size - 1 downTo 1) {
                val j        = random.nextInt(i + 1)  // ← SecureRandom
                val tmp      = resultado[i]
                resultado[i] = resultado[j]
                resultado[j] = tmp
            }

            val contrasena = resultado.joinToString("")

            val map = WritableNativeMap().apply {
                putString("contrasena", contrasena)
                putString("fortaleza",  calcularFortaleza(contrasena))
                putInt("longitud",      contrasena.length)
            }
            promise.resolve(map)



        }catch (e: Exception) {
            promise.reject("ERROR_GENERACION", e.message ?: "Error desconocido")
        }
    }
         private fun charAleatorio(fuente: String): Char {
        return fuente[random.nextInt(fuente.length)]  // ← SecureRandom
    }

    private fun calcularFortaleza(pass: String): String {
        val pts = puntuacion(pass)
        return when {
            pts >= 80 -> "Muy fuerte"
            pts >= 60 -> "Fuerte"
            pts >= 40 -> "Media"
            pts >= 20 -> "Débil"
            else      -> "Muy débil"
        }
    }

    private fun puntuacion(pass: String): Int {
        var pts = 0
        if (pass.length >= 8)  pts += 20
        if (pass.length >= 12) pts += 20
        if (pass.length >= 16) pts += 10
        if (pass.any { it in Mayusculas }) pts += 15
        if (pass.any { it in Minusculas }) pts += 15
        if (pass.any { it in Numeros })    pts += 10
        if (pass.any { it in Simbolo })    pts += 10
        return pts.coerceAtMost(100)
    }

}



    




