# Guía de Configuración: Meta WhatsApp Cloud API (Producción Live)

Esta guía explica cómo pasar del entorno de desarrollo (Sandbox/Ngrok) a la cuenta oficial en **Producción Live** de Meta WhatsApp Cloud API para la clínica dental.

---

## 1. Requisitos Previos

1. **Meta Business Manager Account** (Cuenta empresarial configurada en [business.facebook.com](https://business.facebook.com)).
2. **Número telefónico dedicado** para la clínica:
   - Debe ser capaz de recibir SMS o llamadas de voz para verificación.
   - **IMPORTANTE**: Si el número está actualmente registrado en WhatsApp o WhatsApp Business App en un celular, debes eliminar la cuenta de WhatsApp en la app antes de vincularlo a la API Cloud.

---

## 2. Crear y Configurar la Aplicación en Meta for Developers

1. Accede a [developers.facebook.com](https://developers.facebook.com).
2. Haz clic en **My Apps** -> **Create App**.
3. Selecciona el tipo de aplicación: **Business** (Negocio).
4. Asigna un nombre a la aplicación (ej. `Smile Studio Automation`).
5. Asocia la App a tu **Meta Business Account**.

---

## 3. Agregar el Producto WhatsApp API

1. En el panel de control de la App, busca el producto **WhatsApp** y haz clic en **Set up**.
2. En la barra lateral, navega a **WhatsApp** -> **API Setup**.
3. Selecciona o agrega el número de teléfono oficial de la clínica dental:
   - Haz clic en **Add Phone Number**.
   - Ingresa el nombre comercial que verán los pacientes (ej. `Smile Studio Dental`).
   - Elige la categoría (ej. `Medical & Health`).
   - Ingresa el número telefónico y completa la verificación por código SMS o llamada.

---

## 4. Generar el Token de Acceso Permanente (System User Token)

> [!WARNING]
> No utilices el token temporal del Sandbox en producción, ya que expira cada 24 horas.

1. Ve a tu **Meta Business Settings** (`business.facebook.com/settings`).
2. En la columna izquierda, ve a **Users** -> **System Users**.
3. Haz clic en **Add** para crear un usuario de sistema:
   - **Name**: `n8n-whatsapp-bot`.
   - **Role**: `Admin`.
4. Asigna los activos (Assets):
   - Asigna la App creada previamente a este System User con acceso completo.
5. Haz clic en **Generate New Token**:
   - Selecciona la App.
   - Marca los permisos obligatorios: `whatsapp_business_messaging` y `whatsapp_business_management`.
   - Selecciona **Expiration**: `Never` (Token Permanente).
6. Copia y guarda el Token de forma segura en tus variables de entorno (`WHATSAPP_SYSTEM_USER_PERMANENT_TOKEN`).

---

## 5. Configurar el Webhook Permanente en Meta

1. En el panel de la App en Meta for Developers, ve a **WhatsApp** -> **Configuration**.
2. En la sección **Webhook**, haz clic en **Edit**:
   - **Callback URL**: `https://n8n.tudominio.com/webhook/whatsapp`
   - **Verify Token**: El token de verificación definido en tu `.env` (`WHATSAPP_VERIFY_TOKEN`).
3. Haz clic en **Verify and Save**.
4. En **Webhook fields**, haz clic en **Subscribe** al evento:
   - `messages` (Obligatorio para recibir los mensajes entrantes de los pacientes).

---

## 6. Verificación de Empresa (Business Verification)

Para eliminar las limitaciones del tier inicial de Meta (límite de 250 conversaciones iniciadas por la empresa en 24h):
1. En Meta Business Settings, ve a **Security Center** -> **Business Verification**.
2. Sube la documentación oficial de la clínica dental (Cédula fiscal / Acta constitutiva / Licencia COFEPRIS / Recibo de servicios).
3. Una vez aprobada la verificación, el límite aumentará automáticamente a 1,000, 10,000 o conversaciones ilimitadas por día.
