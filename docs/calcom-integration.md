# Integración n8n + Cal.com

Esta documentación detalla cómo el flujo de n8n interactúa con la API de Cal.com y gestiona el "Transbordo a Humano" en la base de datos de la Clínica Dental.

## Arquitectura HTTP (LLM a Cal.com)

Para que el modelo LLM pueda agendar citas dinámicamente según lo que pida el paciente en WhatsApp, n8n utiliza la API REST V1 de Cal.com (`https://api.cal.com/v1`).

### 1. Verificación de Disponibilidad (Disponibilidad)
Antes de proponer una hora o confirmar un agendamiento, el flujo de n8n (o el LLM instruido vía Tools) debe consultar:
- **Endpoint**: `GET https://api.cal.com/v1/availabilities`
- **Params**:
  - `dateFrom`: Ej. `2026-07-25`
  - `dateTo`: Ej. `2026-07-31`
  - `eventTypeId`: El ID interno de tu evento "luismira" (ej. consulta general).
- **Timezone**: El LLM formateará la fecha basándose en `America/Mexico_City`.

### 2. Creación del Booking (Reserva)
Una vez el usuario confirma la hora (ej. Miércoles a las 4:00 PM), n8n hace un POST:
- **Endpoint**: `POST https://api.cal.com/v1/bookings`
- **Body JSON**:
  ```json
  {
    "eventTypeId": 123456,
    "start": "2026-07-25T16:00:00-06:00",
    "end": "2026-07-25T16:30:00-06:00",
    "responses": {
      "name": "Juan Perez",
      "email": "juan@example.com",
      "location": "WhatsApp"
    },
    "timeZone": "America/Mexico_City"
  }
  ```
- **Error Handling (Conflictos)**: Si la API responde con un `400` (ya ocupado o inválido), n8n usará el nodo *Catch* para enviar un mensaje al LLM advirtiendo del fallo para que éste ofrezca un nuevo horario naturalmente al usuario.

## Transbordo a Humano (Handoff)

Si el LLM detecta que el usuario está enojado, pide hablar con un humano explícitamente, o la consulta es clínica/compleja, el LLM debe devolver un JSON de control.

1. **Trigger de Transbordo**:
   El LLM responde a n8n: `{"response": "Te transferiré con un especialista en breve...", "action": "handoff"}`
2. **Postgres State Update**:
   n8n ejecuta un Query en PostgreSQL:
   ```sql
   UPDATE conversations 
   SET status = 'handover_to_human' 
   WHERE id = $1;
   ```
3. **Pausa del LLM**:
   Los flujos subsecuentes de WhatsApp verificarán si `status = 'handover_to_human'`. Si es así, **n8n no llamará al LLM** y en su lugar notificará a la recepcionista.
