<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Coffeo UI та BFF — правила роботи

Ці правила діють для Coffeo. Робоча гілка — `dev`; `main` містить старий Supabase starter. Не зливати його автоматично й не повертати Supabase auth. Framework-generated блок вище зберігати без змін.

## Перед змінами

- Прочитати [аудит](docs/PROJECT_AUDIT_UA.md), [план](docs/IMPLEMENTATION_PLAN_UA.md), відповідний розділ [технічних рішень](docs/TECHNICAL_IMPLEMENTATION_UA.md) та релевантні ADR у `docs/decisions/`. Документи `project-description/*` з позначкою historical — старий контекст, а не поточний backlog.
- Виконувати лише замовлений квиток і не переходити далі автоматично. Не змішувати новий дизайн, checkout і CI в одному завданні.
- Зберігати два репозиторії: цей Next.js UI/BFF та [Fastify API](https://github.com/LeoFom/fastify-prisma-app/tree/dev). Не застосовувати до Coffeo продуктове ТЗ Lead Finder.
- Не створювати платні ресурси без окремого рішення. Не робити повторних deployment без необхідності. Push dev зараз може створити Vercel preview; це не підтвердження production release.

## Контракти та дані

- Браузер звертається тільки до same-origin `/api/*`; Fastify URL і `INTERNAL_API_KEY` читаються лише сервером. Не переносити ключі в `NEXT_PUBLIC_*`, client components або логи.
- Не запроваджувати пряме з'єднання браузера з Render/PostgreSQL. BFF передає auth cookies; роль і власника перевіряє API. UI-приховування кнопки не є авторизацією.
- TypeScript strict. Зберігати наявну JWT-схему. Публічна реєстрація створює Customer; bootstrap admin — окрема серверна операція. Кошик і checkout першого релізу потребують входу, див. ADR-002.
- Ціни, залишки, склад і остаточні суми визначає сервер; Redux — відображення. Не оголошувати спроєктовані DTO/UAH/COD/ідемпотентність уже реалізованими. Змінювати їх відповідними квитками плану.
- Не підміняти недоступність API порожнім успішним результатом у новому коді; показувати loading/error/empty окремо. Міграція чинної поведінки — квиток C1, а не прихована правка tooling.
- Не додавати реальні контакти покупців, exports, cookies, tokens, env або raw payload у Git. Статус історичних доступів — у звіті API C0.3; очищення файлу не є відкликанням ключа.

## Приймання

- Перевірити `npm run lint`, `npm run format:check`, `npm run test:tooling`, `npm run typecheck`, `npm run build`, `npm audit --audit-level=high`. Для UI/контрактних змін додати відповідні поведінкові тести та перевірити потрібний browser → BFF → API потік на ізольованій test БД.
- `test:tooling` перевіряє лише format gate; це не повний набір тестів магазину. Не виконувати реєстрації, checkout, seed/reset або синтетичні покупки на production.
- Використовувати той самий `.prettierrc.json`, що й API. `.format-baseline.json` дозволяє тільки незмінений початковий борг; нові та змінені файли мають бути відформатовані. Не оновлювати baseline для обходу помилок.
- У звіті вказати зміни, фактичні результати перевірок, невиконані пункти, статус CI/deployment та наступний квиток. Не зараховувати preview або незапущений CI як production-перевірку.
