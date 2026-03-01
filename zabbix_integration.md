# Monitorowanie QRytics (Zabbix & Grafana)

System QRytics w nowej aktualizacji API (V2) został zaprojektowany z myślą o prostym wpięciu w standardowe maszyny monitorujące (NOC). Najszybszym sposobem na wizualizacje użycia kodów czy wolumenu ruchu jest bezpośrednie odpytanie naszego serwera FastAPI.

## Pobieranie danych (HTTP Agent)

Nasz główny punkt styku to darmowy endpoint analityczny. Dla wybranego `ID` kampanii QR (które widać w panelu jako `LIVE ID: {uuid}`) wywołujemy zapytanie:

```http
GET http://192.168.50.145:8000/api/analytics/{TWOJE_ID_KAMPANII}?timeframe=all
```

**Zwrócony format (JSON):**
```json
{
  "qr_code": {
    "id": "e2d8ab94-...",
    "campaign_name": "Summer Promo",
    "target_url": "https://...",
    "created_at": "2024-..."
  },
  "total_scans": 1502,
  "scans_over_time": [],
  "os_stats": [],
  "browser_stats": [],
  "device_stats": []
}
```

---

## Integracja w systemie Zabbix

Jeśli Twoim głównym nadzorcą jest system **Zabbix**, najprostszą formą zrzutu będzie "Item" wyciągający tylko liczbę kliknięć w głównym panelu powiadomień.

1. W stacji Zabbix przejdź do Host -> **Items** -> Create Item.
2. Zdefiniuj obiekt typu: **HTTP Agent**.
3. **URL:** `http://192.168.50.145:8000/api/analytics/{TWOJE_ID_KAMPANII}?timeframe=today`
4. **Type of information:** `Numeric (unsigned)`
5. Przejdź do zakładki **Preprocessing** na samej górze.
6. Dodaj krok: **JSONPath**
7. Jako parametr wpisz dokładnie ścieżkę do liczby: `$.total_scans`

*Zabbix będzie teraz pyścił co np. 30s zapytanie po HTTP do kontenera w LXC i wyciągał z gigantycznego JSONa tylko jedną interesującą go liczbę (ilość skanów z danego dnia), po czym namaluje na ten temat sam z siebie wykres!*

---

## Integracja w panelu Grafana + JSON API

Grafana sprawdza się cudownie w czytaniu surowych list. Jeżeli Twój lokalny serwer Grafany jest gotowy to:

1. Przejdź do zakładki "Connections" / "Data Sources" w Grafanie.
2. Zainstaluj i aktywuj Plugin o nazwie **"JSON API"** (od Marcus Olsson).
3. Dodaj to Data Source'a i ustaw Endpoint główny w Grafanie jako `http://192.168.50.145:8000`.
4. Stwórz nowy Dashboard. Przy tworzeniu pierwszego Wykresu Liniowego czy Kołowego jako źródło wskaż "JSON API".
5. W zakładce "Path" podaj: `/api/analytics/{TWOJE_ID}/logs` 
6. Skonfiguruj `Fields` mówiąc Grafanie by zaczytywała `.ip_address`, `.browser` oraz `.scanned_at`. (By traktowała to ostanie jako ścieżkę czasu `Time`).

Od teraz jesteś w stanie stworzyć swój własny NOC z podłączonymi na żywo wykresami Grafany z pominięciem interfejsu mojego skryptu.
