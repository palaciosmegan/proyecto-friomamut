import _imagenes from '../assets/imagenes_ambientes.json'

type ImagenAmbiente = { nombre: string; variante: string; imagen: string }
const imagenes = _imagenes as ImagenAmbiente[]

export type Ambiente = {
  id: number
  label: string
  image: string
}

export const AMBIENTES: Ambiente[] = [
  { id: 1, label: 'Túnel 1', image: imagenes[0].imagen },
  { id: 2, label: 'Túnel 2', image: imagenes[0].imagen },
  { id: 3, label: 'Túnel 3', image: imagenes[0].imagen },
  { id: 4, label: 'Túnel 4', image: imagenes[0].imagen },
]