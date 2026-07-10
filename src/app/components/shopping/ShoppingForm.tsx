'use client'

import { useState } from 'react'
import type { ShoppingItemRequest, Urgency, ItemStatus } from '@/lib/api'
import styles from './ShoppingForm.module.css'

interface Props {
  onSubmit: (data: ShoppingItemRequest) => void
  initial?: ShoppingItemRequest
  onCancel?: () => void
}

export default function ShoppingForm({ onSubmit, initial, onCancel }: Props) {
  const [form, setForm] = useState<ShoppingItemRequest>(
    initial ?? { name: '', urgency: 'MEDIUM', status: 'PENDING' }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name">Nama Barang</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="urgency">Urgensi</label>
        <select
          id="urgency"
          value={form.urgency}
          onChange={e => setForm({ ...form, urgency: e.target.value as Urgency })}
        >
          <option value="LOW">Rendah</option>
          <option value="MEDIUM">Sedang</option>
          <option value="HIGH">Tinggi</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value as ItemStatus })}
        >
          <option value="PENDING">Belum Dibeli</option>
          <option value="COMPLETED">Sudah Dibeli</option>
          <option value="CANCELLED">Dibatalkan</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary}>Simpan</button>
        {onCancel && (
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  )
}
