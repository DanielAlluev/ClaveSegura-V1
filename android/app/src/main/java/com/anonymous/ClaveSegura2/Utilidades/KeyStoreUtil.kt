package com.anonymous.ClaveSegura2.Utilidades

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.PrivateKey
import java.security.PublicKey
import javax.crypto.Cipher

object KeyStoreUtil { // Cambiado a object directamente para facilitar el uso
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"
    private const val KEY_ALIAS = "MiLlaveSeguraRSA"
    private const val TRANSFORMATION = "RSA/ECB/PKCS1Padding"

    // Cargamos el KeyStore una sola vez
    private val keyStore: KeyStore by lazy {
        KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
    }

    // 1. Genera las llaves si no existen
    fun generateAndStoreKey() {
        if (!keyStore.containsAlias(KEY_ALIAS)) {
            val keyGenerator = KeyPairGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_RSA,
                ANDROID_KEYSTORE
            )

            val keySpec = KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
                .setKeySize(2048)
                .build()

            keyGenerator.initialize(keySpec)
            keyGenerator.generateKeyPair()
        }
    }

    // 2. Obtener Llave Pública
    fun getPublicKey(): PublicKey? {
        val cert = keyStore.getCertificate(KEY_ALIAS)
        return cert?.publicKey
    }

    // 3. Obtener Llave Privada
    fun getPrivateKey(): PrivateKey? {
        return keyStore.getKey(KEY_ALIAS, null) as? PrivateKey
    }

    // --- ENCRIPTAR ---
    fun encrypt(plainText: String): String? {
        val publicKey = getPublicKey() ?: return null
        return try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.ENCRYPT_MODE, publicKey)
            val encryptedBytes = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))
            Base64.encodeToString(encryptedBytes, Base64.NO_WRAP) // NO_WRAP es mejor para APIs
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // --- DESENCRIPTAR ---
    fun decrypt(encryptedBase64: String): String? {
        val privateKey = getPrivateKey() ?: return null
        return try {
            val cipher = Cipher.getInstance(TRANSFORMATION)
            cipher.init(Cipher.DECRYPT_MODE, privateKey)
            val encryptedBytes = Base64.decode(encryptedBase64, Base64.NO_WRAP)
            val decryptedBytes = cipher.doFinal(encryptedBytes)
            String(decryptedBytes, Charsets.UTF_8)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}