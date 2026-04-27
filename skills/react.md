# React Skill: Architecture Enforcement

## Rules
- Keep domain logic in `src/domain`; do not embed business rules in JSX.
- Keep data fetching in `src/lib` or hooks; components render prepared data.
- Components must stay small and composable.
- Avoid prop drilling by composing sections or using context when depth grows.

## Anti-patterns
- Filtering/calculating business risk directly inside leaf presentation components.
- One giant screen component that owns every branch and style decision.
- Passing the same prop through 4+ component levels.

## Good patterns
- `domain`: schemas, enums, and pure business helpers.
- `lib`: typed API boundary and data mappers.
- `ui/components`: reusable visual primitives.
- `ui/screens`: composition and orchestration only.

## Recommended boundaries
- `domain/*` returns plain typed models.
- `lib/*` returns validated data.
- `ui/*` receives already validated domain models.
