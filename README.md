# Kenapa Memilih Pattern **Feature-First Modular + Clean Architecture (Hexagonal-lite)**

Saya menggunakan pola **feature-first modular** milik NestJS yang dipadu dengan prinsip **Clean Architecture/Hexagonal (ports & adapters) versi ringan**. Struktur utamanya memisahkan **domain/use-case** dari **infrastruktur** (DB, HTTP, dll.), serta mengelompokkan kode per **fitur** agar mudah diskalakan.

## Struktur Singkat

```
src/
  modules/
    auth/                # fitur auth (JWT)
      auth.controller.ts
      auth.service.ts    # use-case / domain logic
      dto/
      strategy/          # passport-jwt
    todo/
      todo.controller.ts
      todo.service.ts
      todo.module.ts
      dto/
      response/
    categorie/
      category.controller.ts
      category.service.ts
      category.module.ts
      dto/
      response/
  database/
      entities/          # Entities TypeORM (adapter DB)
      migrations/
  common/
    guards/              # JWT guard, role guard
    interceptors/        # response / logging
    pipes/               # validation, transform
  model/
  main.ts
  app.module.ts
```

## Alasan & Manfaat

### 1. High Cohesion, Low Coupling (mudah scaling tim & fitur)

- Semua file sebuah fitur berada dalam satu module (controller, service, dto, validator).
- Tim bisa mengerjakan `todos/` dan `categories/` tanpa saling mengganggu.

### 2. Separation of Concerns yang Jelas

- **Controller**: HTTP I/O (transport).
- **Service (Use-Case)**: aturan bisnis.
- **Repository/Entity (Adapter DB via TypeORM)**: akses data.
  Pemisahan ini membuat logika bisnis tidak “terkontaminasi” detail framework/DB.

### 3. Mudah Dites (Unit & E2E)

- Service dapat di-mock dependency-nya (repository/DB) → **unit test cepat & deterministik**.
- Boundary yang rapi memudahkan **e2e test** dengan `supertest` (terutama untuk alur Auth/JWT).

### 4. Portability/Replaceable Infrastructure

- Menggunakan **ports & adapters** secara ringan: akses data dibungkus di layer repository/service.
- Jika suatu saat migrasi DB (Postgres → MySQL) atau ganti provider cache, perubahan terkonsentrasi di adapter, **tanpa menyentuh domain logic**.

### 5. Konsistensi Validasi & Kontrak Data

- **DTO + class-validator/class-transformer** menjaga kontrak request/response konsisten, memudahkan dokumentasi (Postman/Swagger) dan mengurangi bug parsing.

### 6. Observability & Cross-Cutting Concerns Terkelola

- **Interceptors/Guards/Pipes** dipasang global agar logging, formatting response, dan otorisasi **seragam** di seluruh modul.

### 7. Skalabilitas Jangka Panjang

- Saat fitur bertambah (payment, notification, dsb.), cukup menambah module baru.
- Pola ini “tumbuh” mulus menjadi **DDD/Hexagonal penuh** bila kompleksitas domain meningkat (mis. menambah domain events, aggregate, dll.).

> Singkatnya, pattern ini memberikan **struktur yang rapi, mudah diuji, mudah dirawat, dan skalable**
