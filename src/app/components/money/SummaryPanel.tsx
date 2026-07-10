'use client'

import { useState } from 'react'
import { moneyApi, type Summary } from '@/lib/api'
import styles from './SummaryPanel.module.css'

type Period = 'daily' | 'weekly' | 'monthly'

const LABELS: Record<Period, string> = {
  daily: 'Hari Ini',
  weekly: 'Minggu Ini',
  monthly: 'Bulan Ini',
}

export default function SummaryPanel() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<Period | null>(null)

  const toggle = async (period: Period) => {
    // clicking same period again = hide
    if (active === period) {
      setSummary(null)
      setActive(null)
      return
    }
    setLoading(true)
    try {
      const data = await moneyApi.getSummary(period)
      setSummary(data)
      setActive(period)
    } catch (err) {
      alert('Gagal memuat ringkasan: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Ringkasan</p>

      <div className={styles.buttons}>
        {(Object.keys(LABELS) as Period[]).map(p => (
          <button
            key={p}
            onClick={() => toggle(p)}
            className={`${styles.btn} ${active === p ? styles.btnActive : ''}`}
          >
            {LABELS[p]}
          </button>
        ))}
      </div>

      {loading && <p className={styles.loading}>Memuat...</p>}

      {summary && !loading && (
        <div className={styles.result}>
          <div className={styles.row}>
            <span>Dari</span>
            <span>{summary.startDate}</span>
          </div>
          <div className={styles.row}>
            <span>Sampai</span>
            <span>{summary.endDate}</span>
          </div>
          <div className={styles.row}>
            <span>Jumlah Transaksi</span>
            <span>{summary.entryCount}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>
              Rp {summary.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
