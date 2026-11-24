# Coffeo

Next.js UI та BFF магазину Coffeo. Робоча гілка — `dev`; legacy `main` містить Supabase starter. Магазин має основу каталогу, кошика, замовлень і dashboard, але приймання повного сценарію продажу ще триває.

## Поточні документи

- [Аудит реалізованого та прогалин](docs/PROJECT_AUDIT_UA.md)
- [План завершення](docs/IMPLEMENTATION_PLAN_UA.md) та [детальні технічні рішення](docs/TECHNICAL_IMPLEMENTATION_UA.md)
- [Правила Codex](AGENTS.md), [розгортання](DEPLOYMENT.md), [ADR](docs/decisions/)
- [Стан історичних доступів API](https://github.com/LeoFom/fastify-prisma-app/blob/dev/docs/security/C0_3_STATUS_UA.md)

`project-description/*` збережені як історичні документи; вони не є поточним переліком невиконаних робіт.

## Локальний запуск

Потрібні Node.js 24 та окремо запущений [Fastify API](https://github.com/LeoFom/fastify-prisma-app/tree/dev). Секрети й параметри його PostgreSQL налаштовуються в API, не у фронтенді.

```sh
npm ci
cp .env.example .env.local
```

У `.env.local` задати `API_URL=http://127.0.0.1:3001` та `INTERNAL_API_KEY`, що збігається з локальним API. Потім виконати `npm run dev` і відкрити [localhost:3000](http://localhost:3000).

Браузер звертається до same-origin `/api/*`; BFF пересилає запити до Fastify. Auth працює через JWT та HttpOnly cookies. Не потрібні Supabase або публічний URL/ключ API. Реєстрація створює Customer; кошик і замовлення потребують входу.

## Перевірки

```sh
npm run lint
npm run format:check
npm run test:tooling
npm run typecheck
npm run build
npm audit --audit-level=high
```

Форматування працює поступово: нові та змінені файли проходять Prettier; незмінений борг має baseline за хешем вмісту. `test:tooling` перевіряє цей механізм, а не весь магазин. Порядок і межі перевірок описані у [C0.4](docs/C0_4_RULES_AND_CI_UA.md).

## Release baseline

[Зафіксовані версії](docs/releases/2026-11-24-baseline.json) · [порядок релізу й відкату](docs/RELEASE_AND_ROLLBACK_UA.md) · [результати C0.5](docs/C0_5_RELEASE_BASELINE_UA.md).
