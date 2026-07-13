'use client'

import type { MoneyEntry } from '@/lib/api'
import styles from './MoneyList.module.css'

interface Props {
  entries: MoneyEntry[]
  onEdit: (entry: MoneyEntry) => void
  onDelete: (id: number) => void
  deletingIds?: Set<number>
}

export default function MoneyList({ entries, onEdit, onDelete, deletingIds }: Props) {
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
            <button
              className={styles.btnDelete}
              disabled={deletingIds?.has(entry.id)}
              onClick={() => onDelete(entry.id)}
            >
              {deletingIds?.has(entry.id) ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
