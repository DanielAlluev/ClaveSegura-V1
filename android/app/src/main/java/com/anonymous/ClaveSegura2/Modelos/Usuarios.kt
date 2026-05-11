package com.anonymous.ClaveSegura2.Modelos

data class Usuarios(
    var usuario: String = "",
    var pass: String= "",
    var nombre: String= "",
    var apellidos: String= "",
    var correo: String= "",
)
data class UsuariosLogin(
    var usuario: String = "",
    var pass: String= "",
)