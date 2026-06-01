import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { createTeamMember, deleteTeamMember, createTeamCategory, deleteTeamCategory } from "../actions";

export const revalidate = 0;

export default async function AdminTeam() {
  const categories = await prisma.teamCategory.findMany({ orderBy: { order: 'asc' } });
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    include: { category: true }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <h1>Manage Team & Categories</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Category Management */}
        <div style={{ background: 'var(--color-surface-light)', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(64, 224, 208, 0.15)' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Manage Categories (Keywords)
          </h3>
          
          <form action={createTeamCategory} method="POST" className={styles.form} style={{ marginTop: 0, padding: 0, background: 'transparent' }}>
            <div className={styles.formGroup}>
              <label htmlFor="catName">Category / Keyword Name</label>
              <input type="text" id="catName" name="name" required placeholder="e.g., Leadership, Researchers" />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="catOrder">Display Order (Lower values show first)</label>
              <input type="number" id="catOrder" name="order" defaultValue="0" placeholder="0" min="0" />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Add / Update Category
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Existing Categories</h4>
            {categories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: 'rgba(255,255,255,0.02)', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--color-primary)' }}>{cat.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '1rem' }}>
                        Order: {cat.order}
                      </span>
                    </div>
                    <form action={deleteTeamCategory.bind(null, cat.id)} method="POST">
                      <button 
                        type="submit" 
                        style={{ 
                          background: 'rgba(255, 68, 68, 0.1)', 
                          color: '#ff4444', 
                          border: '1px solid rgba(255, 68, 68, 0.2)', 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No categories added yet.</p>
            )}
          </div>
        </div>

        {/* Add Teammate Form */}
        <div style={{ background: 'var(--color-surface-light)', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(64, 224, 208, 0.15)' }}>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            Add New Teammate
          </h3>
          
          <form action={createTeamMember} method="POST" encType="multipart/form-data" className={styles.form} style={{ marginTop: 0, padding: 0, background: 'transparent' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required placeholder="e.g., Jane Doe" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="position">Position / Role</label>
                <input type="text" id="position" name="position" required placeholder="e.g., Principal Investigator" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Team Category</label>
                <select 
                  id="categoryId" 
                  name="categoryId" 
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(2, 11, 26, 0.9)',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="none">General / No Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="order">Teammate Sorting Order</label>
                <input type="number" id="order" name="order" defaultValue="0" min="0" placeholder="e.g., 1" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="e.g., jane@biotech.org" />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="linkedinUrl">LinkedIn URL</label>
                <input type="url" id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="researchGateUrl">ResearchGate URL</label>
                <input type="url" id="researchGateUrl" name="researchGateUrl" placeholder="https://researchgate.net/profile/..." />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="googleScholarUrl">Google Scholar URL</label>
                <input type="url" id="googleScholarUrl" name="googleScholarUrl" placeholder="https://scholar.google.com/citations?..." />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio">Biography / Description (Optional)</label>
              <textarea id="bio" name="bio" rows={2} placeholder="Provide a brief background..."></textarea>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image">Profile Image Upload</label>
              <input type="file" id="image" name="image" accept="image/*" style={{ border: 'none', background: 'transparent', padding: '0.25rem 0' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Add Teammate
            </button>
          </form>
        </div>

      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3>Current Teammates</h3>
        {team.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Position</th>
                <th>Order</th>
                <th>Socials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id}>
                  <td>
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{member.name}</td>
                  <td>
                    {member.category ? (
                      <span style={{ 
                        background: 'rgba(64, 224, 208, 0.1)', 
                        color: 'var(--color-primary)', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        border: '1px solid rgba(64, 224, 208, 0.2)'
                      }}>
                        {member.category.name}
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>General</span>
                    )}
                  </td>
                  <td>{member.position || member.role}</td>
                  <td style={{ fontWeight: 'bold' }}>{member.order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>LinkedIn</a>}
                      {member.researchGateUrl && <a href={member.researchGateUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>ResearchGate</a>}
                      {member.googleScholarUrl && <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>Scholar</a>}
                      {!member.linkedinUrl && !member.researchGateUrl && !member.googleScholarUrl && "-"}
                    </div>
                  </td>
                  <td>
                    <form action={deleteTeamMember.bind(null, member.id)} method="POST">
                      <button 
                        type="submit" 
                        style={{ 
                          background: 'rgba(255, 68, 68, 0.1)', 
                          color: '#ff4444', 
                          border: '1px solid rgba(255, 68, 68, 0.2)', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: 'var(--border-radius)', 
                          cursor: 'pointer' 
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>No teammates added yet.</p>
        )}
      </div>
    </div>
  );
}
