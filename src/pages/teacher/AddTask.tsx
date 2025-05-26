import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "homework",
    deadline: "",
    date: "",
    groupId: "",
    file: null,
  });
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("groups")
        .select("id, name")
        .eq("created_by", userId);
      if (!error && data) setGroups(data);
    };
    fetchGroups();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploading(true);
    const { data, error } = await supabase.storage
      .from("tasks")
      .upload(`${userId}/${Date.now()}_${file.name}`, file);
    setFileUploading(false);
    if (error) {
      alert("Fayl yuklashda xatolik: " + error.message);
      return;
    }
    setForm((prev) => ({ ...prev, file: data.path }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.groupId || !form.type) {
      alert("Barcha maydonlarni to‘ldiring");
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      group_id: form.groupId,
      file_url: form.file,
      created_by: userId,
      deadline: form.type === "homework" ? form.deadline : null,
      date: form.type === "internship" ? form.date : null,
    };
    const { error } = await supabase.from("tasks").insert([payload]);
    if (error) {
      alert("Topshiriq qo‘shishda xatolik: " + error.message);
    } else {
      alert("Topshiriq muvaffaqiyatli qo‘shildi!");
      navigate("/teacher-dashboard/tasks");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="bg-white dark:bg-muted/60 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Yangi topshiriq qo‘shish
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Nomi</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tavsifi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Guruh</label>
            <select
              name="groupId"
              value={form.groupId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Turi</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition"
            >
              <option value="homework">Uyga vazifa</option>
              <option value="internship">Amaliyot</option>
            </select>
          </div>
          {form.type === "homework" ? (
            <div>
              <label className="block mb-1 font-medium">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition"
              />
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-medium">Amaliyot sanasi</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-background text-foreground transition"
              />
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Fayl</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {fileUploading && (
              <span className="text-blue-500 ml-2">Yuklanmoqda...</span>
            )}
            {form.file && (
              <span className="text-xs text-muted-foreground ml-2">
                {form.file}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition"
            disabled={fileUploading}
          >
            Saqlash
          </button>
        </form>
      </div>
    </div>
  );
}
