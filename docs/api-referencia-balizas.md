# API Referencia – Balizas MP

Base URL: `http://<ip-nodered>:1880/api`

## Beacons

### Consultar todos los túneles

```bash
curl -X GET http://localhost:1880/api/beacons
```

Respuesta:

```json
[
  {
    "id": 1,
    "label": "TUNEL MP 01",
    "processActive": true,
    "status": "verde",
    "blinking": false,
    "alarma": false,
    "flags": { "cambioFlujo": false, "estadoPrevio": false, "reanudado": false },
    "setpoints": {
      "cambio_flujo": {
        "externo": { "min": -20.0, "max": -15.0 },
        "interno": { "min": -20.0, "max": -15.0 }
      },
      "fin_proceso": {
        "externo": { "min": -18.0, "max": -14.0 },
        "interno": { "min": -18.0, "max": -14.0 }
      },
      "pulpa": -10.0
    }
  }
]
```

Cómo interpretar la respuesta:

| Campo | Valores | Nota |
| --- | --- | --- |
| `processActive` | `true` / `false` | Viene del PLC S7. Misma fuente en todos los endpoints de beacons |
| `status` | `verde` / `ambar` / `rojo` / `null` | `null` = baliza apagada |
| `blinking` | `true` / `false` | Hay parpadeo, de cualquier color |
| `alarma` | `true` / `false` | Alarma de pulpa activa |

Para saber qué color parpadea, combinar los dos últimos:

| blinking | alarma | status | Significado |
| --- | --- | --- | --- |
| false | false | cualquiera | Color fijo, sin alarma |
| true | false | verde | Verde parpadeante — cambio de flujo alcanzado |
| true | true | ≠ rojo | Rojo parpadeante superpuesto al color base |
| true | true | rojo | Alarma activa, pero el rojo ya es fijo por fin de proceso — sin parpadeo físico |

`blinking: false` con `alarma: true` no puede ocurrir: alarma implica blinking.

### Lógica de balizas

```
verde: el proceso está en curso, acaba de empezar
ámbar: reanudado
rojo: proceso terminado

--------- parpadeando ---------
verde parpadeante: alarma de cambio de flujo
rojo parpadeante: alarma de pulpa
```

### Consultar un túnel específico

```bash
curl -X GET http://localhost:1880/api/beacons/1
```

### Forzar color de una baliza

Solo funciona cuando el proceso está apagado (`processActive=false`).

```bash
# Forzar verde
curl -X POST http://localhost:1880/api/beacons \
  -H "Content-Type: application/json" \
  -d '{ "id": 1, "status": "verde" }'

# Forzar ambar (naranja)
curl -X POST http://localhost:1880/api/beacons \
  -H "Content-Type: application/json" \
  -d '{ "id": 2, "status": "ambar" }'

# Forzar rojo
curl -X POST http://localhost:1880/api/beacons \
  -H "Content-Type: application/json" \
  -d '{ "id": 3, "status": "rojo" }'

# Liberar forzado (vuelve a modo automático)
curl -X POST http://localhost:1880/api/beacons \
  -H "Content-Type: application/json" \
  -d '{ "id": 1, "status": null }'
```

### Actualizar setpoints desde el endpoint de beacons

```bash
curl -X POST http://localhost:1880/api/beacons \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "setpoints": {
      "cambio_flujo": {
        "externo": { "min": -22.0, "max": -18.0 },
        "interno": { "min": -22.0, "max": -18.0 }
      },
      "fin_proceso": {
        "interno": { "min": -19.0, "max": -15.0 }
      },
      "pulpa": -8.0
    }
  }'
```

### Simular encendido/apagado del PLC (solo pruebas)

```bash
# Simular encendido
curl -X POST http://localhost:1880/api/beacons/1/simular-proceso \
  -H "Content-Type: application/json" \
  -d '{ "processActive": true }'

# Simular apagado
curl -X POST http://localhost:1880/api/beacons/1/simular-proceso \
  -H "Content-Type: application/json" \
  -d '{ "processActive": false }'
```

