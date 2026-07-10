'use client'

import { useState } from 'react'
import type { MoneyEntryRequest } from '@/lib/api'
import styles from './MoneyForm.module.css'

interface Props {
  onSubmit: (data: MoneyEntryRequest) => void
  initial?: MoneyEntryRequest
  onCancel?: () => void
}

const today = () => new Date().toISOString().split('T')[0]

export default function MoneyForm({ onSubmit, initial, onCancel }: Props) {
  const [form, setForm] = useState<MoneyEntryRequest>(
    initial ?? { price: 0, note: '', date: today() }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="price">Harga (Rp)</label>
        <input
          id="price"
          type="number"
          min={0}
          value={form.price}
          onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="note">Catatan</label>
        <input
          id="note"
          type="text"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          placeholder="Opsional"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="date">Tanggal</label>
        <input
          id="date"
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          required
        />
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
