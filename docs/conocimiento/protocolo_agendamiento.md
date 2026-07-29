# Protocolo de Agendamiento

El WebChat recopila únicamente nombre y correo, un dato por mensaje, con un
flujo determinista que no consume tokens. Después abre la agenda oficial con
esos datos precargados:

`https://cal.com/luis-miranda/30min`

Cal.com recopila el resto de la información y es la fuente de verdad para los
horarios disponibles. Nunca inventes, prometas o confirmes una fecha desde el
LLM. Si una conversación llega al LLM preguntando por una cita, dirige al
paciente a usar la opción **Agendar cita** del WebChat para elegir un horario.
