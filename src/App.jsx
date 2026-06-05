import { useState } from "react";

function App() {
  const [tareas, setTareas] = useState([]);
  const [texto, setTexto] = useState("");

  const agregarTarea = () => {
    if (!texto) return;

    setTareas([...tareas, texto]);
    setTexto("");
  };

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
		  {tareas.map((t, index) => (
			<li key={index}>
			  {t}
			  <button onClick={() => {
				const nuevas = tareas.filter((_, i) => i !== index);
				setTareas(nuevas);
			  }}>
				❌
			  </button>
			</li>
		  ))}
		</ul>
    </div>
  );
}

export default App;