package com.anonymous.ClaveSegura2.Utilidades
import android.util.Base64
import com.anonymous.ClaveSegura2.Modelos.Usuarios
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

class EncriptacionAes {
    companion object{
    private  val ALGORITHM = "AES/GCM/NoPadding"
    private  val TAG_LENGTH_BIT = 128
    private  val IV_LENGTH_BYTE = 12

    private  val MASTER_KEY = "MiClaveSuperSecr" 

        fun encrypt(plainText: String): String {
            val keyBytes = MASTER_KEY.toByteArray(Charsets.UTF_8)
            val cipher = Cipher.getInstance(ALGORITHM)

            val iv = "123456789012".toByteArray(Charsets.UTF_8)

            val spec = GCMParameterSpec(TAG_LENGTH_BIT, iv)
            val secretKey = SecretKeySpec(keyBytes, "AES")

            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec)
            val cipherText = cipher.doFinal(plainText.toByteArray(Charsets.UTF_8))

            val combined = iv + cipherText
            return Base64.encodeToString(combined, Base64.NO_WRAP)
        }

        fun decrypt(encryptedBase64: String): String {
            val keyBytes = MASTER_KEY.toByteArray(Charsets.UTF_8)
            val encryptedData = Base64.decode(encryptedBase64, Base64.NO_WRAP)

            val iv = encryptedData.sliceArray(0 until IV_LENGTH_BYTE)
            val cipherText = encryptedData.sliceArray(IV_LENGTH_BYTE until encryptedData.size)

            val cipher = Cipher.getInstance(ALGORITHM)
            val spec = GCMParameterSpec(TAG_LENGTH_BIT, iv)
            val secretKey = SecretKeySpec(keyBytes, "AES")

            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)

            return String(cipher.doFinal(cipherText), Charsets.UTF_8)
        }

    }
}