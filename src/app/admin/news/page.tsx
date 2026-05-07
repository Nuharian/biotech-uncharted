import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { createNews } from "../actions";

export const revalidate = 0;

export default async function AdminNews() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div>
      <h1>Manage News</h1>
      
      <form action={createNews} className={styles.form}>
        <h3>Add New Article</h3>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea id="summary" name="summary" required rows={3}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" required rows={5}></textarea>
        </div>
        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <input type="checkbox" id="isHighlighted" name="isHighlighted" />
          <label htmlFor="isHighlighted" style={{ fontWeight: 'normal' }}>Highlight on Home Page</label>
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save News</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Highlighted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map(n => (
             <tr key={n.id}>
               <td>{n.title}</td>
               <td>{new Date(n.publishedAt).toLocaleDateString()}</td>
               <td>{n.isHighlighted ? "Yes" : "No"}</td>
               <td>-</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
