package com.anonymous.ClaveSegura2.Utilidades
import com.facebook.react.bridge.Promise
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.isAccessible

object Utilidades {
   
    fun validarObjeto(obj: Any, promise: Promise, ordenCampos: List<String>): Boolean {
        val propiedades = obj::class.memberProperties
        
        // Recorremos según el orden que le pasamos por la lista
        for (nombreCampo in ordenCampos) {
            val propiedad = propiedades.find { it.name == nombreCampo }
            
            propiedad?.let {
                it.isAccessible = true
                val valor = it.getter.call(obj)
                
                if (valor == null || (valor is String && valor.isBlank())) {
                    promise.reject("ERROR_VALIDACION", "El campo $nombreCampo está vacío")
                    return false
                }
            }
        }
        return true
    }
    
}