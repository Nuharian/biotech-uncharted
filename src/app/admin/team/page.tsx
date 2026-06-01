import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { 
  createTeamMember, 
  deleteTeamMember, 
  createTeamCategory, 
  deleteTeamCategory,
  updateTeamMemberOrderAndCategory,
  updateTeamCategoryNameAndOrder
} from "../actions";

export const revalidate = 0;

export default async function AdminTeam() {
  const categories = await prisma.teamCategory.findMany({ orderBy: { order: 'asc' } });
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
    include: { category: true }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Manage Team & Categories</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
        Configure keywords (categories), drag sliders to adjust orders, and save updates dynamically.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        
        {/* Category Management */}
        <div style={{ background: 'var(--color-surface-light)', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(64, 224, 208, 0.15)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ color: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
            Manage Categories (Keywords)
          </h3>
          
          {/* Create Category Form */}
          <form action={createTeamCategory} method="POST" className={styles.form} style={{ marginTop: 0, padding: 0, background: 'transparent' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="catName" style={{ fontSize: '0.85rem' }}>Category Name</label>
                <input type="text" id="catName" name="name" required placeholder="e.g., Leadership" />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="catOrder" style={{ fontSize: '0.85rem' }}>Sort Order</label>
                <input type="number" id="catOrder" name="order" defaultValue="0" placeholder="0" min="0" />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
              + Add New Category
            </button>
          </form>

          {/* Edit / List Categories */}
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Edit Existing Categories</h4>
            {categories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categories.map(cat => (
                  <form 
                    key={cat.id} 
                    action={updateTeamCategoryNameAndOrder} 
                    method="POST"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '0.75rem',
                      background: 'rgba(255,255,255,0.02)', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <input type="hidden" name="id" value={cat.id} />
                    
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={cat.name} 
                        required 
                        style={{ 
                          flex: 2,
                          padding: '0.4rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'rgba(2, 11, 26, 0.8)',
                          color: 'white',
                          fontSize: '0.9rem'
                        }} 
                      />
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 3 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Slide Order:</span>
                        <input 
                          type="range" 
                          name="order" 
                          min="0" 
                          max="50" 
                          defaultValue={cat.order} 
                          style={{ 
                            flex: 1, 
                            accentColor: 'var(--color-primary)', 
                            height: '6px', 
                            cursor: 'pointer' 
                          }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)', minWidth: '15px', textAlign: 'center' }}>
                          {cat.order}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        type="submit" 
                        style={{ 
                          background: 'rgba(64, 224, 208, 0.1)', 
                          color: 'var(--color-primary)', 
                          border: '1px solid rgba(64, 224, 208, 0.3)', 
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        Save
                      </button>

                      <button 
                        formAction={deleteTeamCategory.bind(null, cat.id)}
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
                    </div>
                  </form>
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

      {/* Teammates List & Live Drag-Order Editors */}
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Current Teammates (Adjust Category & Order directly)</h3>
        {team.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name / Position</th>
                <th>Category Assignment</th>
                <th>Sorting Order (Slide to Reorder)</th>
                <th>Socials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id}>
                  
                  {/* Image Column */}
                  <td>
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary)' }} 
                      />
                    ) : (
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>

                  {/* Name & Position Column */}
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{member.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{member.position || member.role}</div>
                  </td>

                  {/* Inline Re-Categorization & Re-Ordering Column */}
                  <td colSpan={2}>
                    <form 
                      action={updateTeamMemberOrderAndCategory} 
                      method="POST" 
                      style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 0.5fr', gap: '1rem', alignItems: 'center', margin: 0 }}
                    >
                      <input type="hidden" name="id" value={member.id} />
                      
                      {/* Dynamic Category Selector */}
                      <select 
                        name="categoryId" 
                        defaultValue={member.categoryId || "none"}
                        style={{
                          padding: '0.4rem 0.6rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(2, 11, 26, 0.8)',
                          color: 'white',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      >
                        <option value="none">General / Uncategorized</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>

                      {/* Slider Input for Order */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Priority:</span>
                        <input 
                          type="range" 
                          name="order" 
                          min="0" 
                          max="50" 
                          defaultValue={member.order} 
                          style={{ 
                            flex: 1, 
                            accentColor: 'var(--color-primary)', 
                            height: '6px', 
                            cursor: 'pointer' 
                          }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)', minWidth: '15px', textAlign: 'center' }}>
                          {member.order}
                        </span>
                      </div>

                      {/* Save Button */}
                      <button 
                        type="submit" 
                        style={{ 
                          background: 'rgba(64, 224, 208, 0.15)', 
                          color: 'var(--color-primary)', 
                          border: '1px solid rgba(64, 224, 208, 0.3)', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: 'var(--border-radius)', 
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          textAlign: 'center'
                        }}
                      >
                        Save
                      </button>
                    </form>
                  </td>

                  {/* Socials Column */}
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {member.linkedinUrl && <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>LinkedIn</a>}
                      {member.researchGateUrl && <a href={member.researchGateUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>ResearchGate</a>}
                      {member.googleScholarUrl && <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontSize: '0.85rem' }}>Scholar</a>}
                      {!member.linkedinUrl && !member.researchGateUrl && !member.googleScholarUrl && "-"}
                    </div>
                  </td>

                  {/* Delete Column */}
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
