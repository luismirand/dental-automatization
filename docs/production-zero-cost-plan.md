# Plan de producción con costo cercano a cero

## Arquitectura

```text
local-development
└── pruebas locales con Docker

main
├── Vercel Hobby
│   └── landing Astro
└── Oracle Cloud Always Free
    └── Coolify self-hosted
        ├── n8n
        └── PostgreSQL
```

`local-development` es la rama de trabajo y pruebas. Solo un Pull Request
revisado hacia `main` puede provocar despliegues de producción.

## Orden de implementación

1. Crear una VM Oracle Always Free:
   - Ubuntu 24.04 LTS ARM64.
   - `VM.Standard.A1.Flex`.
   - 2 OCPU y 12 GB de RAM.
   - 50 GB de boot volume.
   - Capacidad On-demand.
   - IPv4 pública.
2. Permitir únicamente:
   - SSH 22 desde la IP del administrador.
   - HTTP 80 y HTTPS 443 desde Internet.
   - Coolify 8000 desde la IP del administrador durante la configuración.
   - No publicar PostgreSQL 5432.
3. Instalar Coolify self-hosted.
4. Asignar a n8n un hostname HTTPS gratuito basado en la IP, por ejemplo:
   `https://n8n.<IP_ORACLE>.sslip.io`.
5. Conectar Coolify al repositorio:
   - Rama `main`.
   - Base directory `/`.
   - Archivo `/infrastructure/docker-compose.yml`.
   - No cargar `docker-compose.override.yml`, reservado para desarrollo local.
6. Configurar secretos mediante la interfaz de Coolify usando
   `infrastructure/.env.production.example` como inventario.
7. Conectar Vercel Hobby:
   - Root Directory: `apps/web-landing`.
   - Production Branch: `main`.
   - `PUBLIC_WEBCHAT_WEBHOOK_URL` apuntando al webhook HTTPS de n8n.
8. Abrir y revisar el PR `local-development` → `main`.
9. Fusionar solo después de que CI, Oracle, Coolify y Vercel estén listos.
10. Inicializar n8n, reasignar credenciales e importar workflows.
11. Ejecutar pruebas de humo de WebChat, Cal.com, persistencia y HTTPS.
12. Configurar backups gratuitos con Block Volume Backup y Object Storage.

## Controles para evitar cobros

- Crear recursos únicamente en la Home Region.
- Confirmar la etiqueta **Always Free-eligible** antes de crear cada recurso.
- No usar Dedicated Host, Capacity Reservation ni Compute Cluster.
- No superar el conjunto Always Free disponible de OCPU, RAM y almacenamiento.
- No crear un Load Balancer de pago; Coolify usa el proxy de la propia VM.
- Mantener PostgreSQL dentro de la VM.
- Usar Vercel Hobby solo para esta demo personal/no comercial.
- Revisar periódicamente **Billing & Cost Management → Cost Analysis**.
- Configurar un presupuesto y una alerta de presupuesto de `1 USD`.

## Archivos de referencia

- `docs/deploy_coolify.md`
- `docs/deploy-vercel.md`
- `infrastructure/.env.production.example`
- `infrastructure/docker-compose.yml`
