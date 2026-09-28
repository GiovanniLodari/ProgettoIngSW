# ProgettoIngSW — gestione di organigrammi aziendali

Applicazione web per costruire e modificare l'**organigramma di un'azienda**: unità organizzative, dipendenti e ruoli, con importazione di dipendenti da file e visualizzazione ad albero.

Progetto per il corso di Ingegneria del Software.

## Stack

- **Backend**: Java 17, Spring Boot 3.5 (Web, Data JPA, Data REST), PostgreSQL
- **Frontend**: Angular 21, Angular Material, ng-bootstrap

## Requisiti

- JDK 17+
- Node.js 20.19+ (o 22 / 24)
- PostgreSQL con un database chiamato `ProgettoIngSW` e uno schema `isdb`

## Configurazione

Il backend legge le credenziali del database dalle variabili d'ambiente:

| Variabile | Default |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/ProgettoIngSW` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | *(obbligatoria)* |

```bash
export DB_PASSWORD=la-tua-password        # Windows PowerShell: $env:DB_PASSWORD="la-tua-password"
```

## Avvio

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

## Struttura

| Percorso | Contenuto |
|---|---|
| `src/main/java/.../controller` | API REST (organigrammi, unità, dipendenti, ruoli, login) |
| `src/main/java/.../entity` | Entità JPA |
| `src/main/java/.../service`, `repository` | Logica applicativa e accesso ai dati |
| `frontend/src/app` | Componenti Angular (home, tabella, albero, popup di modifica) |
