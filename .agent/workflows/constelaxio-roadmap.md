---
description: Roadmap de Mejoras UI para Constelaciones Conscientes
---

# 🗺️ Roadmap de Mejoras UI - Constelaciones Conscientes

Este documento detalla las mejoras de UI planificadas para cada sección de la página.

## Estado Actual

✅ **Completado:**
- Glowing effects modernos con color sage green en TODAS las secciones
- Logo Constelaxio reemplazado
- Imagen hero actualizada
- Animaciones sutiles (fades, slides) implementadas
- shadcn/ui configurado e integrado
- Sección Constelaciones + Proceso completada
- Stats actualizados (+50 sesiones, +5 años)
- Hover effects en About stats
- Glow orbs implementados en: Hero, About, Constellations, Services, Testimonials, Booking
- Hero Section completamente optimizado
- About Section con parallax y badge
- Services Section con Dialog y badges
- Testimonials Section con carousel
- Booking Section con shadcn/ui forms

---

## 📋 Secciones por Mejorar

### 1. 🎯 Hero Section
**Prioridad:** Alta  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Logo Constelaxio implementado
- [x] Imagen hero actualizada
- [x] Badge "Sesiones disponibles / No te quedes sin tu sesión" con ícono Calendar
- [x] Glow effects animados aplicados
- [x] Optimizar responsive para móviles pequeños (<375px)
- [x] Agregar variante de altura para tablets (min-h-[100dvh], py responsive)
- [x] Mejorar contraste del texto sobre glow effects (drop-shadow-sm)
- [x] Ajustar espaciado del badge en responsive
- [x] Revisar jerarquía tipográfica en pantallas pequeñas (text-3xl → 6xl scale)
- [x] Agregar micro-interacciones en botones CTA (hover-lift, active:scale-95)
- [x] Botón CTA principal: "Agenda ya" con ícono Calendar

**Mejoras aplicadas:**
- ✅ Glow orbs con tamaños responsivos (w-64/80/96 por breakpoint)
- ✅ Badge flotante con versión móvil separada (rounded-full, centrado)
- ✅ Botones con transiciones suaves y feedback táctil
- ✅ Backdrop blur en elementos flotantes para mejor contraste
- ✅ Espaciado optimizado: gap-8/10/16, mb-4/6, py-2.5/3
- ✅ Tipografía escalable: text-xs/sm, text-3xl/4xl/5xl/6xl
- ✅ Imagen con hover-glow effect
- ✅ z-index en contenedor para evitar overlap con glow

---

### 2. 👤 About Section (Sobre Mí)
**Prioridad:** Media  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Stats actualizados (+50 sesiones, +5 años)
- [x] Hover-lift aplicado a tarjetas de estadísticas
- [x] Glow effects de sección implementados
- [x] Implementar parallax sutil en la imagen
- [x] Mejorar spacing entre elementos en mobile
- [x] Agregar glow-border a la imagen en hover
- [x] Implementar badge de especialización ("Certificada")

**Mejoras aplicadas:**
- ✅ Parallax effect en imagen con useScroll/useTransform
- ✅ Badge flotante "Certificada" con animación
- ✅ Hover-glow en imagen con zoom sutil
- ✅ Card-glow en tarjetas de stats
- ✅ Tipografía responsive mejorada (text-2xl → 5xl)
- ✅ Espaciado optimizado para mobile (gap-3/4, p-3/4)

---

### 3. 🌟 Constelaciones Familiares Section
**Prioridad:** Alta  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Agregar subsección "Cómo Trabajamos" con proceso paso a paso
- [x] Implementar iconos animados para cada paso del proceso
- [x] Agregar línea conectora entre pasos (desktop)
- [x] Mejorar responsive de la sección de beneficios
- [x] Incluir CTA al final de la subsección del proceso

**Mejoras aplicadas:**
- ✅ Iconos animados (MessageCircle, Calendar, Sparkles, Heart) con hover-lift
- ✅ Líneas conectoras horizontales entre pasos en desktop
- ✅ Animaciones fade-in-up con delays escalonados (0.8 + index * 0.1)
- ✅ CTA final con botón accent y ícono Heart
- ✅ Estructura responsive con grid md:2cols, lg:4cols
- ✅ Badges numerados para cada paso (Paso 01-04)
- ✅ Glow orbs con animación pulsante
- ✅ Spacing y layout optimizados

---

## 💳 NUEVA FUNCIONALIDAD: Pasarela de Pagos + Agenda

### 10. 💳 Integración MercadoPago + Google Calendar
**Prioridad:** 🔴 Crítica  
**Estado:** 🔄 En proceso

**Descripción:**
Implementar pasarela de pagos con MercadoPago para cada servicio. Una vez completado el pago, el cliente es redirigido a Google Calendar para agendar su sesión.

