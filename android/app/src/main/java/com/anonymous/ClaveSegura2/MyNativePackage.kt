package com.anonymous.ClaveSegura2 // Asegúrate de que el nombre sea igual al de tu MainApplication

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager


class MyNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(

            LoginClave(reactContext) as NativeModule,
            CrearCuenta(reactContext) as NativeModule,
            RegistrarPass(reactContext) as NativeModule,
            VentanaPrincipal(reactContext) as NativeModule,
            GenerarPass(reactContext) as NativeModule,
            
        )
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}