## Setpoints

### Consultar todos los túneles

```bash
curl -X GET http://localhost:1880/api/setpoints
```

### Consultar un túnel

```bash
curl -X GET http://localhost:1880/api/setpoints/1
```

### Actualizar setpoints de un túnel

Solo los campos enviados se modifican. Los demás conservan su valor actual.

```bash
# Configurar rangos de cambio de flujo
curl -X POST http://localhost:1880/api/setpoints/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cambio_flujo": {
      "externo": { "min": -22.0, "max": -18.0 },
      "interno": { "min": -22.0, "max": -18.0 }
    }
  }'

# Configurar rangos de fin de proceso
curl -X POST http://localhost:1880/api/setpoints/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fin_proceso": {
      "externo": { "min": -20.0, "max": -16.0 },
      "interno": { "min": -20.0, "max": -16.0 }
    }
  }'

# Configurar solo el grupo interno de fin de proceso
curl -X POST http://localhost:1880/api/setpoints/2 \
  -H "Content-Type: application/json" \
  -d '{
    "fin_proceso": {
      "interno": { "min": -19.0, "max": -15.0 }
    }
  }'

# Configurar umbral de alarma de pulpa
curl -X POST http://localhost:1880/api/setpoints/3 \
  -H "Content-Type: application/json" \
  -d '{ "pulpa": -8.0 }'

# Desactivar alarma de pulpa
curl -X POST http://localhost:1880/api/setpoints/3 \
  -H "Content-Type: application/json" \
  -d '{ "pulpa": 0 }'

# Configurar todo en una sola llamada
curl -X POST http://localhost:1880/api/setpoints/4 \
  -H "Content-Type: application/json" \
  -d '{
    "cambio_flujo": {
      "externo": { "min": -22.0, "max": -18.0 },
      "interno": { "min": -22.0, "max": -18.0 }
    },
    "fin_proceso": {
      "externo": { "min": -20.0, "max": -16.0 },
      "interno": { "min": -20.0, "max": -16.0 }
    },
    "pulpa": -8.0
  }'
```

Respuesta:

```json
{
  "ok": true,
  "tunel": 1,
  "setpoints_actualizados": { "..." },
  "setpoints_completos": { "..." }
}
```

## Dead-band

### Consultar

```bash
curl -X GET http://localhost:1880/api/deadband
```

Respuesta:

```json
{ "dead_band": 0.2, "unidad": "°C" }
```

### Actualizar (rango: 0–5 °C)

```bash
curl -X POST http://localhost:1880/api/deadband \
  -H "Content-Type: application/json" \
  -d '{ "dead_band": 0.5 }'
```

## Umbral sensor malo

### Consultar

```bash
curl -X GET http://localhost:1880/api/umbral-sensor-malo
```

Respuesta:

```json
{ "umbral_sensor_malo": 100, "unidad": "°C" }
```

### Actualizar

```bash
curl -X POST http://localhost:1880/api/umbral-sensor-malo \
  -H "Content-Type: application/json" \
  -d '{ "umbral_sensor_malo": 150 }'
```

## Balizas (debug)

### Consultar estado raw

```bash
curl -X GET http://localhost:1880/api/balizas
curl -X GET http://localhost:1880/api/balizas/1
```

### Escribir coil directamente

```bash
# Encender verde del túnel 2
curl -X POST http://localhost:1880/api/balizas/verde/2 \
  -H "Content-Type: application/json" \
  -d '{ "verde": true }'

# Apagar verde del túnel 2
curl -X POST http://localhost:1880/api/balizas/verde/2 \
  -H "Content-Type: application/json" \
  -d '{ "verde": false }'
```

El próximo ciclo de evaluación (10 s) puede pisar el valor. Para forzados persistentes usar `POST /api/beacons`.

## Códigos de respuesta

| Código | Significado |
| --- | --- |
| 200 | OK |
| 400 | Body inválido o parámetro faltante |
| 404 | Túnel o id no válido |
| 409 | No se puede forzar color con proceso activo |