#### Flujo del Usuario:
1. Cliente hace clic en "Agendar ahora" o "Completar Formulario"
2. Se abre checkout de MercadoPago con el monto del servicio
3. Cliente completa el pago
4. Al confirmar el pago, se redirige a Google Calendar
5. Cliente selecciona fecha/hora disponible
6. Se envía confirmación por email a ambas partes

---

#### Fase 1: Configuración de MercadoPago
**Estado:** ✅ Completado

**Tareas:**
- [x] Crear cuenta de vendedor en MercadoPago (si no existe)
- [x] Obtener credenciales de API (Access Token, Public Key)
- [x] Configurar variables de entorno (.env)
- [x] Instalar SDK de MercadoPago para JavaScript/React
- [x] Crear endpoint de backend para generar preferencia de pago (Edge Function creada)

**Requisitos previos:**
- Cuenta de MercadoPago verificada
- Datos del vendedor configurados
- URLs de éxito/fallo definidas

**Variables de entorno necesarias:**
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxx
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxxx
```

---

#### Fase 2: Crear Preferencias de Pago por Servicio
**Estado:** ✅ Completado

**Tareas:**
- [x] Definir precios para cada servicio
- [x] Crear función para generar preferencia de pago (Edge Function)
- [x] Configurar items con título, descripción y precio
- [x] Configurar URLs de retorno (success, failure, pending)
- [x] Incluir metadata del servicio seleccionado

**Servicios con precios CONFIRMADOS:**
| Servicio | Duración | Precio (ARS) |
|----------|----------|--------------|
| Sesión Individual Online | 60 min | $40.000 |
| Taller Grupal | 4 horas | $50.000 |
| Constelación Presencial | 120 min | $50.000 |

**Configuración confirmada:**
- ✅ **Agendamiento:** Calendly (plan gratuito o Pro)
- ✅ **Backend:** Supabase Edge Functions
- ✅ **Hosting:** Hostinger
- ✅ **API Keys MercadoPago:** Test credentials configuradas

---

#### Fase 3: Implementar Checkout en Frontend
**Estado:** ✅ Completado

**Tareas:**
- [x] Integrar MercadoPago Checkout Pro
- [x] Crear componente de pago (PaymentModal)
- [x] Manejar estados de loading durante el pago
- [x] Mostrar mensajes de éxito/error
- [ ] Implementar tracking de conversión (Pendiente)

**Opciones de implementación:**
1. **Checkout Pro (Redirect)** - El cliente es redirigido a MercadoPago ✅ Implementado

2. **Checkout Bricks (Modal)** - El pago se hace dentro de la página
3. **Payment Link** - Links de pago pre-generados

---

#### Fase 4: Integración con Calendly
**Estado:** ⏳ Pendiente

**Tareas:**
- [ ] Crear cuenta de Calendly (si no existe)
- [ ] Configurar tipos de eventos para cada servicio
- [ ] Definir disponibilidad horaria
- [ ] Obtener links de agendamiento por servicio
- [ ] Personalizar branding en Calendly

**Eventos a crear en Calendly:**
| Evento | Duración | Link |
|--------|----------|------|
| Sesión Individual Online | 60 min | calendly.com/constelaxio/individual |
| Taller Grupal | 4 horas | calendly.com/constelaxio/taller |
| Constelación Presencial | 120 min | calendly.com/constelaxio/presencial |

---

#### Fase 5: Conectar Pago con Agenda
**Estado:** ⏳ Pendiente

**Tareas:**
- [ ] Crear página de éxito de pago (/pago-exitoso)
- [ ] Almacenar referencia del pago en la sesión
- [ ] Redirección automática a calendario
- [ ] Pasar datos del cliente al link de agendamiento
- [ ] Enviar email de confirmación con link de agenda
- [ ] Implementar webhook para confirmar pagos

**Flujo técnico:**
```
1. Click "Agendar ahora"
   ↓
2. POST /api/create-preference (backend)
   ↓
3. Redirect a MercadoPago checkout
   ↓
4. Cliente paga
   ↓
5. MercadoPago redirect a /pago-exitoso?payment_id=xxx
   ↓
6. Verificar pago con API de MercadoPago
   ↓
7. Mostrar botón/link para agendar en Google Calendar
   ↓
