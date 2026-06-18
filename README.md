# KNOW - HOW — Kit de arranque de proyectos

Plantilla base para iniciar sistemas nuevos y para onboarding de desarrolladores del equipo. Esta carpeta NO es un proyecto — es el origen del que se copia todo al arrancar uno.

## Procedimiento al iniciar un proyecto nuevo

1. Crear la carpeta del proyecto y dentro la carpeta `ai-pmp/`
2. Copiar los 6 archivos `.txt` de reglas a `[proyecto]/ai-pmp/`:
   `rules.txt`, `frontend-rules.txt`, `supabase-rules.txt`, `error-handling.txt`, `naming-rules.txt`, `git-rules.txt`
3. Copiar `CLAUDE.md` a la **raíz** del proyecto (Claude lo lee automáticamente solo si está en la raíz)
4. Completar en `CLAUDE.md` todos los campos entre `[corchetes]`: nombre, cliente, descripción, módulos y roles del sistema
5. Usar el prompt "1. INICIO DE PROYECTO" de `nuvvora-prompts.txt` para la primera sesión

> **Importante**: el `CLAUDE.md` referencia las reglas en `ai-pmp/` — si los `.txt` quedan en otra ruta, la IA no los encuentra y falla en silencio.

## Contenido del kit

| Archivo | Para qué sirve | ¿Se copia al proyecto? |
|---------|----------------|------------------------|
| `CLAUDE.md` | Memoria viva del proyecto, leída por Claude en cada sesión | Sí, a la raíz |
| `rules.txt` | Stack, arquitectura y reglas de código | Sí, a `ai-pmp/` |
| `frontend-rules.txt` | Componentes, formularios, estado y UI | Sí, a `ai-pmp/` |
| `supabase-rules.txt` | Base de datos, RLS, seguridad y queries | Sí, a `ai-pmp/` |
| `error-handling.txt` | Manejo de errores y estados de carga | Sí, a `ai-pmp/` |
| `naming-rules.txt` | Convenciones de nombres | Sí, a `ai-pmp/` |
| `git-rules.txt` | Commits, ramas y .gitignore | Sí, a `ai-pmp/` |
| `nuvvora-prompts.txt` | Prompts base para cada etapa del desarrollo | No — es para uso humano |

## Mantenimiento del kit

* Cuando un proyecto descubre una regla nueva que vale para todos, traerla acá — esta carpeta es la fuente de verdad
* Revisar la sección de stack de `rules.txt` cuando cambien las versiones estándar (React, Tailwind, shadcn) y anotar la fecha de la última verificación
* Última revisión general del kit: 2026-06-11
