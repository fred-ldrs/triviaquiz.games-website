# Moderation – community_questions

## Status-Workflow

Jede eingereichte Frage hat ein `status`-Feld (Firestore-Typ: `string`).  
Nutzer können nur `pending` setzen. Alle anderen Werte werden manuell im Firebase Console gesetzt.

| Status | Bedeutung | Sichtbar auf Community-Page |
|---|---|---|
| `pending` | Eingereicht, wartet auf Review | nein |
| `approved` | Akzeptiert, wartet auf Quiz-Einbau | **ja** |
| `implemented` | Live in der Quiz-App | **ja** |
| `declined` | Abgelehnt | nein |
| `duplicate` | Gute Frage, existiert aber schon | nein |
| `needs_edit` | Idee gut, Formulierung überarbeiten | nein |

## Status ändern (Firebase Console)

1. [Firebase Console → Firestore](https://console.firebase.google.com/project/triviaquiz-website/firestore) öffnen
2. Collection `community_questions` → Dokument auswählen
3. Feld `status` anklicken → Wert ändern → Speichern

> Hinweis: Firestore kennt keinen Enum-Typ. Der String wird clientseitig durch `<select>`-Dropdowns und serverseitig durch Security Rules (`.rules`-Datei, `in [...]`) validiert.

## Security Rules (Kurzfassung)

- `allow create`: nur wenn `status == 'pending'` (Nutzer können sich nicht selbst genehmigen)
- `allow read`: nur wenn `status in ['approved', 'implemented']`
- `allow update/delete`: nicht erlaubt (nur über Firebase Console / Admin SDK)
