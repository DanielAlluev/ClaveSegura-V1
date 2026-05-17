package com.anonymous.ClaveSegura2

import android.net.Uri
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts

class SelectorGaleria(activity: ComponentActivity, private val callback: (Uri?) -> Unit) {
   private val launcher: ActivityResultLauncher<PickVisualMediaRequest> = 
        activity.registerForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
            callback(uri)
        }

    fun disparar() {
        launcher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
    }
}