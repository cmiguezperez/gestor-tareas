import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function App() {
  const [session, setSession] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) cargarTareas();
  }, [session]);

  async function cargarTareas() {
    const { data } = await supabase
      .from("Tareas")
      .select("*")
      .eq("user_id", session.user.id);

    setTareas(data || []);
  }

  async function agregarTarea() {
    if (!texto) return;

    await supabase.from("Tareas").insert([
      {
        Texto: texto,
        user_id: session.user.id,
      },
    ]);

    setTexto("");
    cargarTareas();
  }

  async function eliminarTarea(id) {
    await supabase.from("Tareas").delete().eq("id", id);
    cargarTareas();
  }

  // ✅ LOGIN UI
  if (!session) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Login</h2>
        <button
          onClick={() =>
            supabase.auth.signInWithOtp({
              email: prompt("Introduce tu email"),
            })
          }
        >
          Enviar login por email
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Gestor de tareas</h2>

      <button onClick={() => supabase.auth.signOut()}>
        Cerrar sesión
      </button>

      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nueva tarea"
      />

      <button onClick={agregarTarea}>+</button>

      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
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