import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ Conexión con Supabase (usa variables de Vercel)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
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
      .from("Tareas")
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
      .from("Tareas")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error eliminando:", error);
      return;
    }

    cargarTareas();
  }

	// ✅ completar tarea
	async function toggleCompletada(id, valorActual) {
	  const { error } = await supabase
		.from("Tareas")
		.update({ completada: !valorActual })
		.eq("id", id);

	  if (error) {
		console.log("Error actualizando:", error);
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
			<li key={t.id} style={{
			  textDecoration: t.completada ? "line-through" : "none"
			}}>
			  
			  <input
				type="checkbox"
				checked={t.completada || false}
				onChange={() => toggleCompletada(t.id, t.completada)}
			  />

			  {t.Texto}

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