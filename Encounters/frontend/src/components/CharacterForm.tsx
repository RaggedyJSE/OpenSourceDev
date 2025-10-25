import { useState } from "react";
import { createCharacter } from "../lib/api";

export default function CharacterForm({ onCreated }) {
  const [form, setForm] = useState({
    name: "",
    class_name: "",
    race: "",
    level: 1,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    const data = await createCharacter({ ...form, user_id: userId });
    onCreated(data);
    setForm({ name: "", class_name: "", race: "", level: 1, description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 bg-slate-800 rounded-xl">
      <h3 className="text-lg font-bold">Add Character</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Class" value={form.class_name} onChange={e => setForm({...form, class_name: e.target.value})} />
      <input placeholder="Race" value={form.race} onChange={e => setForm({...form, race: e.target.value})} />
      <input type="number" placeholder="Level" value={form.level} onChange={e => setForm({...form, level: +e.target.value})} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
      <button className="bg-indigo-600 text-white px-3 py-1 rounded-md">Add</button>
    </form>
  );
}
