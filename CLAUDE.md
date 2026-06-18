# CLAUDE.md — Hoja de ruta del proyecto

> Este archivo es leído automáticamente por Claude al iniciar cualquier conversación en este proyecto.
> Contiene el contexto del sistema, las decisiones tomadas y el estado actual del desarrollo.
> **Mantenerlo actualizado es obligatorio** — es la memoria del proyecto entre sesiones.
> Al iniciar un proyecto nuevo: completar todos los campos entre [corchetes] antes de la primera sesión.

---

## Proyecto

**Nombre**: Sistema de Caja — Bodega Viamonte
**Tipo**: Sistema de gestión a medida (punto de venta / caja)
**Cliente**: Bodega Viamonte
**Desarrollado por**: Nuvvora
**Inicio**: 2026-06-15

### Descripción del sistema

Sistema de caja para la Bodega Viamonte. Permite controlar las ventas de tragos: registrar
ventas, gestionar los productos del catálogo y llevar el control de la caja. El primer módulo
es la venta de tragos. El sistema lo operan dos perfiles: el administrador (acceso total) y
el cajero (operación de la caja).

---

## Reglas del proyecto

Este proyecto respeta estrictamente los siguientes documentos. Leerlos antes de hacer cualquier cambio:

* [ai-pmp/rules.txt](ai-pmp/rules.txt) — Stack, arquitectura general y reglas de código
* [ai-pmp/frontend-rules.txt](ai-pmp/frontend-rules.txt) — Componentes, formularios, estado y UI
* [ai-pmp/supabase-rules.txt](ai-pmp/supabase-rules.txt) — Base de datos, RLS, seguridad y queries
* [ai-pmp/error-handling.txt](ai-pmp/error-handling.txt) — Manejo de errores y estados de carga
* [ai-pmp/naming-rules.txt](ai-pmp/naming-rules.txt) — Convenciones de nombres
* [ai-pmp/git-rules.txt](ai-pmp/git-rules.txt) — Commits y ramas

---

## Stack del proyecto

* React 18 + Vite + TypeScript strict
* Tailwind CSS + shadcn/ui
* Supabase (auth + base de datos)
* TanStack React Query
* React Hook Form + Zod
* React Router v6

> Si este proyecto usa versiones distintas a las de `rules.txt`, registrarlo en "Decisiones técnicas".

---

## Comandos

```
npm run dev          → servidor de desarrollo
npm run build        → build de producción (debe pasar sin errores antes de entregar)
npx tsc --noEmit     → verificación de tipos (correr antes de entregar cualquier cambio)
npm run lint         → linter (si está configurado)
```

---

## Módulos del sistema

Actualizar esta sección a medida que se van completando módulos.

| Módulo | Estado | Tablas Supabase | Notas |
|--------|--------|-----------------|-------|
| Auth | Completo | user_roles | Login real con Supabase auth, ProtectedRoute por sesión/rol, logout. |
| Caja | UI lista | productos | Tarjetas de productos + armado de pedido en memoria. Navbar Caja/Ventas/Clientes. |
| Ventas | Completo | ventas | Finalizar registra una venta por unidad. Pantalla con recaudado/operaciones del día y tabla. |
| Clientes | Pendiente | — | Placeholder en navbar. |

Estados posibles: `Pendiente` / `En desarrollo` / `UI lista` / `Completo`

---

## Base de datos — Tablas creadas

Actualizar cuando se crea una tabla nueva en Supabase.

```
- user_roles  → rol y nombre de cada usuario (FK a auth.users). RLS: cada uno lee
                solo su fila; sin escritura desde el cliente. Roles: ('admin','caja').
- productos    → catálogo de tragos (id, nombre_producto, valor numeric(12,2), imagen url,
                soft delete). RLS: autenticados leen activos; solo admin escribe.
- descripcion_productos → ficha del producto (id, id_producto FK UNIQUE a productos
                ON DELETE CASCADE, descripcion text, ingredientes jsonb array de {nombre,cantidad}).
                RLS: autenticados leen; solo admin escribe.
- ventas       → ventas individuales (id, id_producto FK ON DELETE RESTRICT, valor numeric(12,2),
                metodo_pago CHECK efectivo/tarjeta/transferencia, id_eventos FK a eventos, created_at).
                Cada producto/unidad es una fila. RLS: autenticados leen; el INSERT exige rol válido
                Y que id_eventos apunte a un evento 'activado'; solo admin modifica/borra.
- eventos      → jornadas/fiestas (id, nombre, fecha, total numeric(12,2), estado CHECK
                sin_fecha/activado/terminado, created_at). Índice único parcial: un solo evento
                'activado' a la vez. El total real se calcula sumando las ventas (no se guarda fijo).
                RLS: autenticados leen; solo admin escribe.
```

Funciones y triggers asociados:
```
- tiene_rol(text)      → chequeo de rol centralizado para políticas RLS (SECURITY DEFINER)
- handle_new_user()    → trigger on_auth_user_created: alta automática en user_roles (rol 'caja')
- set_updated_at       → trigger de updated_at sobre user_roles (moddatetime)
```

Ejemplo de cómo completar:
```
- user_roles       → roles de usuario (admin, gerente, empleado)
- productos        → inventario de productos
- clientes         → registro de clientes
- ventas           → cabecera de ventas
- lineas_de_venta  → detalle de cada venta
```

---

## Roles del sistema

Definir los roles que maneja el sistema y qué puede hacer cada uno.

| Rol | Permisos |
|-----|----------|
| admin | Acceso total al sistema (gestión de productos, ventas, caja, usuarios) |
| caja | Operación de la caja: registrar ventas de tragos |

> Valores internos del campo `rol`: `'admin'` y `'caja'`. En la UI se muestran como
> "Administrador" y "Caja". Por ahora solo existen estos dos roles.

