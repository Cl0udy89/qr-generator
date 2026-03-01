# Integrating QRytics with Zabbix

This guide explains how to connect the new QRytics backend to your Zabbix monitoring infrastructure. With the addition of the raw access logs endpoint, Zabbix can pull complete analytics data and alert you on traffic spikes, unique IPs, or location data.

## 1. Setup Zabbix HTTP Agent Item

You can use Zabbix's built-in **HTTP agent** to periodically poll the analytics API.

1. Navigate to your Zabbix host configuration -> **Items** -> **Create item**
2. **Name:** QR Campaign Analytics ({your_campaign_name})
3. **Type:** HTTP agent
4. **Key:** `qr.campaign.analytics`
5. **URL:** `http://<your_backend_ip>:8000/api/analytics/<your_qr_id>` 
   *For raw logs:* `http://<your_backend_ip>:8000/api/analytics/<your_qr_id>/logs`
6. **Request type:** GET
7. **Type of information:** Text

## 2. Using Zabbix Dependent Items (JSONPath)

Once you have the master HTTP agent pulling the full JSON array, create **Dependent items** to parse specific metrics using Zabbix Preprocessing.

### Total Scans
- **Type:** Dependent item
- **Master item:** QR Campaign Analytics
- **Type of information:** Numeric (unsigned)
- **Preprocessing steps:**
  - Name: `JSONPath`, Parameter: `$.total_scans`

### Extracting Log Information
For the `/logs` endpoint, the API returns an array. You can count the latest entries or track unique IPs:
- **Preprocessing steps for counting array length:**
  - Name: `JSONPath`, Parameter: `$.length()`

## 3. Creating Triggers (Alerts)

With the total scans populated, create a trigger to notify your team when a campaign achieves a milestone or receives unusual traffic.

- **Name:** High Traffic on QR Campaign
- **Expression:** `last(/Your_Host/qr.campaign.analytics_total)>1000`
- **Severity:** Warning

## 4. API Endpoints Reference

- `GET /api/analytics/{id}?timeframe=all|year|month|week|today` - Returns aggregated campaign statistics.
- `GET /api/analytics/{id}/logs` - Returns raw scan data (JSON Array) including IP, OS, Browser, and Location.
