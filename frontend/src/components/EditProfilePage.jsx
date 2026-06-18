import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Save, X, Plus, Calendar, Clock, Image as ImageIcon, Check, Trash, Star, User, Briefcase, GraduationCap, MapPin, DollarSign, CheckCircle, AlertCircle, BadgeIndianRupee, } from "lucide-react";
import { editProfilePageStyles, iconSize } from "../assets/dummyStyles";

const STORAGE_KEY = "doctorToken_v1";

function parse12HourTimeToMinutes(t) {
  if (!t) return 0;
  const [time, ampm] = t.split(" ");
  const [hh, mm] = time.split(":");
  let h = Number(hh) % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + Number(mm);
}

function formatTimeFromInput(time24) {
  if (!time24) return time24;
  const [h, m] = time24.split(":");
  let hr = Number(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = hr % 12 || 12;
  return `${String(hr).padStart(2, "0")}:${m} ${ampm}`;
}

function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule || {}).forEach(([date, slots]) => {
    const uniq = Array.from(new Set(slots || []));
    uniq.sort(
      (a, b) => parse12HourTimeToMinutes(a) - parse12HourTimeToMinutes(b),
    );
    out[date] = uniq;
  });
  return out;
}

export default function EditProfilePage({ apiBase }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE = "http://localhost:4000/api/doctors";

  const [doc, setDoc] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [localImageFile, setLocalImageFile] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = editProfilePageStyles;

  useEffect(() => {
    let cancelled = false;
    async function fetchDoctor() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Failed to fetch doctor");
        const d = json.data || json || {};
        d.schedule = dedupeAndSortSchedule(d.schedule || {});
        d.imageUrl =
          d.imageUrl || d.image || d.imageUrl === null ? d.imageUrl : d.image;
        if (!cancelled) {
          setDoc(d);
          setImagePreview(d.imageUrl || "");
        }
      } catch (err) {
        console.error("fetchDoctor error:", err);
        addToast("Unable to load profile", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchDoctor();
    return () => {
      cancelled = true;
      if (imagePreview && imagePreview.startsWith("blob:"))
        URL.revokeObjectURL(imagePreview);
    };
  }, [id]);

  const addToast = (text, type = "success") => {
    const idt = Date.now() + Math.random();
    const t = { id: idt, text, type };
    setToasts((prev) => [t, ...prev.slice(0, 2)]);
    setTimeout(
      () => setToasts((prev) => prev.filter((it) => it.id !== idt)),
      3000,
    );
  };

  const addDate = (dateStr) => {
    if (!dateStr) return;
    if (doc.schedule[dateStr]) {
      addToast("Date already exists", "error");
      return;
    }
    setDoc((d) => ({ ...d, schedule: { ...d.schedule, [dateStr]: [] } }));
    addToast("Date added successfully", "success");
  };

  const addSlot = (dateStr, time) => {
    if (!dateStr || !time) return;
    const formatted = formatTimeFromInput(time);
    setDoc((d) => {
      const existing = d.schedule[dateStr] || [];
      if (existing.includes(formatted)) {
        addToast(`${formatted} already exists for ${dateStr}`, "error");
        return d;
      }
      const nextArr = [...existing, formatted];
      nextArr.sort(
        (a, b) => parse12HourTimeToMinutes(a) - parse12HourTimeToMinutes(b),
      );
      return { ...d, schedule: { ...d.schedule, [dateStr]: nextArr } };
    });
    addToast(`Time slot ${formatted} added`, "success");
  };

  const removeSlot = (dateStr, slot) => {
    setDoc((d) => {
      const next = (d.schedule[dateStr] || []).filter((s) => s !== slot);
      return { ...d, schedule: { ...d.schedule, [dateStr]: next } };
    });
    addToast(`Removed ${slot} from ${dateStr}`, "info");
  };

  const removeDate = (dateStr) => {
    setDoc((d) => {
      const clone = { ...d.schedule };
      delete clone[dateStr];
      return { ...d, schedule: clone };
    });
    addToast(`Date ${dateStr} removed`, "info");
  };

  const handleImageChange = (e) => {
    if (!editing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview && imagePreview.startsWith("blob:"))
      URL.revokeObjectURL(imagePreview);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setLocalImageFile(file);
    setDoc((d) => ({ ...d, imageUrl: url }));
    addToast("Profile image updated locally", "success");
  };

  const toggleAvailability = () => {
    setDoc((d) => {
      const current = d.availability === "Available" || d.available === true;
      const nextVal = current ? "Unavailable" : "Available";
      return { ...d, availability: nextVal, available: !current };
    });
    addToast("Availability toggled", "info");
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to fetch");
      const d = json.data || json || {};
      d.schedule = dedupeAndSortSchedule(d.schedule || {});
      setDoc(d);
      setImagePreview(d.imageUrl || "");
      setLocalImageFile(null);
      setEditing(false);
      addToast("Reset to server profile", "info");
    } catch (err) {
      console.error("Reset error:", err);
      addToast("Reset failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!doc) return;
    setSaveMessage({ type: "saving", text: "Saving profile..." });
    addToast("Saving profile...", "info");

    try {
      const form = new FormData();
      const updatable = [
        "name",
        "specialization",
        "experience",
        "qualifications",
        "location",
        "about",
        "fee",
        "availability",
        "success",
        "patients",
        "rating",
        "email",
      ];
      updatable.forEach((k) => {
        if (doc[k] !== undefined && doc[k] !== null) {
          form.append(k, String(doc[k]));
        }
      });

      form.append("schedule", JSON.stringify(doc.schedule || {}));

      if (localImageFile) {
        form.append("image", localImageFile);
      } else if (doc.imageUrl && !doc.imageUrl.startsWith("blob:")) {
        form.append("imageUrl", doc.imageUrl);
      }

      const token = localStorage.getItem(STORAGE_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers,
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to save");
      }

      const updated = json.data || json;
      updated.schedule = dedupeAndSortSchedule(updated.schedule || {});
      setDoc(updated);
      setLocalImageFile(null);
      setImagePreview(updated.imageUrl || imagePreview);
      setEditing(false);
      setSaveMessage({ type: "success", text: "Profile saved successfully!" });
      addToast("Profile saved successfully!", "success");
      setTimeout(() => setSaveMessage(null), 1500);
    } catch (err) {
      console.error("handleSave error:", err);
      setSaveMessage({ type: "error", text: "Save failed" });
      addToast(err.message || "Save failed", "error");
    }
  };

  const fieldConfigs = doc
    ? [
        {
          icon: User,
          label: "Name",
          value: doc.name || "",
          onChange: (v) => setDoc((d) => ({ ...d, name: v })),
        },
        {
          icon: Briefcase,
          label: "Specialization",
          value: doc.specialization || "",
          onChange: (v) => setDoc((d) => ({ ...d, specialization: v })),
        },
        {
          icon: Clock,
          label: "Experience",
          value: doc.experience || "",
          onChange: (v) => setDoc((d) => ({ ...d, experience: v })),
        },
        {
          icon: GraduationCap,
          label: "Qualifications",
          value: doc.qualifications || "",
          onChange: (v) => setDoc((d) => ({ ...d, qualifications: v })),
        },
        {
          icon: MapPin,
          label: "Location",
          value: doc.location || "",
          onChange: (v) => setDoc((d) => ({ ...d, location: v })),
        },
        {
          icon: User,
          label: "Patients",
          value: doc.patients ?? "",
          onChange: (v) =>
            setDoc((d) => ({ ...d, patients: v === "" ? "" : Number(v) || 0 })),
        },
        {
          icon: CheckCircle,
          label: "Success",
          value: doc.success ?? "",
          onChange: (v) =>
            setDoc((d) => ({ ...d, success: v === "" ? "" : Number(v) || 0 })),
        },
        {
          icon: Star,
          label: "Rating (out of 5)",
          value: doc.rating ?? "",
          onChange: (v) =>
            setDoc((d) => ({
              ...d,
              rating: v === "" ? "" : parseFloat(v) || 0,
            })),
        },
        {
          icon: DollarSign,
          label: "Fee (INR)",
          value: doc.fee ?? "",
          onChange: (v) =>
            setDoc((d) => ({ ...d, fee: v === "" ? "" : Number(v) || 0 })),
        },
      ]
    : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.loadingSpinner} />
          <div className={styles.loadingText}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.errorText}>Doctor not found.</div>
      </div>
    );
  }

  const isAvailable = doc.availability === "Available" || doc.available;

  return (
  <div>
    Edit Profile
  </div>
  );
}

