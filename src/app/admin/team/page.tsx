import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import {
  createTeamMember,
  deleteTeamMember,
  createTeamCategory,
  deleteTeamCategory,
  updateTeamMember,
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
              <label htmlFor="bio">Skills & Interest (comma-separated)</label>
              <textarea id="bio" name="bio" rows={2} placeholder="e.g., Genomics, Machine Learning, Computational Biology, Synthetic Biology..."></textarea>
              <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Separate each skill with a comma — they appear as individual coloured tags on the team page.
              </small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="isHighlighted">Highlight / Feature this member?</label>
                <select
                  id="isHighlighted"
                  name="isHighlighted"
                  defaultValue="no"
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(2, 11, 26, 0.9)',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="no">No — standard card</option>
                  <option value="yes">Yes — featured / highlighted</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Profile Image Upload</label>
                <input type="file" id="image" name="image" accept="image/*" style={{ border: 'none', background: 'transparent', padding: '0.25rem 0' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Add Teammate
            </button>
          </form>
        </div>

      </div>

      {/* Teammates List & Full Detail Editors */}
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Current Teammates</h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Click <strong>Edit full details</strong> on any member to change every field — name, position, contacts,
          socials, skills, photo, category, ordering and highlight status.
        </p>
        {team.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {team.map(member => (
              <div
                key={member.id}
                style={{
                  background: 'var(--color-surface-light)',
                  borderRadius: 'var(--border-radius)',
                  border: member.isHighlighted
                    ? '1px solid rgba(255, 196, 64, 0.45)'
                    : '1px solid rgba(64, 224, 208, 0.15)',
                  overflow: 'hidden'
                }}
              >
                <details>
                  {/* Summary row */}
                  <summary
                    style={{
                      listStyle: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem'
                    }}
                  >
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-primary)' }}
                      />
                    ) : (
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-primary)', flexShrink: 0 }}>
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 'bold', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {member.name}
                        {member.isHighlighted && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ffc440', background: 'rgba(255, 196, 64, 0.12)', border: '1px solid rgba(255, 196, 64, 0.4)', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {member.position || member.role}
                        {member.category ? ` · ${member.category.name}` : ' · Uncategorized'}
                        {` · Order ${member.order}`}
                      </div>
                    </div>

                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                      Edit full details ▾
                    </span>
                  </summary>

                  {/* Full edit form */}
                  <form
                    action={updateTeamMember}
                    method="POST"
                    encType="multipart/form-data"
                    className={styles.form}
                    style={{ marginTop: 0, padding: '0 1.25rem 1.5rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <input type="hidden" name="id" value={member.id} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" name="name" required defaultValue={member.name} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Position / Role</label>
                        <input type="text" name="position" defaultValue={member.position || member.role} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label>Team Category</label>
                        <select
                          name="categoryId"
                          defaultValue={member.categoryId || "none"}
                          style={{ padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(2, 11, 26, 0.9)', color: 'white', outline: 'none' }}
                        >
                          <option value="none">General / No Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Sorting Order</label>
                        <input type="number" name="order" min="0" defaultValue={member.order} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" name="email" defaultValue={member.email || ""} placeholder="name@biotech.org" />
                      </div>
                      <div className={styles.formGroup}>
                        <label>LinkedIn URL</label>
                        <input type="url" name="linkedinUrl" defaultValue={member.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label>ResearchGate URL</label>
                        <input type="url" name="researchGateUrl" defaultValue={member.researchGateUrl || ""} placeholder="https://researchgate.net/profile/..." />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Google Scholar URL</label>
                        <input type="url" name="googleScholarUrl" defaultValue={member.googleScholarUrl || ""} placeholder="https://scholar.google.com/citations?..." />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Skills & Interest (comma-separated)</label>
                      <textarea name="bio" rows={2} defaultValue={member.bio || ""} placeholder="e.g., Genomics, Machine Learning, Computational Biology"></textarea>
                      <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        Separate each skill with a comma — they appear as individual coloured tags on the team page.
                      </small>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.formGroup}>
                        <label>Highlight / Feature this member?</label>
                        <select
                          name="isHighlighted"
                          defaultValue={member.isHighlighted ? "yes" : "no"}
                          style={{ padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(2, 11, 26, 0.9)', color: 'white', outline: 'none' }}
                        >
                          <option value="no">No — standard card</option>
                          <option value="yes">Yes — featured / highlighted</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Replace Profile Image</label>
                        <input type="file" name="image" accept="image/*" style={{ border: 'none', background: 'transparent', padding: '0.25rem 0' }} />
                        {member.imageUrl && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            <input type="checkbox" name="removeImage" value="yes" style={{ width: 'auto' }} />
                            Remove current photo
                          </label>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>

                      <button
                        formAction={deleteTeamMember.bind(null, member.id)}
                        type="submit"
                        style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '0.6rem 1rem', borderRadius: 'var(--border-radius)', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Delete Member
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem' }}>No teammates added yet.</p>
        )}
      </div>
    </div>
  );
}
