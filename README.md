# Sistema de Automatización para Clínica Dental (Agency-as-a-Service)

Este repositorio contiene la estructura monorepo de un sistema de automatización para una clínica dental, diseñado bajo el modelo de "Agency-as-a-Service". Permite centralizar la captación de pacientes desde la landing page web y desde canales de WhatsApp mediante inteligencia artificial (LLM), agendando citas en Cal.com y persistiendo la información de pacientes en una base de datos PostgreSQL.

## Enfoque del Proyecto

El enfoque principal de esta arquitectura es proveer un canal de atención unificado y automatizado que optimice la conversión de citas y la retención de pacientes, reduciendo la carga operativa del personal de recepción. 

Este enfoque se divide en tres pilares esenciales:
1. **Atención Omnicanal Reactiva**: Los pacientes pueden reservar citas tanto de forma autónoma a través del portal web interactivo como mediante conversaciones guiadas por un bot inteligente en WhatsApp.
2. **Orquestación Sin Código / Bajo Código**: Toda la lógica de negocio, enrutamiento de mensajes de WhatsApp, e integración con Cal.com y base de datos se realiza a través de flujos de n8n, lo que permite modificar el comportamiento de atención rápidamente sin desplegar código nuevo de backend.
3. **Persistencia Centralizada**: Los datos de los pacientes, registros de citas e interacciones se almacenan directamente en una base de datos relacional local (PostgreSQL), asegurando la trazabilidad del embudo de ventas y facilitando analíticas posteriores.

## Estructura del Proyecto

El monorepo está organizado de la siguiente manera:

* **apps/web-landing/**: Aplicación frontend moderna desarrollada en Astro y Tailwind CSS v4 con componentes interactivos hidratados mediante React (Navbar animado, Slider de antes/después para testimonios, y selector simulado de agenda).
* **infrastructure/**: Configuración del entorno local mediante Docker Compose, incluyendo PostgreSQL, n8n y los esquemas iniciales de base de datos.
  * **n8n_workflows/**: Definición de los flujos de integración para WhatsApp, Cal.com y base de datos en formato JSON.
* **docs/**: Documentación detallada de la arquitectura del sistema, especificaciones de la base de datos y detalles de integración de Cal.com.
* **scripts/**: Utilidades de soporte y despliegue del proyecto.

## Requisitos Previos

Para ejecutar y desarrollar en este proyecto, es necesario contar con:
* Node.js (versión 18 o superior)
* Docker y Docker Compose
* Git

## Guía de Inicio Rápido

### Frontend (Web Landing)
1. Navega al directorio de la landing:
   ```bash
   cd apps/web-landing
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Infraestructura (Base de datos y n8n)
1. Configura tus variables de entorno copiando el archivo de ejemplo en `infrastructure/.env.example` a `infrastructure/.env`.
2. Levanta los contenedores de Docker desde la raíz de la infraestructura:
   ```bash
   cd infrastructure
   docker compose up -d
   ```
3. Importa los flujos ubicados en `infrastructure/n8n_workflows/` dentro de tu instancia local de n8n para activar el procesamiento de WhatsApp y reservas de Cal.com.
