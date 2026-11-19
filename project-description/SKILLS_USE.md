# Какие скилы использовать на этом проекте

Каталог: корневой [SKILLS_README.md](../SKILLS_README.md) и файлы в `.cursor/skills/`.  
Фазы работ: [ROADMAP.md](./ROADMAP.md). В каждой фазе roadmap есть блок **Скилы** — сначала смотри его, сюда возвращайся за «когда / зачем».

Скил — это `SKILL.md`. Перед работой по фазе агент **читает** указанные скилы и следует им. Не подключать всё сразу: лишний контекст хуже, чем один точный скил.

Пути скилов: `.cursor/skills/<name>/SKILL.md`.

---

## Почти в каждой задаче

| Скил | Когда |
|---|---|
| `verifying-in-browser` | После любого UI/API: checkout, корзина, логин. Поднять сервер, кликнуть флоу, смотреть консоль и сеть |
| `systematic-debugging` | JWT refresh, BFF, UUID корзины — сначала воспроизвести, потом чинить |
| `auto-type-checking` | После правок TS на фронте или бэке (`tsc --noEmit`) |
| `parallel-exploring` | Задача режет оба репо (auth, cart, orders) |
| `saving-workspace-context` | Зафиксировать решение (payload JWT, guest vs login) — чтобы не потерять между чатами |

---

## По фазам roadmap

| Скил | Фаза / задача |
|---|---|
| `auditing-security` | Фазы 0–1 и 3, 5: секреты, IDOR корзины, публичные мутации товаров |
| `api-smoke-testing` | Фаза 2 (BFF) и 4 (`POST /orders`): пройти все `/api/*` |
| `network-request-auditing` | Cookies, двойной stringify register, checkout → `/api/orders` |
| `form-testing` | Логин, регистрация, checkout (валидный / невалидный телефон, НП) |
| `visual-qa-testing` | Корзина, checkout, dashboard после правок UI |
| `finding-dev-server-url` + `detecting-port-conflicts` | Два сервера `:3000` / `:3001`, `EADDRINUSE` |
| `database-design` | Фаза 4 — модуль заказов, не плодить лишние таблицы |
| `architecture-decision-records` | Гостевая корзина A vs B, один JWT payload |
| `responsive-testing` | Checkout и корзина на mobile/desktop |
| `grinding-until-pass` | Пока lint/build/типы не зелёные после фазы |

---

## Перед коммитом / PR

| Скил | Когда |
|---|---|
| `writing-commit-messages` | Любой коммит по фазе |
| `creating-pr` + `babysitting-pr` | Когда просят PR |
| `reviewing-code` или `parallel-code-review` | Крупный кусок: JWT, заказы, admin-guard |
| `suggesting-cursor-rules` | Если 2–3 раза поправляешь одно и то же (шаблон BFF, `userId` только из JWT) |

---

## Позже, не сейчас

- `writing-tests` / `adding-e2e-tests` / `recording-browser-flow-as-test` — когда checkout уже живой
- `adding-stripe` — когда появится реальная оплата (сейчас UI-only)
- `adding-api-docs` — после стабильного `/orders`
- `using-ui-stack` — только если полируем новые экраны под дизайн-систему

---

## Не использовать здесь

| Скил | Почему |
|---|---|
| `adding-auth` | Это Auth.js / NextAuth. У нас свой Fastify JWT + BFF |
| `python-tdd-with-uv` | Нет Python |
| `react-native-patterns` | Только веб |
| `kubernetes-deploying` | Нет K8s |
| `setting-up-terraform` | Нет IaC-задачи |
| `incident-response` | Нет продакшена |

---

## Как агенту выбирать скил

1. Открыть фазу в [ROADMAP.md](./ROADMAP.md) → блок **Скилы**.
2. Прочитать перечисленные `SKILL.md` **до** правок кода.
3. Ежедневный набор не отменяет фазовый: `verifying-in-browser` + `auto-type-checking` после каждой UI/API правки.
4. Если баг не сходится с первого раза — `systematic-debugging`, не «ещё одна правка вслепую».
5. Не читать весь `.cursor/skills/`. Каталог из 65 скилов не грузить в контекст.
