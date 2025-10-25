import { useState } from "react";

export default function Builder() {
  const [form, setForm] = useState({
    environment: "forest",
    tone: "mysterious",
    difficulty: "medium",
    focus: ["combat"],
    encounter_count: 1,
    narrative: true,
    story_seed: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleChange = (
  e: React.ChangeEvent<
    HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
  >
) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const { name, value, type } = target;

  // Handle checkbox separately
  if (type === "checkbox") {
    setForm(prev => ({
      ...prev,
      [name]: (target as HTMLInputElement).checked, // <-- safe cast here
    }));
  } else {
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleFocusChange = (focusType: string) => {
    setForm(prev => ({
      ...prev,
      focus: prev.focus.includes(focusType)
        ? prev.focus.filter(f => f !== focusType)
        : [...prev.focus, focusType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/encounters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 text-white rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-4">Encounter Builder</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Environment */}
        <div>
          <label className="block mb-1 font-semibold">Environment</label>
          <select
            name="environment"
            value={form.environment}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          >
            <option value="forest">Forest</option>
            <option value="dungeon">Dungeon</option>
            <option value="city">City</option>
            <option value="mountain">Mountain</option>
            <option value="desert">Desert</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block mb-1 font-semibold">Tone</label>
          <select
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          >
            <option value="mysterious">Mysterious</option>
            <option value="dark">Dark</option>
            <option value="lighthearted">Lighthearted</option>
            <option value="epic">Epic</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block mb-1 font-semibold">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="deadly">Deadly</option>
          </select>
        </div>

        {/* Focus */}
        <div>
          <label className="block mb-1 font-semibold">Focus</label>
          <div className="flex gap-4">
            {["combat", "puzzle", "role-play"].map(type => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={form.focus.includes(type)}
                  onChange={() => handleFocusChange(type)}
                />{" "}
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Encounter Count */}
        <div>
          <label className="block mb-1 font-semibold">Encounter Count</label>
          <input
            type="number"
            name="encounter_count"
            min={1}
            max={5}
            value={form.encounter_count}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          />
        </div>

        {/* Narrative */}
        <div>
          <label className="block mb-1 font-semibold">Include Narrative</label>
          <input
            type="checkbox"
            name="narrative"
            checked={form.narrative}
            onChange={handleChange}
          />
        </div>

        {/* Story Seed */}
        <div>
          <label className="block mb-1 font-semibold">Story Seed (optional)</label>
          <textarea
            name="story_seed"
            placeholder="e.g. The heroes stumble upon an abandoned campfire..."
            value={form.story_seed}
            onChange={handleChange}
            className="w-full p-2 rounded text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 w-full"
        >
          {loading ? "Generating..." : "Generate Encounter"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3">{error}</p>}

      {result && (
        <div className="mt-6 bg-slate-700 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Generated Encounter</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
