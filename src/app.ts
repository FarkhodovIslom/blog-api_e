import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import blogRoutes from './routes/blog.routes';
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});


// Centralized error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
