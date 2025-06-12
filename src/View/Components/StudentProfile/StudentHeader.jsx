import React from 'react';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import styles from './StudentHeader.module.css';

const StudentHeader = ({ onActionsToggle }) => {
  return (
    <div className={styles.studentHeader}>
      <div className={styles.studentHeaderContent}>
        <div className={styles.studentHeaderInner}>
          <div className={styles.studentHeaderLeft}>
            <button className={styles.backButton}>
              <ArrowLeft />
            </button>
            <div className={styles.headerTitle}>
              <h1>Student Profile</h1>
              <p>Manage student information and academic records</p>
            </div>
          </div>
          <div className={styles.studentHeaderRight}>
            <button className={styles.btnSecondary}>
              <Download />
              <span>Export</span>
            </button>
            <button onClick={onActionsToggle} className={styles.btnPrimary}>
              <Edit />
              <span>Actions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
