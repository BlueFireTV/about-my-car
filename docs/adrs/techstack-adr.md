---
status: "akzeptiert"
date: 24.03.2025
decision-makers: Michael Schurzmann
---

# Frontend / Backend / Datenbank Techstack

## Kontext und Problemstellung

Für die Entwicklung der Anwendung muss ein geeigneter Techstack für Frontend, Backend und Datenbank gewählt werden. Ziel ist es, eine moderne, wartbare und performante Architektur zu schaffen, die zukünftige Erweiterungen ermöglicht und von den Teammitgliedern effizient genutzt werden kann.

## Entscheidungsfaktoren

* Entwicklererfahrung und -verfügbarkeit
* Community-Support und Dokumentation
* Performance und Skalierbarkeit
* Wartbarkeit und Erweiterbarkeit
* Integration mit bestehenden Tools und Workflows

## Betrachtete Optionen

* Frontend: React + Typescript mit Vite
* Backend: Node.js Express.js mit Typescript
* Datenbank: PostgreSQL
* Alternative Frameworks und Datenbanken (z. B. Angular, Vue, MongoDB, MySQL)

## Ergebnis der Entscheidung

Gewählte Option: "Frontend: React + Typescript mit Vite, Backend: Node.js Express.js mit Typescript, Datenbank: PostgreSQL", weil diese Kombination eine moderne, weit verbreitete und gut unterstützte Basis bietet und dort schon Vorerfahrungen vorhanden sind.

### Konsequenzen

* Gut, weil moderne Technologien mit großer Community und vielen Ressourcen verwendet werden.
* Gut, weil Typescript sowohl im Frontend als auch im Backend für Typsicherheit sorgt.
* Gut, weil PostgreSQL eine leistungsfähige und zuverlässige relationale Datenbank ist.
* Schlecht, weil Einarbeitung für Teammitglieder ohne Typescript- oder React-Erfahrung notwendig sein kann.

### Bestätigung

Die Implementierung wird anhand der gewählten Technologien überprüft.

## Pro und Contra der Optionen

### React + Typescript mit Vite (Frontend)

* Gut, weil React weit verbreitet und flexibel ist.
* Gut, weil Typescript Typsicherheit und bessere Wartbarkeit bietet.
* Gut, weil Vite für schnelle Entwicklungs- und Buildzeiten sorgt.
* Neutral, weil React eine steile Lernkurve für Einsteiger haben kann.
* Schlecht, weil alternative Frameworks wie Angular oder Vue ggf. besser zu bestimmten Anforderungen passen könnten.

### Node.js Express.js mit Typescript (Backend)

* Gut, weil Node.js und Express.js weit verbreitet und performant sind.
* Gut, weil Typescript auch im Backend für Typsicherheit sorgt.
* Neutral, weil Express.js sehr minimalistisch ist und zusätzliche Pakete benötigt werden könnten.
* Schlecht, weil für komplexere Anwendungen ggf. ein umfangreicheres Framework sinnvoll wäre.

### PostgreSQL (Datenbank)

* Gut, weil PostgreSQL leistungsfähig, zuverlässig und weit verbreitet ist.
* Gut, weil relationale Datenbanken für viele Anwendungsfälle geeignet sind.
* Neutral, weil NoSQL-Datenbanken für bestimmte Szenarien flexibler sein könnten.
* Schlecht, weil die Skalierung bei sehr großen Datenmengen komplexer sein kann.

