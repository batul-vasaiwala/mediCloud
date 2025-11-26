"use client"
import styles from "./search-bar.module.css"
import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <Search size={20} />
        <input type="text" placeholder="Search patients by name, medical ID, phone number, or prescription ID..." />
      </div>
    </div>
  )
}
