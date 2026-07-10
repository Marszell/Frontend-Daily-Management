import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'MyApp',
  description: 'Money management and shopping list',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.navBrand}>MyApp</Link>
            <Link href="/money" className={styles.navLink}>Keuangan</Link>
            <Link href="/shopping" className={styles.navLink}>Belanja</Link>
          </div>
        </nav>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
