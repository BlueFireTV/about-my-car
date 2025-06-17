# Installation

## Vorraussetzungen
- Docker

## Projekt starten

1. Gesamte Repository klonen oder die `docker-compose.yml` kopieren.
2. Erstellen einer `.env` Datei im selben Verzeichnis der `docker-compose.yml`:

```bash
# Backend
PORT=3133
JWT_SECRET=<!! Generiere sicheres, zufälliges Secret für JWT, z.B. mindestens 32 Zeichen !!>

# Database
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<!! Generiere ein Sicheres Datenbank-Passwort !! >
POSTGRES_DB=postgres

# Frontend
AMC_BACKEND_URL=http://backend:${PORT}
```


3. Stelle sicher, dass Docker auf deinem System installiert ist.
4. Starte das Projekt mit Docker Compose:

   ```bash
   docker-compose up
   ```

   Dadurch wird das gesamte Projekt inkl. Frontend, Backend und Datenbank gestartet.
   
   Die Webseite läuft unter [http://localhost:8080](http://localhost:8080) (oder dem von dir in der Docker-Compose-File konfigurierten Port).

## Anwendung stoppen

Um die Container zu stoppen:

```bash
docker-compose down
```

Um die Cotainer inkl. Volumes zu stoppen und entfernen:

```bash
docker-compose down -v
```