import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.hero}>
      <h1>Selamat Datang di MyApp</h1>
      <div className={styles.cards}>
        <Link href="/money" className={styles.card} style={{ background: '#1d4ed8' }}>
          <h2>Pencatatan Keuangan</h2>
          <p>Catat pemasukan &amp; pengeluaran harian</p>
        </Link>
        <Link href="/shopping" className={styles.card} style={{ background: '#15803d' }}>
          <h2>Daftar Belanja</h2>
          <p>Kelola barang yang perlu dibeli</p>
        </Link>
      </div>
    </div>
  )
}
