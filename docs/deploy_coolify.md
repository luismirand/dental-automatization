# Guía de Despliegue en Producción: Oracle Cloud + Coolify

Esta guía detalla el procedimiento completo para desplegar la infraestructura del backend (PostgreSQL + n8n) en una instancia **Oracle Cloud Always Free** administrada mediante **Coolify**.

---

## 1. Requisitos Previos

1. **Cuenta en Oracle Cloud Infrastructure (OCI)** con suscripción activa.
2. **Dominio Propio** (ej. `midominio.com`) con acceso al panel DNS (Cloudflare, GoDaddy, Namecheap, etc.).
3. Acceso SSH desde tu terminal local.

---

## 2. Provisionamiento del VPS en Oracle Cloud (Always Free Tier)

1. Inicia sesión en la consola de **Oracle Cloud**.
2. Ve a **Compute** -> **Instances** -> **Create Instance**.
3. **Nombre de la instancia**: `dental-automation-prod`.
4. **Image and Shape**:
   - **Image**: Ubuntu 22.04 LTS o 24.04 LTS.
   - **Shape**: Ampere (ARM64) — `VM.Standard.A1.Flex`.
   - **Recursos**: 4 vCPU, 24 GB de RAM (100% cubierto dentro del tier gratuito de Oracle).
5. **Networking**:
   - Asigna una **IP pública IPv4**.
6. **SSH Keys**:
   - Sube tu clave pública SSH local (`~/.ssh/id_rsa.pub` o `id_ed25519.pub`).
7. Haz clic en **Create**.

---

## 3. Apertura de Puertos de Red (Ingress Rules)

En la consola de Oracle Cloud:
1. Ve al **Virtual Cloud Network (VCN)** de tu instancia -> **Security Lists** -> **Default Security List**.
2. Añade las siguientes **Ingress Rules** (CIDR `0.0.0.0/0`):
   - **Puerto 80** (HTTP) - Para emisión de certificados Let's Encrypt / Coolify.
   - **Puerto 443** (HTTPS) - Para tráfico seguro SSL.
   - **Puerto 8000 / 3000** (Coolify Dashboard).

En la consola SSH de tu servidor Ubuntu:
```bash
sudo iptables -F
sudo netfilter-persistent save
```

---

## 4. Instalación de Coolify

Conéctate por SSH a la IP pública de tu servidor:
```bash
ssh ubuntu@<IP_PUBLICA_ORACLE>
```

Ejecuta el script oficial de instalación automatizada de Coolify:
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Una vez finalizada la instalación, ingresa en tu navegador a:
`http://<IP_PUBLICA_ORACLE>:8000`
Crea la cuenta de usuario Administrador inicial.

---

## 5. Configuración de Registros DNS

En tu proveedor de DNS (ej. Cloudflare):
1. Crea un registro `A`:
   - **Nombre**: `n8n` (o el subdominio que elijas, ej. `n8n.tudominio.com`).
   - **Valor**: `<IP_PUBLICA_ORACLE>`.
   - **Proxy**: Desactivado inicialmente (DNS Only) o Cloudflare Proxy habilitado si manejas SSL en Cloudflare.

---

## 6. Despliegue del Stack (n8n + PostgreSQL) en Coolify

1. En el panel de Coolify, crea un nuevo **Project** llamado `Dental Clinic Automation`.
2. Selecciona **+ New** -> **Docker Compose**.
3. Pega el contenido del archivo [`infrastructure/docker-compose.yml`](file:///c:/Users/luism/OneDrive/Escritorio/automatizaciones/infrastructure/docker-compose.yml).
4. En la pestaña **Environment Variables**, carga los valores definidos en [`infrastructure/.env.production.example`](file:///c:/Users/luism/OneDrive/Escritorio/automatizaciones/infrastructure/.env.production.example).
5. Configura el FQDN del servicio n8n:
   - `https://n8n.tudominio.com`
6. Haz clic en **Deploy**. Coolify generará automáticamente los certificados SSL/TLS con Let's Encrypt y levantará el stack.

---

## 7. Inicialización del Esquema SQL

Conéctate al contenedor de PostgreSQL creado por Coolify o ejecuta la inicialización:
```bash
docker exec -i dental_postgres psql -U dental_admin_prod -d dental_automation_db < infrastructure/init-db.sql
```

Verifica la creación exitosa de las tablas:
```bash
docker exec -it dental_postgres psql -U dental_admin_prod -d dental_automation_db -c "\dt"
```

---

## 8. Verificación Final

1. Abre `https://n8n.tudominio.com` en tu navegador y completa el primer login en n8n.
2. Comprueba que el webhook de prueba responda en `https://n8n.tudominio.com/webhook/whatsapp`.