**Alta de usuarios**: Sin signup abierto. Los usuarios los crea el administrador desde el
dashboard de Supabase (o vía Edge Function con service key). El rol por defecto del trigger
`handle_new_user` debe ser `'caja'` (el de menor privilegio); el admin lo sube si corresponde.

---

## Checklist de seguridad

Verificar al completar el módulo Auth y repasar al crear cada tabla nueva. Los patrones están en `ai-pmp/supabase-rules.txt`.

- [x] Tabla `user_roles` con RLS propio: nadie puede modificar su rol desde el cliente
- [x] Función `tiene_rol()` con `SECURITY DEFINER` creada (evita recursión y centraliza el chequeo)
- [x] Trigger `handle_new_user` creado (todo usuario nuevo recibe fila en `user_roles`)
- [ ] Toda tabla nueva: RLS habilitado + `WITH CHECK` en políticas de escritura
- [x] Toda tabla nueva: trigger de `updated_at` + constraints SQL (`CHECK`, `NOT NULL`, FKs) — hecho en `user_roles`
- [ ] Campos de dinero en `numeric(12,2)` — nunca float (aplica al módulo Ventas)
- [x] Después de cada cambio de schema: correr `get_advisors` del MCP y corregir alertas

---

## Decisiones técnicas tomadas

Registrar aquí cualquier decisión que se salga del estándar o que sea importante recordar.

* **Roles**: el campo `rol` de `user_roles` usa `('admin', 'caja')` para este proyecto (en
  lugar del `('admin', 'gerente', 'empleado')` de ejemplo en supabase-rules.txt). Recordar
  ajustar el `CHECK` de la tabla y el rol por defecto del trigger a `'caja'`.
* **Login solo de UI** en esta primera etapa: el formulario de login todavía no se conecta a
  Supabase auth (se hará con el prompt "2. CONECTAR AUTH" cuando el proyecto exista en Supabase).
* **Alerta de `get_advisors` aceptada conscientemente**: `tiene_rol(text)` queda con `EXECUTE`
  para `authenticated` (el linter la marca como "SECURITY DEFINER ejecutable por usuarios
  autenticados"). Es necesario para que las políticas RLS la evalúen, y es inofensivo: solo
  informa el rol del propio usuario vía `auth.uid()`, no escala privilegios. Es el patrón
  estándar de Supabase. Las funciones `handle_new_user` y `rls_auto_enable` sí tienen el
  `EXECUTE` revocado a `anon`/`authenticated` (solo corren por trigger).
* **`rls_auto_enable`**: event trigger preexistente del proyecto (no creado por nosotros) que
  habilita RLS automáticamente al crear tablas en `public`. Se le revocó el `EXECUTE` público.

---

## Estado actual del desarrollo

Actualizar al final de cada sesión de trabajo.

**Última sesión**: 2026-06-15
**Próximo paso**: Cargar productos en la tabla `productos` (vía dashboard o pantalla de gestión
para admin) para verlos en la caja. Luego el módulo Ventas: persistir el pedido como venta
(tablas ventas/items_venta) y conectar el botón "Finalizar" de la caja.

**Lo que está funcionando**:
* Estructura base del proyecto (Vite + React 18 + TS strict + Tailwind + shadcn/ui + React Query + React Router)
* Auth completo: login real con Supabase (`signInWithPassword`), error con toast destructive,
  redirect a `/dashboard`, logout, y `ProtectedRoute` que chequea sesión y rol reales
* Cliente Supabase tipado en `integrations/supabase/` (con tipos generados de la base)
* Tabla `user_roles` con RLS, `tiene_rol()` y `handle_new_user`

**Lo que está pendiente**:
* Crear usuarios reales en Supabase para probar el login
* Habilitar (opcional) "Leaked Password Protection" en el dashboard de Supabase Auth
* Módulo Ventas / Caja (venta de tragos)

**Problemas conocidos o deuda técnica**:
* Sin alta de usuarios desde la app: los crea el admin en el dashboard de Supabase (por diseño)

---

## Instrucciones para la IA

1. **Antes de escribir cualquier código**, leer los documentos de `ai-pmp/` referenciados arriba.
2. **No empezar nuevos módulos** sin que el usuario lo indique explícitamente.
3. **Antes de entregar cualquier cambio**: correr `npx tsc --noEmit` y verificar que no hay imports rotos ni errores. Si el cambio es grande, verificar también que `npm run build` pasa.
4. **Si hay ambigüedad** en un requerimiento, preguntar antes de implementar.
5. **No agregar dependencias nuevas** sin consultarlo primero.
6. **Actualizar la tabla de módulos** de este archivo cuando se complete uno.
7. **El límite es 300 líneas por archivo** — si se supera, dividir en subarchivos o componentes.
8. **Nunca leer, imprimir ni commitear el contenido de `.env`** ni de ningún archivo con credenciales.
9. **Después de cualquier cambio de schema en Supabase**, correr `get_advisors` del MCP y corregir las alertas de seguridad antes de dar por terminada la tarea.
10. **Al terminar una sesión de trabajo**, actualizar la sección "Estado actual del desarrollo" de este archivo.

---

## Cómo actualizar este archivo

Este archivo es la memoria viva del proyecto. Actualizarlo:

* **Al terminar un módulo** → cambiar su estado en la tabla de módulos
* **Al crear una tabla nueva** → agregarla en "Base de datos"
* **Al tomar una decisión técnica importante** → registrarla en "Decisiones técnicas"
* **Al terminar una sesión** → actualizar "Estado actual del desarrollo"
* **Al definir roles** → completar la tabla de roles y el checklist de seguridad

No es necesario actualizar en cada commit — solo cuando hay cambios de estado o decisiones importantes.
