import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";

export const revalidate = 0;

export default async function AdminDashboard() {
  const newsCount = await prisma.news.count();
  const pubCount = await prisma.publication.count();
  const teamCount = await prisma.teamMember.count();
  const areaCount = await prisma.areaOfInterest.count();
  const unreadCount = await prisma.contactMessage.count({ where: { isRead: false } });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the BioTech Uncharted content management system.</p>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.statCard}>
          <h3>Total News</h3>
          <p>{newsCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Publications</h3>
          <p>{pubCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Team Members</h3>
          <p>{teamCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Areas of Interest</h3>
          <p>{areaCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Unread Messages</h3>
          <p>{unreadCount}</p>
        </div>
      </div>
    </div>
  );
}
