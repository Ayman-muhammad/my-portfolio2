import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Initialize Supabase Admin (Service Role) lazily
let supabaseAdminInstance: any = null;

function getSupabaseAdmin() {
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Supabase Admin credentials missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    return null;
  }

  supabaseAdminInstance = createClient(url, key);
  return supabaseAdminInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const session = await getIronSession(req, res, sessionOptions);

    // Simple check against env or database
    // In a real app, you'd check the 'admins' table
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (email === "ayman11muhammad@gmail.com" && password === adminPassword) {
      (session as any).isLoggedIn = true;
      (session as any).email = email;
      await session.save();
      return res.json({ success: true });
    }

    res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/admin/logout", async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    session.destroy();
    res.json({ success: true });
  });

  app.get("/api/admin/check", async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    if ((session as any).isLoggedIn) {
      return res.json({ isLoggedIn: true, email: (session as any).email });
    }
    res.status(401).json({ isLoggedIn: false });
  });

  // Increment views API
  app.post("/api/projects/:slug/views", async (req, res) => {
    const { slug } = req.params;
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(500).json({ error: "Supabase Admin not configured" });
    }
    const { data, error } = await admin.rpc('increment_project_views', { project_slug: slug });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Batch update project order API
  app.post("/api/admin/projects/reorder", async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    if (!(session as any).isLoggedIn) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { orders } = req.body; // Array of { id, order_index }
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(500).json({ error: "Supabase Admin not configured" });
    }

    // Using a simple loop for now, in a real app you'd use a single RPC call or transaction
    const updates = orders.map((item: { id: string; order_index: number }) =>
      admin.from("projects").update({ order_index: item.order_index }).eq("id", item.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error).map((r) => r.error);

    if (errors.length > 0) {
      return res.status(500).json({ error: "Some updates failed", details: errors });
    }

    res.json({ success: true });
  });

  // Update project details API
  app.put("/api/admin/projects/:id", async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    if (!(session as any).isLoggedIn) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const projectData = req.body;
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(500).json({ error: "Supabase Admin not configured" });
    }

    const { data, error } = await admin
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  });

  // Create new project API
  app.post("/api/admin/projects", async (req, res) => {
    const session = await getIronSession(req, res, sessionOptions);
    if (!(session as any).isLoggedIn) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projectData = req.body;
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(500).json({ error: "Supabase Admin not configured" });
    }

    // Get the highest order_index to append the new project
    const { data: lastProject } = await admin
      .from("projects")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = lastProject ? lastProject.order_index + 1 : 0;

    const { data, error } = await admin
      .from("projects")
      .insert([{ ...projectData, order_index: nextOrderIndex }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, data });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
