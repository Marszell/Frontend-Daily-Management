'use client'

import { useEffect, useState } from 'react'
import { moneyApi, type MoneyEntry, type MoneyEntryRequest } from '@/lib/api'
import MoneyForm from '@/app/components/money/MoneyForm'
import MoneyList from '@/app/components/money/MoneyList'
import SummaryPanel from '@/app/components/money/SummaryPanel'
import styles from './page.module.css'

export default function MoneyPage() {
  const [entries, setEntries] = useState<MoneyEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<MoneyEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  const load = async () => {
    try {
      setEntries(await moneyApi.getAll())
    } catch (err) {
      alert('Gagal memuat data: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data: MoneyEntryRequest) => {
    try {
      await moneyApi.create(data)
      setShowForm(false)
      load()
    } catch (err) { alert((err as Error).message) }
  }

  const handleUpdate = async (data: MoneyEntryRequest) => {
    if (!editing) return
    try {
      await moneyApi.update(editing.id, data)
      setEditing(null)
      load()
    } catch (err) { alert((err as Error).message) }
  }

  const handleDelete = async (id: number) => {
    if (deletingIds.has(id)) return // already in flight, ignore repeat clicks
    if (!confirm('Hapus catatan ini?')) return
    setDeletingIds(prev => new Set(prev).add(id))
    try {
      await moneyApi.delete(id)
      setEntries(prev => prev.filter(en => en.id !== id))
    } catch (err) {
      alert((err as Error).message)
      load() // resync in case of a real failure
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const openAdd = () => { setShowForm(true); setEditing(null) }
  const openEdit = (entry: MoneyEntry) => { setEditing(entry); setShowForm(false) }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h1>Pencatatan Keuangan</h1>
        <button className={styles.btnAdd} onClick={showForm ? () => setShowForm(false) : openAdd}>
          {showForm ? 'Batal' : '+ Tambah'}
        </button>
      </div>

      <SummaryPanel />

      {showForm && (
        <MoneyForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editing && (
        <MoneyForm
          onSubmit={handleUpdate}
          initial={{ price: editing.price, note: editing.note, date: editing.date }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading
        ? <p className={styles.loading}>Memuat...</p>
        : <MoneyList entries={entries} onEdit={openEdit} onDelete={handleDelete} deletingIds={deletingIds} />
      }
    </div>
  )
}
