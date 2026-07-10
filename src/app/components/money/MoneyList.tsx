'use client'

import type { MoneyEntry } from '@/lib/api'
import styles from './MoneyList.module.css'

interface Props {
  entries: MoneyEntry[]
  onEdit: (entry: MoneyEntry) => void
  onDelete: (id: number) => void
}

export default function MoneyList({ entries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return <p className={styles.empty}>Belum ada catatan keuangan.</p>
  }

  return (
    <div className={styles.list}>
      {entries.map(entry => (
        <div key={entry.id} className={styles.card}>
          <div>
            <div className={styles.price}>
              Rp {entry.price.toLocaleString('id-ID')}
            </div>
            {entry.note && <div className={styles.note}>{entry.note}</div>}
            <div className={styles.date}>{entry.date}</div>
          </div>

          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => onEdit(entry)}>
              Edit
            </button>
            <button className={styles.btnDelete} onClick={() => onDelete(entry.id)}>
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
