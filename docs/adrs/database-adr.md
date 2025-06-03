---
status: "akzeptiert"
date: 24.03.2025
decision-makers: Michael Schurzmann
---

# Datenbank - Strukturdefinition

## Kontext und Problemstellung

Für die Anwendung muss die Datenbankstruktur definiert werden. Es stehen verschiedene Ansätze zur Verfügung, um Tabellen und deren Beziehungen zu modellieren und zu initialisieren. Die Entscheidung betrifft, ob dies direkt in SQL-Skripten oder per TypeScript-Code mit Typdefinitionen erfolgen soll.

## Entscheidungsfaktoren

* Wartbarkeit der Datenbankstruktur
* Nachvollziehbarkeit der Änderungen (Versionierung)
* Integration in den Entwicklungsprozess
* Automatisierbarkeit von Migrationen

## Betrachtete Optionen

* Definition der Datenbankstruktur in PostgreSQL mittels SQL-Skripten
* Definition der Datenbankstruktur per TypeScript-Code mit Types

## Ergebnis der Entscheidung

Gewählte Option: "Definition der Datenbankstruktur in PostgreSQL mittels SQL-Skripten", weil dies eine direkte Kontrolle über die Datenbankobjekte ermöglicht, unabhängig von der Programmiersprache, und sich gut in bestehende Datenbank-Tools und CI/CD-Prozesse integrieren lässt.

### Konsequenzen

* Gut, weil die Struktur unabhängig von der Applikationslogik gepflegt werden kann.
* Gut, weil Standard-Tools für Migration und Versionierung genutzt werden können.
* Schlecht, weil Änderungen an der Datenbankstruktur nicht automatisch mit TypeScript-Typen synchronisiert werden.
* Schlecht, weil zusätzliche Pflege für Typen in der Applikation notwendig ist.

### Bestätigung

Die Einhaltung der Struktur kann durch Tools wie pgAdmin oder automatisierte Checks im CI/CD sichergestellt werden.

## Pro und Contra der Optionen

### Definition in PostgreSQL mit SQL-Skripten

* Gut, weil Standardisierung und Toolunterstützung vorhanden sind.
* Gut, weil unabhängig von der Programmiersprache.
* Neutral, weil Entwickler SQL-Kenntnisse benötigen.
* Schlecht, weil Typen in der Applikation separat gepflegt werden müssen.

### Definition per TypeScript-Code mit Types

* Gut, weil Typen und Datenbankstruktur eng gekoppelt sind.
* Gut, weil Änderungen direkt im Code nachvollziehbar sind.
* Neutral, weil zusätzliche Tools für Migrationen benötigt werden.
* Schlecht, weil weniger Kontrolle über spezifische Datenbankfeatures besteht.
