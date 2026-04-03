# Skill Registry - GimnasioReactDjango

## Project Skills

### SDD Workflow
| Skill | Location | Trigger |
|-------|----------|---------|
| sdd-init | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-init/SKILL.md` | Inicializar SDD |
| sdd-propose | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-propose/SKILL.md` | Crear proposal |
| sdd-spec | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-spec/SKILL.md` | Escribir specs |
| sdd-design | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-design/SKILL.md` | Diseño técnico |
| sdd-tasks | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-tasks/SKILL.md` | Task breakdown |
| sdd-apply | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-apply/SKILL.md` | Implementación |
| sdd-verify | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-verify/SKILL.md` | Verificación |
| sdd-archive | `file:///C:/Users/Oscar/.config/opencode/skills/sdd-archive/SKILL.md` | Archivar |

---

## Project Conventions

### Frontend (React + TypeScript)
- **State**: Context API para auth, local state para UI
- **API Layer**: Axios con interceptores en `src/api/axios/`
- **Components**: Feature-based en `pages/`, átomos en `components/ui/`
- **Validation**: react-hook-form (sin schema validation aún)
- **Tables**: @tanstack/react-table
- **Styling**: Tailwind CSS + styled-components (mezclado - unificar)

### Backend (Django + DRF)
- **Models**: En `gimnasioApp/models.py`
- **Views**: ViewSets en `gimnasioApp/views.py`
- **Serializers**: `gimnasioApp/serializers.py`
- **Auth**: TokenAuthentication
- **Filters**: django-filter con SearchFilter

### Testing
- **Backend**: tests.py vacío - PRIORIDAD agregar tests
- **Frontend**: Sin framework de tests visible

---

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Django 5.1, DRF 3.15, PostgreSQL
- Auth: DRF TokenAuthentication
