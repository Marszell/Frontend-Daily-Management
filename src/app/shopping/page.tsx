'use client'

import { useEffect, useState } from 'react'
import { shoppingApi, type ShoppingItem, type ShoppingItemRequest, type Urgency } from '@/lib/api'
import ShoppingForm from '@/app/components/shopping/ShoppingForm'
import ShoppingList from '@/app/components/shopping/ShoppingList'
import styles from './page.module.css'

export default function ShoppingPage() {
  const [entries, setEntries] = useState<ShoppingItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ShoppingItem | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setEntries(await shoppingApi.getAll())
    } catch (err) {
      alert('Gagal memuat data: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data: ShoppingItemRequest) => {
    try {
      await shoppingApi.create(data)
      setShowForm(false)
      load()
    } catch (err) { alert((err as Error).message) }
  }

  const handleUpdate = async (data: ShoppingItemRequest) => {
    if (!editing) return
    try {
      await shoppingApi.update(editing.id, data)
      setEditing(null)
      load()
    } catch (err) { alert((err as Error).message) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus barang ini?')) return
    try {
      await shoppingApi.delete(id)
      load()
    } catch (err) { alert((err as Error).message) }
  }

  const handleToggleStatus = async (id: number) => {
    const entry = entries.find(en => en.id === id)
    if (!entry || entry.status === 'CANCELLED') return
    const next = entry.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
    setEntries(prev => prev.map(en => en.id === id ? { ...en, status: next } : en))
    try {
      await shoppingApi.update(id, { name: entry.name, urgency: entry.urgency, status: next })
    } catch (err) {
      alert((err as Error).message)
      load()
    }
  }

  const handleMove = async (id: number, urgency: Urgency) => {
    const entry = entries.find(en => en.id === id)
    if (!entry) return
    // optimistic update so the card doesn't snap back while the request is in flight
    setEntries(prev => prev.map(en => en.id === id ? { ...en, urgency } : en))
    try {
      await shoppingApi.update(id, { name: entry.name, urgency, status: entry.status })
    } catch (err) {
      alert((err as Error).message)
      load()
    }
  }

  const openAdd = () => { setShowForm(true); setEditing(null) }
  const openEdit = (entry: ShoppingItem) => { setEditing(entry); setShowForm(false) }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h1>Daftar Belanja</h1>
        <button className={styles.btnAdd} onClick={showForm ? () => setShowForm(false) : openAdd}>
          {showForm ? 'Batal' : '+ Tambah'}
        </button>
      </div>

      {showForm && (
        <ShoppingForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editing && (
        <ShoppingForm
          onSubmit={handleUpdate}
          initial={{ name: editing.name, urgency: editing.urgency, status: editing.status }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading
        ? <p className={styles.loading}>Memuat...</p>
        : <ShoppingList entries={entries} onEdit={openEdit} onDelete={handleDelete} onMove={handleMove} onToggleStatus={handleToggleStatus} />
      }
    </div>
  )
}
