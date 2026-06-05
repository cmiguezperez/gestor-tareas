import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    const { data } = await supabase.from("Tareas").select("*");
    setTareas(data || []);
  }

  async function agregarTarea() {
    if (!texto) return;

    await supabase.from("Tareas").insert([
      {
        Texto: texto,
        completada: false,
      },
    ]);

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
    return true;
  });

  return (
    <div style={{
      background: "#F5F5F5",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <div style={{
        maxWidth: "420px",
        margin: "auto",
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{
          textAlign: "center",
          color: "#0B5563"
        }}>
          SOUTH Tasks
        </h2>

        {/* INPUT */}
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
              backgroundColor: "#2CB5A5",
              color: "white",
              cursor: "pointer"
            }}
          >
            +
          </button>
        </div>

        {/* FILTROS */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "15px"
        }}>
          {["todas", "pendientes", "completadas"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background:
                  filtro === f ? "#0B5563" : "#ddd",
                color:
                  filtro === f ? "white" : "black"
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* LISTA */}
        <ul style={{
          listStyle: "none",
          padding: 0,
          marginTop: "20px"
        }}>
          {tareasFiltradas.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f9f9f9",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                borderLeft: "5px solid #2CB5A5"
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={t.completada || false}
                  onChange={() =>
                    toggleCompletada(t.id, t.completada)
                  }
                />
                <span style={{
                  marginLeft: "10px",
                  textDecoration: t.completada
                    ? "line-through"
                    : "none"
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
                  color: "#0B5563",
                  fontSize: "18px"
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;
``