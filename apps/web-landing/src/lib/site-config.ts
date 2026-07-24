export const CLINIC = {
  name: "Smile Studio",
  tagline: "Clínica Dental de Alta Especialidad",
  address: "Av. Reforma 250, Piso 4, Col. Juárez, CDMX",
  mapsShort: "Av. Reforma 250, CDMX",
  phone: "+52 55 1234 5678",
  phoneHref: "tel:+525512345678",
  email: "hola@smilestudio.mx",
  hours: [
    { day: "Lunes a Viernes", time: "09:00 – 20:00" },
    { day: "Sábados", time: "09:00 – 15:00" },
    { day: "Urgencias", time: "24/7 por WhatsApp" },
  ],
  license: "COFEPRIS Reg. 22-DF-45781",
};

export const WHATSAPP_NUMBER = "525512345678";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola Smile Studio, quiero agendar una cita.",
)}`;
export const WHATSAPP_URGENT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola, tengo una urgencia dental y necesito atención hoy mismo.",
)}`;

export const CAL_USER = "smile-studio";
export const CAL_URL = `https://cal.com/${CAL_USER}`;

// Google Maps embed (no API key required)
export const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  CLINIC.address,
)}&z=15&output=embed`;
export const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  CLINIC.address,
)}`;
export const WAZE_DIRECTIONS = `https://waze.com/ul?q=${encodeURIComponent(CLINIC.address)}&navigate=yes`;
