@PedroArt

Dejé los cambios listos para recibir la data de Vanguard Ica.

## Nueva prop `nivel` en los sensores

- Se añadió `nivel` al tipo de sensor. Es el único atributo nuevo que hay que mandar.
- Valores posibles: `1` (piso uno) o `2` (piso dos).
- Los sensores que lleguen sin `nivel` no dan problema: se normalizan a `1` automáticamente (`nivel: sensor.nivel ?? 1` en `src/api/api.sensores.ts`).
```ts
export type Sensor = {
  sensorId?: number
  id: string
  codigoLectura: string
  registroAmbiente: number
  registroAmbienteLectura?: number
  registroAmbienteEstructura?: number
  registroSensor?: number
  environmentAbbreviation: string
  orientation: Orientation
  posicion: number
  habilitado: boolean
  valor: number | null
  active: boolean
  unidad: "°C"
  nivel?: number // NUEVA PROP
}
```


## Cómo verlo

- `yarn dev`: muestra el túnel mock (con niveles 1 y 2) junto con la data de Node-RED.
- `yarn build` + `yarn preview`: muestra exclusivamente la data de Node-RED, sin mock.
