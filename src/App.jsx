import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");

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
        {tareas.map((t) => (
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