import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("todas")

  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    const { data } = await supabase.from("Tareas").select("*");
    setTareas(data || []);
  }

  async function agregarTarea() {
    if (!texto) return;

    await supabase.from("Tareas").insert([{ Texto: texto }]);
    setTexto("");
    cargarTareas();
  }

  async function eliminarTarea(id) {
    await supabase.from("Tareas").delete().eq("id", id);
    cargarTareas();
  }

  async function toggleCompletada(id, valorActual) {
    await supabase
      .from("Tareas")
      .update({ completada: !valorActual })
      .eq("id", id);

    cargarTareas();
  }

	const tareasFiltradas = tareas.filter((t) => {
	  if (filtro === "pendientes") return !t.completada;
	  if (filtro === "completadas") return t.completada;
	  return true; // todas
	});
	``

  return (
    <div style={{
      maxWidth: "400px",
      margin: "50px auto",
      fontFamily: "sans-serif"
    }}>
      
      <h2 style={{ textAlign: "center" }}>✅ Gestor de tareas</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nueva tarea"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={agregarTarea}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer"
          }}
        >
          +
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {tareasFiltradas.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={t.completada || false}
                onChange={() => toggleCompletada(t.id, t.completada)}
              />

			<div style={{
			  display: "flex",
			  justifyContent: "center",
			  gap: "10px",
			  marginTop: "15px"
			}}>
			  <button
				onClick={() => setFiltro("todas")}
				style={{ background: filtro === "todas" ? "#4CAF50" : "#ddd" }}
			  >
				Todas
			  </button>

			  <button
				onClick={() => setFiltro("pendientes")}
				style={{ background: filtro === "pendientes" ? "#4CAF50" : "#ddd" }}
			  >
				Pendientes
			  </button>

			  <button
				onClick={() => setFiltro("completadas")}
				style={{ background: filtro === "completadas" ? "#4CAF50" : "#ddd" }}
			  >
				Completadas
			  </button>
			</div>

              <span style={{
                marginLeft: "10px",
                textDecoration: t.completada ? "line-through" : "none"
              }}>
                {t.Texto}
              </span>
            </div>

            <button
              onClick={() => eliminarTarea(t.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;