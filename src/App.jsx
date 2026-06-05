import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ Conexión con Supabase (usa variables de Vercel)
const supabase = createClient(
  "https://futknwugcqlezpyazfee.supabase.co",
  "sb_publishable_zgzyP0RtJujq7Y39WTyMKQ_YJEwlezl"
);


function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");

  // ✅ Cargar tareas al iniciar
  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    const { data, error } = await supabase
      .from("tareas")
      .select("*");

    if (error) {
      console.log("Error cargando tareas:", error);
      return;
    }

    setTareas(data || []);
  }

  // ✅ Añadir tarea
		async function agregarTarea() {
		  console.log("CLICK detectado");

		  if (!texto) {
			console.log("Texto vacío");
			return;
		  }

		  console.log("Enviando:", texto);

		  const { data, error } = await supabase
			.from("Tareas")   // 👈 MUY IMPORTANTE (con MAYÚSCULA como en la tabla)
			.insert([{ Texto: texto }]);  // 👈 mismo nombre de columna exacto

		  console.log("Resultado:", data, error);

		  if (error) {
			console.log("ERROR:", error);
			return;
		  }

		  setTexto("");
		  cargarTareas();
		}


  // ✅ Eliminar tarea
  async function eliminarTarea(id) {
    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error eliminando:", error);
      return;
    }

    cargarTareas();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestor de tareas</h1>

      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
      />

      <button onClick={agregarTarea}>Añadir</button>

      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
            {t.texto}
            <button onClick={() => eliminarTarea(t.id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;