# ProgettoIngSW — company organigram management

Web application to build and edit a **company organigram**: organizational units, employees and roles, with employee import from file and a tree view.

University project for the Software Engineering course. The interface is in Italian.

## Stack

- **Backend**: Java 17, Spring Boot 3.5 (Web, Data JPA, Data REST), PostgreSQL
- **Frontend**: Angular 21, Angular Material, ng-bootstrap

## Requirements

- JDK 17+
- Node.js 20.19+ (or 22 / 24)
- PostgreSQL with a database named `ProgettoIngSW` and a schema `isdb`

## Configuration

The backend reads the database credentials from environment variables:

| Variable | Default |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/ProgettoIngSW` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | *(required)* |

```bash
export DB_PASSWORD=your-password        # Windows PowerShell: $env:DB_PASSWORD="your-password"
```

## Running

```bash
# backend → http://localhost:8080
./mvnw spring-boot:run

# frontend → http://localhost:4200
cd frontend
npm install
npm start
```

## Build

```bash
./mvnw clean package          # jar in target/
cd frontend && npm run build  # output in frontend/dist/
```

## Structure

| Path | Content |
|---|---|
| `src/main/java/.../controller` | REST API (organigrams, units, employees, roles, login) |
| `src/main/java/.../entity` | JPA entities |
| `src/main/java/.../service`, `repository` | Application logic and data access |
| `frontend/src/app` | Angular components (home, table, tree, edit popups) |