8. Webhook recibe confirmación → Guardar en DB
```

---

#### Fase 6: Página de Confirmación y Emails
**Estado:** ⏳ Pendiente

**Tareas:**
- [ ] Diseñar página de pago exitoso
- [ ] Diseñar página de pago fallido
- [ ] Diseñar página de pago pendiente
- [ ] Configurar emails transaccionales
- [ ] Email de confirmación de pago
- [ ] Email de recordatorio de sesión

---

#### Fase 7: Testing y Producción
**Estado:** ⏳ Pendiente

**Tareas:**
- [ ] Probar flujo completo en sandbox
- [ ] Verificar webhooks funcionando
- [ ] Probar diferentes métodos de pago
- [ ] Probar flujo de agenda
- [ ] Migrar a credenciales de producción
- [ ] Monitorear primeras transacciones

---

#### Arquitectura Técnica Propuesta

**Frontend (React/Vite):**
- Componente `PaymentButton` para iniciar pago
- Página `/pago-exitoso` para redirección post-pago
- Integración con MercadoPago SDK

**Backend (Opciones):**
1. **Supabase Edge Functions** (Recomendado)
   - Sin servidor adicional
   - Fácil deploy
   - Buena integración con el proyecto

2. **Vercel Serverless Functions**
   - Si se despliega en Vercel
   - Buen soporte para Next.js/Vite

3. **Express.js standalone**
   - Más control
   - Requiere hosting separado

**Base de Datos:**
- Tabla `payments` para registrar transacciones
- Tabla `bookings` para sesiones agendadas
- Relación con información del cliente

---

#### Checklist de Requisitos del Cliente

Antes de implementar, necesitamos:
- [ ] Cuenta de MercadoPago activa y verificada
- [ ] Precios definidos para cada servicio
- [ ] Acceso a Google Calendar del terapeuta
- [ ] Definir horarios de disponibilidad
- [ ] Logo y colores para checkout personalizado
- [ ] Política de reembolsos/cancelación

---

### 4. 💼 Services Section (Servicios)
**Prioridad:** Alta  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Mejorar cards de servicios con efectos más pronunciados
- [x] Agregar indicadores visuales de precios/duración más destacados
- [x] Implementar modal/dialog para detalles adicionales
- [x] Agregar badges para destacar servicios populares
- [x] Mejorar iconografía

**Mejoras aplicadas:**
- ✅ Card-glow effect en todas las tarjetas
- ✅ Dialog de shadcn/ui para detalles expandidos
- ✅ Badge "Popular" con ícono Star en Taller Grupal
- ✅ Ring accent highlight en servicio popular
- ✅ Check icons para lista de features
- ✅ Clock icon junto a duración
- ✅ Hover-lift y transitions suaves
- ✅ Responsive mejorado (rounded-2xl/3xl, p-5/6)
- ✅ Botón "Ver detalles" con modal completo

---

### 5. 🖼️ Gallery Section
**Prioridad:** Baja  
**Estado:** ⏳ Pendiente (No existe actualmente)

**Tareas:**
- [ ] Verificar si existe gallery en el proyecto actual
- [ ] Si no existe, considerar agregar galería de fotos
- [ ] Implementar lightbox/modal para imágenes
- [ ] Agregar lazy loading para optimización
- [ ] Considerar usar carousel de shadcn/ui

**Nota:** Esta sección no existe actualmente en el proyecto. Se puede agregar en el futuro si se necesita.

---

### 6. 💬 Testimonials Section (Testimonios)
**Prioridad:** Media  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Implementar carousel para testimonios (más de 3)
- [x] Agregar avatares con iniciales más estilizados
- [x] Implementar sistema de calificación visual mejorado
- [x] Agregar animación de entrada más impactante
- [x] Hover-lift a las tarjetas

**Mejoras aplicadas:**
- ✅ 5 testimonios con carousel navigation
- ✅ Avatares con gradiente from-primary to-accent
- ✅ Botones prev/next con hover-lift
- ✅ Indicadores de puntos (dots) con estado activo animado
- ✅ Vista móvil single-card con animación de slide
- ✅ Vista desktop 3 cards con transición suave
- ✅ Card-glow effect en todas las tarjetas
- ✅ Estrellas de rating con fill-accent

---

### 7. 📅 Booking Section (Reservar)
**Prioridad:** Alta  
**Estado:** ✅ Completado

**Tareas completadas:**
- [x] Mejorar formulario con componentes shadcn/ui
- [x] Agregar validación visual en tiempo real
- [x] Implementar mejor feedback de envío (loading states)
- [x] Mejorar iconografía de información de contacto

**Mejoras aplicadas:**
- ✅ Input, Label, Textarea de shadcn/ui
- ✅ Select de shadcn/ui para dropdowns
- ✅ Loading spinner con Loader2 animado
- ✅ Estado de éxito con CheckCircle2
- ✅ Card-glow en formulario
- ✅ Hover-glow en iconos de info
- ✅ Animaciones escalonadas en info items
- ✅ Responsive mejorado (gap-4/6, p-6/8)
- ✅ Active scale feedback en botón submit

---

### 8. 📞 Contact Section (Contacto)
**Prioridad:** Media  
**Estado:** ⏳ Pendiente

**Nota:** La sección de contacto está integrada en Booking. No existe como sección separada.

---

### 9. 🦶 Footer
**Prioridad:** Baja  
**Estado:** ⏳ Pendiente

**Tareas:**
- [ ] Revisar footer existente
- [ ] Organizar enlaces por categorías
- [ ] Agregar newsletter subscription (opcional)
- [ ] Mejorar diseño responsive
- [ ] Agregar links legales (privacidad, términos)

---

## 🎨 Mejoras Globales

### Animaciones
- [x] Aplicar animaciones de entrada a secciones principales con IntersectionObserver
- [x] Agregar micro-interacciones a todos los botones
- [x] Implementar loading states en acciones asíncronas
- [ ] Agregar page transitions sutiles

### Responsive Design
- [x] Revisar breakpoints en todas las secciones
- [x] Optimizar para tablets (768px - 1024px)
- [x] Mejorar experiencia en móviles pequeños (<375px)
- [ ] Testar en dispositivos reales

### Accesibilidad
- [x] Agregar aria-labels a elementos interactivos de navegación
- [ ] Mejorar contraste de colores (WCAG AA)
- [ ] Implementar focus states visibles
- [ ] Agregar skip navigation link
- [ ] Testar con screen readers

### Performance
- [ ] Optimizar imágenes (WebP, lazy loading)
- [ ] Minimizar re-renders innecesarios
- [ ] Implementar code splitting
- [ ] Agregar preload para assets críticos

### SEO
- [ ] Revisar meta tags en todas las páginas
- [ ] Optimizar estructura de headings (H1, H2, H3)
- [ ] Agregar schema markup para negocio local
- [ ] Implementar Open Graph completo

---

## 🚀 Implementación Sugerida

### Fase 1 (Semana 1) - Secciones Críticas ✅ COMPLETADO
1. ✅ Hero Section optimización
2. ✅ Constelaciones + Proceso
3. ✅ Services Section

### Fase 2 (Semana 2) - Interacción ✅ COMPLETADO
1. ✅ Booking Section
2. ✅ Testimonials Section
3. ✅ About Section (refinamiento)

### Fase 3 (Semana 3) - Pulido
1. ⏳ Footer (pendiente)
2. ⏳ Gallery (opcional - no existe)
3. ⏳ Mejoras globales restantes

### Fase 4 (Semana 4) - Optimización
1. ⏳ Accesibilidad completa
2. ⏳ Performance optimization
3. ⏳ SEO completo
4. ⏳ Testing final

---

## 📝 Notas Técnicas

### Componentes shadcn/ui Utilizados
- ✅ Button, Input, Label, Textarea, Select
- ✅ Dialog (Services modals)
- ✅ Badge (Popular service indicator)
- ⏳ Accordion, Tabs, Carousel (disponibles)
- ⏳ Avatar, Progress (disponibles)
- ⏳ Form, Calendar, Checkbox (disponibles)
- ✅ Toast/Sonner (notificaciones)

### Animaciones CSS Disponibles
Clases de utilidad creadas:
- `animate-fade-in-up/down/left/right`
- `animate-slide-in-up/down/left/right`
- `animate-scale-in/scale-in-center`
- `delay-100` a `delay-800`
- `hover-lift`, `hover-glow`
- `transition-smooth`, `transition-bounce`
- `card-glow`

### Color Palette
- Primary: Sage Green `hsl(150 25% 35%)`
- Accent: Terracotta `hsl(15 55% 55%)`
- Background: Warm Cream `hsl(35 30% 97%)`

---

## ✅ Checklist de Calidad

Para cada sección completada:
- [x] Responsive en al menos 3 breakpoints (mobile, tablet, desktop)
- [x] Animaciones suaves y con propósito
- [x] Hover/focus states en elementos interactivos
- [x] Consistencia visual con el diseño
- [ ] Accesibilidad básica (aria-labels, contraste) - parcial
- [ ] Testing en al menos 2 navegadores - pendiente

---

**Última actualización:** 1 de febrero de 2026 - 15:10  
**Próxima revisión:** Después de completar Footer y mejoras globales

---

## 📊 Resumen de Progreso

| Sección | Estado | Prioridad |
|---------|--------|-----------|
| Hero | ✅ Completado | Alta |
| About | ✅ Completado | Media |
| Constelaciones | ✅ Completado | Alta |
| Services | ✅ Completado | Alta |
| Gallery | ⏳ N/A | Baja |
| Testimonials | ✅ Completado | Media |
| Booking | ✅ Completado | Alta |
| Contact | ⏳ N/A (en Booking) | Media |
| Footer | ⏳ Pendiente | Baja |

**Progreso Total: 6/7 secciones principales completadas (86%)**
