'use client'

import { useState } from 'react'
import type { ShoppingItem, Urgency } from '@/lib/api'
import styles from './ShoppingList.module.css'

interface Props {
  entries: ShoppingItem[]
  onEdit: (entry: ShoppingItem) => void
  onDelete: (id: number) => void
  onMove: (id: number, urgency: Urgency) => void
  onToggleStatus: (id: number) => void
}

const COLUMNS: { key: Urgency; label: string }[] = [
  { key: 'HIGH', label: 'Tinggi' },
  { key: 'MEDIUM', label: 'Sedang' },
  { key: 'LOW', label: 'Rendah' },
]

const STATUS_LABEL: Record<ShoppingItem['status'], string> = {
  PENDING: 'Belum Dibeli',
  COMPLETED: 'Sudah Dibeli',
  CANCELLED: 'Dibatalkan',
}

export default function ShoppingList({ entries, onEdit, onDelete, onMove, onToggleStatus }: Props) {
  const [dragOverCol, setDragOverCol] = useState<Urgency | null>(null)

  if (entries.length === 0) {
    return <p className={styles.empty}>Belum ada barang belanja.</p>
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', String(id))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e: React.DragEvent, urgency: Urgency) => {
    e.preventDefault()
    setDragOverCol(null)
    const id = Number(e.dataTransfer.getData('text/plain'))
    const entry = entries.find(en => en.id === id)
    if (entry && entry.urgency !== urgency) onMove(id, urgency)
  }

  return (
    <div className={styles.board}>
      {COLUMNS.map(col => {
        const items = entries.filter(en => en.urgency === col.key)
        return (
          <div
            key={col.key}
            className={`${styles.column} ${dragOverCol === col.key ? styles.columnOver : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOverCol(col.key) }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={e => handleDrop(e, col.key)}
          >
            <div className={`${styles.columnHeader} ${styles[`header${col.key}`]}`}>
              {col.label} <span className={styles.count}>{items.length}</span>
            </div>

            {items.length === 0 && <p className={styles.columnEmpty}>Kosong</p>}

            {items.map(entry => (
              <div
                key={entry.id}
                className={styles.card}
                draggable
                onDragStart={e => handleDragStart(e, entry.id)}
              >
                <div className={styles.name}>{entry.name}</div>
                <div className={styles.meta}>
                  <span className={`${styles.badge} ${styles[`status${entry.status}`]}`}>
                    {STATUS_LABEL[entry.status]}
                  </span>
                </div>
                <div className={styles.actions}>
                  {entry.status !== 'CANCELLED' && (
                    <button
                      className={entry.status === 'PENDING' ? styles.btnDone : styles.btnUndo}
                      onClick={() => onToggleStatus(entry.id)}
                    >
                      {entry.status === 'PENDING' ? '✓ Sudah' : '↩ Belum'}
                    </button>
                  )}
                  <button className={styles.btnEdit} onClick={() => onEdit(entry)}>Edit</button>
                  <button className={styles.btnDelete} onClick={() => onDelete(entry.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
