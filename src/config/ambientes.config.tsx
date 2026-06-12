import _imagenes from '../assets/imagenes_ambientes.json'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

export type Ambiente = {
  id: number
  label: string
  image?: string
}

// Se usa unicamente cuando el servidor no esta disponible.
export const AMBIENTES: Ambiente[] = [
  { id: 1, label: 'TUNEL PT 01', image: imagenes[0].imagen },
  { id: 2, label: 'TUNEL PT 02', image: imagenes[0].imagen },
  { id: 3, label: 'TUNEL PT 03', image: imagenes[0].imagen },
  { id: 4, label: 'TUNEL PT 04', image: imagenes[0].imagen },
]
