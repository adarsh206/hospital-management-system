import Doctor from "../models/Doctor.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


// helper function to create a doctor
// this function will convert time 12hrs to number of minutes since midnight for easier sorting and comparison
// and return AM : PM
const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + (mm || 0);
};


// this function will remove duplicate slot and return the slot filter by time
function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    if (!Array.isArray(slots)) return;
    const uniq = Array.from(new Set(slots));
    uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    out[date] = uniq;
  });
  return out;
}


// this function accept the obj or JSON string
function parseScheduleInput(s) {
  if (!s) return {};
  if (typeof s === "string") {
    try {
      s = JSON.parse(s);
    } catch {
      return {};
    }
  }
  return dedupeAndSortSchedule(s || {});
}


// this function will convert doctor data into a plain text
function normalizeDocForClient(raw = {}) {
  const doc = { ...raw };

  // convert Mongoose Map to plain object
  if (doc.schedule && typeof doc.schedule.forEach === "function") {
    const obj = {};
    doc.schedule.forEach((val, key) => {
      obj[key] = Array.isArray(val) ? val : [];
    });
    doc.schedule = obj;
  } else if (!doc.schedule || typeof doc.schedule !== "object") {
    doc.schedule = {};
  }

  doc.availability = doc.availability === undefined ? "Available" : doc.availability;
  doc.patients = doc.patients ?? "";
  doc.rating = doc.rating ?? 0;
  doc.fee = doc.fee ?? doc.fees ?? 0;

  return doc;
}

// to create a Doctor
export async function createDoctor(req, res) {
  try {
    const body = req.body || {};
    if(!body.email || !body.password || !body.name){
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      })
    }

    const emailC = (body.email || "").toLowerCase();
    if(await Doctor.findOne({ email: emailC })){
      return res.status(409).json({
        success: false,
        message: "Email already in use."
      })
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublicId || null;
    if(req.file?.path){
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
      imagePublicId = uploaded?.public_id || uploaded?.publicId || imagePublicId;
    }

    const schedule = parseScheduleInput(body.schedule);
  } catch (error) {
    
  }
}