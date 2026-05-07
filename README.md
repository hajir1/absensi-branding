# Fullstack Application Documentation

Aplikasi ini menggunakan arsitektur fullstack:

- Backend : Java Spring Boot
- Frontend : React JS
- Database : MySQL
- Backend dijalankan menggunakan IntelliJ IDEA
- Frontend dijalankan menggunakan Visual Studio Code
- Komunikasi frontend dan backend menggunakan REST API

---

# Arsitektur Sistem

```text
Frontend (React)
        ↓ HTTP Request
REST API (Spring Boot)
        ↓
Database (MySQL)
```

Frontend bertugas menampilkan antarmuka pengguna, sedangkan backend menyediakan API dan proses bisnis aplikasi.

---

# Tech Stack

## Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Maven
- MySQL

## Frontend
- React JS
- Axios
- Node JS
- NPM

---

# Persiapan Instalasi

## Software yang Harus Diinstall

### Backend
- Java JDK 17+
- IntelliJ IDEA
- MySQL

### Frontend
- Node JS
- Visual Studio Code

---

# Clone Repository

```bash
git clone https://github.com/hajir1/absensi-branding.git
```

---

# Struktur Folder

```text
project/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│
├── frontend/
│   ├── src/
│   ├── package.json
│
└── README.md
```

---

# Setup Backend (Spring Boot)

## 1. Buka Project Backend di IntelliJ IDEA

- Open IntelliJ IDEA
- Klik Open
- Pilih folder `be`

---

## 2. Setup Database

Buat database MySQL:

```sql
CREATE DATABASE db_absensi;
```

---

## 3. Konfigurasi application.properties

Lokasi file:

Contoh konfigurasi:
by default, konfigurasi dibawah ini telah ditambahkan
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/app_db
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```


---

## 4. Install Dependency Maven

Jika dependency belum otomatis terinstall:

```bash
mvn clean install
```

---

## 5. Menjalankan Backend

Jalankan file utama Spring Boot:

```text
Application.java
```

Klik tombol **Run** di IntelliJ IDEA.

Jika berhasil, backend berjalan pada:

```text
http://localhost:8080
```

---

# Setup Frontend (React)

## 1. Buka Folder Frontend di VS Code

- Open Folder
- Pilih folder `fe`

---

## 2. Install Dependency

Buka terminal VS Code:

```bash
npm install
```

---


## 3. Menjalankan Frontend

Jika menggunakan Vite:

```bash
npm run dev
```

Jika menggunakan Create React App:

```bash
npm start
```

Frontend biasanya berjalan di:

```text
http://localhost:5173
```

atau

```text
http://localhost:3000
```

---

# Komunikasi Frontend dan Backend

Frontend React berkomunikasi dengan backend Spring Boot menggunakan REST API.

Contoh alur komunikasi:

```text
React Frontend
      ↓
HTTP Request (Axios/Fetch)
      ↓
Spring Boot REST API
      ↓
Database MySQL
```

---

# Contoh Endpoint API

## Login

### Request

```http
POST /api/auth/login
```

### Body

```json
{
  "username": "admin",
  "password": "admin"
}
```

### Response

```json
{
  "message": "Login Success",
  "data": {
    "token": "jwt-token"
  }
}
```

---

# Konfigurasi CORS

Agar frontend dapat mengakses backend, tambahkan konfigurasi CORS di Spring Boot.

Contoh:

```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*");
            }
        };
    }
}
```

---

# Menjalankan Project

## Jalankan Backend

Backend berjalan di:

```text
http://localhost:8080
```

---

## Jalankan Frontend

Frontend berjalan di:

```text
http://localhost:5173
```

---

# Build Production

## Backend

Build project Spring Boot:

```bash
mvn clean package
```

Hasil build berada di:

```text
target/app.jar
```

Menjalankan file jar:

```bash
java -jar app.jar
```

---

## Frontend

Build React:

```bash
npm run build
```

Hasil build berada di folder:

```text
dist/
```

atau

```text
build/
```

---

# Troubleshooting

## Port Sudah Digunakan

Ganti port backend di:

```properties
server.port=8081
```

---

## CORS Error

Pastikan konfigurasi CORS backend sudah benar.

---

## Dependency Error

Backend:

```bash
mvn clean install
```

Frontend:

```bash
npm install
```

---

# Author

Nama Developer