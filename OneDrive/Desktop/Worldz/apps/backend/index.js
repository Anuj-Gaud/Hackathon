const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  // Dummy logic: simulate login
  res.json({ message: 'Login successful', user: { id: 1, email: req.body.email } });
});

app.post('/api/auth/signup', async (req, res) => {
  // Dummy logic: simulate signup
  res.json({ message: 'Signup successful', user: { id: 1, email: req.body.email } });
});

// Jobs Routes
app.get('/api/jobs', async (req, res) => {
  // Dummy logic: return list of jobs
  res.json([
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'San Francisco' },
    { id: 2, title: 'Product Manager', company: 'Startup Inc', location: 'New York' },
  ]);
});

app.post('/api/jobs', async (req, res) => {
  // Dummy logic: simulate job posting
  res.json({ message: 'Job posted successfully', job: req.body });
});

// Internships Routes
app.get('/api/internships', async (req, res) => {
  // Dummy logic: return list of internships
  res.json([
    { id: 1, title: 'Summer Intern', company: 'Tech Corp', location: 'San Francisco' },
    { id: 2, title: 'Marketing Intern', company: 'Startup Inc', location: 'New York' },
  ]);
});

app.post('/api/internships', async (req, res) => {
  // Dummy logic: simulate internship posting
  res.json({ message: 'Internship posted successfully', internship: req.body });
});

// Applications Routes
app.post('/api/applications', async (req, res) => {
  // Dummy logic: simulate application submission
  res.json({ message: 'Application submitted successfully', application: req.body });
});

// Analytics Routes
app.get('/api/analytics', async (req, res) => {
  // Dummy logic: return analytics data
  res.json({
    applications: 156,
    activeJobs: 12,
    activeInternships: 8,
    views: 1234,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 