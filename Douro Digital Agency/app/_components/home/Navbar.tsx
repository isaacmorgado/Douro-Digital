"use client";

import Image from "next/image";
import { navLinks } from "@/app/_data/home";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.pill}>
        <a href="#">
          <Image
            src="/images/douro-digital-logo.png"
            alt="Douro Digital"
            width={54}
            height={42}
            className={styles.logo}
          />
        </a>
        <div className={styles.right}>
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button className={styles.cta}>Get in touch</button>
        </div>
      </div>
    </nav>
  );
}
