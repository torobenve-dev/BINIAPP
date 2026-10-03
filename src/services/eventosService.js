import { supabase } from "../supabaseClient"

// =========================================================
// SERVICIO DE EVENTOS
//
// Todo el acceso a Supabase para eventos, materiales,
// personal, estado y post-evento vive acá. Los componentes
// no hablan con la base directamente: llaman a estas funciones.
//
// Convención: las funciones lanzan el error si algo falla
// (throw). Cada componente decide qué mensaje mostrar.
// =========================================================


// =========================================================
// MAPEOS: base de datos (snake_case) -> objetos de la app
// =========================================================

export function mapearMaterial(fila) {
  return {
    id: fila.id,
    eventoId: fila.evento_id,
    sector: fila.sector,
    nombre: fila.nombre,
    cantidad: fila.cantidad,
    guardado: fila.guardado,
    creadoEn: fila.created_at
  }
}


export function mapearPersona(fila) {
  return {
    id: fila.id,
    eventoId: fila.evento_id,
    nombre: fila.nombre,
    rol: fila.rol || "",
    creadoEn: fila.created_at
  }
}


function ordenarPorCreacion(lista) {
  return [...lista].sort((a, b) =>
    (a.creadoEn || "").localeCompare(b.creadoEn || "")
  )
}


// Convierte una fila de "eventos" en el objeto que usa la app.
// Si la fila trae materiales / personal embebidos (select con
// relaciones), también los convierte.
export function mapearEvento(fila) {
  const evento = {
    id: fila.id,

    nombre: fila.nombre,

    fechaInicio: fila.fecha_inicio,
    fechaFin: fila.fecha_fin,

    fechaArmado: fila.fecha_armado,
    horaArmado: fila.hora_armado,

    fechaDesarme: fila.fecha_desarme,
    horaDesarme: fila.hora_desarme,

    lugar: fila.lugar,
    contacto: fila.contacto,

    estado: fila.estado,

    problemasPostEvento: fila.problemas_post_evento || "",
    positivosPostEvento: fila.positivos_post_evento || "",

    ...fila.datos
  }

  if (Array.isArray(fila.materiales)) {
    evento.materiales = ordenarPorCreacion(
      fila.materiales.map(mapearMaterial)
    )
  }

  if (Array.isArray(fila.personal)) {
    evento.personal = ordenarPorCreacion(
      fila.personal.map(mapearPersona)
    )
  }

  return evento
}


// =========================================================
// EVENTOS
// =========================================================

// Trae todos los eventos con sus materiales y su personal.
// Lo usan el Dashboard, el calendario y el listado.
export async function cargarEventos() {
  const { data, error } = await supabase
    .from("eventos")
    .select("*, materiales(*), personal(*)")
    .order("fecha_inicio", { ascending: true })

  if (error) {
    throw error
  }

  return data.map(mapearEvento)
}


export async function actualizarEstadoEvento(eventoId, estado) {
  const { error } = await supabase
    .from("eventos")
    .update({ estado })
    .eq("id", eventoId)
    .select("id")
    .single()

  if (error) {
    throw error
  }
}


export async function guardarBalancePostEvento(
  eventoId,
  { problemas, positivos }
) {
  const { error } = await supabase
    .from("eventos")
    .update({
      problemas_post_evento: problemas,
      positivos_post_evento: positivos
    })
    .eq("id", eventoId)
    .select("id")
    .single()

  if (error) {
    throw error
  }
}


// =========================================================
// DETALLE DE UN EVENTO (materiales + personal)
// =========================================================

export async function cargarDetalleEvento(eventoId) {
  const [materiales, personal] = await Promise.all([
    supabase
      .from("materiales")
      .select("*")
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: true }),

    supabase
      .from("personal")
      .select("*")
      .eq("evento_id", eventoId)
      .order("created_at", { ascending: true })
  ])

  if (materiales.error) {
    throw materiales.error
  }

  if (personal.error) {
    throw personal.error
  }

  return {
    materiales: materiales.data.map(mapearMaterial),
    personal: personal.data.map(mapearPersona)
  }
}


// =========================================================
// MATERIALES
// =========================================================

export async function crearMaterial(
  eventoId,
  { nombre, cantidad, sector = null }
) {
  const { data, error } = await supabase
    .from("materiales")
    .insert({
      evento_id: eventoId,
      nombre,
      cantidad,
      sector
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapearMaterial(data)
}


// "campos" usa los nombres de las columnas:
// nombre, cantidad, guardado, sector
export async function modificarMaterial(id, campos) {
  const { data, error } = await supabase
    .from("materiales")
    .update(campos)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapearMaterial(data)
}


export async function borrarMaterial(id) {
  const { error } = await supabase
    .from("materiales")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
}


// =========================================================
// PERSONAL
// =========================================================

export async function crearPersona(eventoId, { nombre, rol }) {
  const { data, error } = await supabase
    .from("personal")
    .insert({
      evento_id: eventoId,
      nombre,
      rol: rol || null
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapearPersona(data)
}


export async function modificarPersona(id, { nombre, rol }) {
  const { data, error } = await supabase
    .from("personal")
    .update({
      nombre,
      rol: rol || null
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapearPersona(data)
}


export async function borrarPersona(id) {
  const { error } = await supabase
    .from("personal")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
}
