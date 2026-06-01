import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";
import { createTeamMember, deleteTeamMember } from "../actions";

export const revalidate = 0;

export default async function AdminTeam() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1>Manage Team Members</h1>
      
      {/* File upload is supported via Server Action using standard enctype="multipart/form-data" */}
      <form action={createTeamMember} method="POST" encType="multipart/form-data" className={styles.form}>
        <h3>Add New Teammate</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required placeholder="e.g., Jane Doe" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="position">Position / Role</label>
            <input type="text" id="position" name="position" required placeholder="e.g., Principal Investigator" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="e.g., jane@biotech.org" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="linkedinUrl">LinkedIn URL</label>
            <input type="url" id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
          </div>

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
          <textarea id="bio" name="bio" rows={3} placeholder="Provide a brief background..."></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Profile Image Upload</label>
          <input type="file" id="image" name="image" accept="image/*" style={{ border: 'none', background: 'transparent', padding: '0.25rem 0' }} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>Add Teammate</button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h3>Current Teammates</h3>
        {team.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Position</th>
                <th>Email</th>
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
                  <td>{member.position || member.role}</td>
                  <td>{member.email || "-"}</td>
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
