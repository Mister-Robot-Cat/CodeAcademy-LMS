# CodeAcademy LMS — Progress Log

> Этот файл — единственный источник правды о состоянии проекта между сессиями агента.
> Правило для агента: ПЕРЕД началом работы прочитать этот файл целиком.
> ПОСЛЕ окончания работы — обновить соответствующие секции ниже, не удаляя историю.

---

## Текущая активная фаза
- Фаза: Фаза 1 — Электронный журнал + Посещаемость
- Статус: IN_PROGRESS   <!-- варианты: NOT_STARTED / IN_PROGRESS / BLOCKED / DONE_AWAITING_REVIEW / MERGED -->
- Ветка: feature/phase-1-journal
- Последнее обновление: 2026-07-20

---

## Карта фаз (общий статус проекта)

| # | Фаза                              | Статус       | Ветка                        |
|---|------------------------------------|--------------|-------------------------------|
| 1 | Журнал + Посещаемость              | IN_PROGRESS  | feature/phase-1-journal       |
| 2 | Оценки и успеваемость              | NOT_STARTED  | -                              |
| 3 | Портал студента                    | NOT_STARTED  | -                              |
| 4 | Портал родителя                    | NOT_STARTED  | -                              |
| 5 | Задания (LMS)                      | NOT_STARTED  | -                              |
| 6 | Уведомления                        | NOT_STARTED  | -                              |
| 7 | Календарь                          | NOT_STARTED  | -                              |
| 8 | Финансы                            | NOT_STARTED  | -                              |
| 9 | Отчёты и экспорт                   | NOT_STARTED  | -                              |
|10+| Bonus (мессенджер, ИИ, 2FA и т.д.) | NOT_STARTED  | -                              |

---

## Уже реализовано и стабильно (не трогать без явного запроса)
- Backend: /api/auth (register/login), /api/student, /api/teacher, /api/group,
  /api/group/semesters, /api/admin/stats
- Frontend: страницы логина/регистрации, layout админки, дашборд,
  /admin/groups (ActionModal, SearchableCombobox, FloatingLabelInput)

---

## Журнал прогонов (агент добавляет новую запись сверху при каждом запуске)

### Прогон #1 — 2026-07-20 10:00 (Автономный режим)
- Фаза: Фаза 1 — Электронный журнал + Посещаемость
- Что было сделано: Добавлены поля `Homework` для `Lesson` и `Notes` для `Attendance`. Создана миграция БД `AddLessonAndAttendanceFields`. Написан Application слой: CQRS команды/запросы для CRUD уроков (`CreateLessonCommand`, `UpdateLessonCommand`, `GetGroupLessonsQuery`) и управления посещаемостью (`MarkAttendanceCommand`, `GetLessonAttendanceQuery`). Созданы `LessonsController` и `AttendancesController`. Сделано 2 git-коммита.
- Файлы созданы/изменены: Lesson.cs, Attendance.cs, ApplicationDbContext.cs, CQRS commands/queries, LessonsController.cs, AttendancesController.cs.
- Миграции БД: создана? ДА (`AddLessonAndAttendanceFields`). применена? НЕТ (Требуется ручной запуск `dotnet ef database update`).
- Build: PASS
- Тесты вручную: не проверено (нужно реализовать и собрать фронтенд)
- Что осталось доделать: Реализовать frontend (страница журнала для учителя, форма посещаемости, страница для админа).
- Заблокировано на: -

---

## Известные ограничения / нюансы (агент должен помнить)
- Пароль от локальной БД PostgreSQL: 123123
- Бэкенд запускать строго `dotnet run --launch-profile https` (порт 7109)
- Фронт: http://localhost:3000
- После пересоздания БД токены (localStorage: accessToken) протухают — это норма
- Списки API — формат PaginatedList (items)
- Не применять миграции автоматически без явного разрешения человека
