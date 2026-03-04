import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";
import styles from "../page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function AboutUs() {
  return (
    <div className={styles.page}>
      <div className={styles.bgOverlay} />
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={styles.logoContainer}>
            <Image src="/logo.svg" alt="FitUp logo" width={120} height={32} />
          </div>
          <div className={styles.topInfo}>
            <div className={styles.topItem}>
              <span className={styles.icon}>📍</span>
              <div>
                <strong>FITUP Corporate</strong>
                <br />
                <span>Headquarters: Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
            <div className={styles.topItem}>
              <span className={styles.icon}>✉️</span>
              <span>
                <strong>Email:</strong> hello@fitup.com
              </span>
            </div>
            <div className={styles.topItem}>
              <span className={styles.icon}>☎️</span>
              <span>
                <strong>Telephone:</strong> 0987654321
              </span>
            </div>
          </div>
        </div>

        <nav className={styles.navBar}>
          <Link className={styles.navLink} href="/">
            Home
          </Link>
          <Link className={styles.navLinkActive} href="/aboutus">
            About us
          </Link>
          <a className={styles.navLink} href="#">
            Workout Plan
          </a>
          <a className={styles.navLink} href="#">
            Become PT
          </a>
          <a className={styles.navLink} href="#">
            Blogs
          </a>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Welcome</h1>
          <p className={`${styles.heroSubtitle} ${styles.heroQuote}`}>
            FitUp, your ultimate fitness companion, the one stop shop for all
            your fitness needs.
          </p>
        </section>

        <section className={styles.mission}>
          <h2 className={styles.heroTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            An application that combines workout tracking, flexible exercises,
            and trusted fitness knowledge to help you train better. We study
            modern training methods and work with experienced coaches to create
            fun and motivating challenges that keep you improving. Help you
            build simple meal plans that help you reach your goals while still
            enjoying your food.
          </p>
          <div
            className={`${styles.heroImagePlaceholder} ${styles.placeholderImageBox}`}
          >
            Placeholder image
          </div>
        </section>

        <section className={styles.mission}>
          <h2 className={styles.heroTitle}>Our Vision</h2>
          <p className={styles.missionText}>
            To become the most trusted digital fitness ecosystem in Vietnam and
            beyond, where everyone can access smart training, practical
            nutrition guidance, and professional coaching to build a healthier
            life.
          </p>
        </section>

        <div
          className={`${styles.heroImagePlaceholder} ${styles.placeholderImageBox}`}
        >
          Placeholder image
        </div>

        <div className={styles.ctaWrap}>
          <Button className={styles.joinButton}>Join now</Button>
        </div>
      </main>

      <footer className={`${styles.footer} ${styles.aboutFooter}`}>
        <div
          className={`${styles.footerContainer} ${styles.aboutFooterContainer}`}
        >
          <div className={styles.footerLogo} />
          <div className={styles.footerCompany}>
            <h2>FITUP</h2>
            <p>
              All-in-one fitness platform combining AI workouts and nutrition.
            </p>
            <p>
              <strong>Company Registration Certificate:</strong> 01234567
            </p>
          </div>
          <div className={styles.footerTools}>
            <h3>Tools</h3>
            <a href="#">Privacy and Policy</a>
            <a href="#">Term of Service</a>
            <a href="#">Return and Refund Policy</a>
          </div>
          <div className={styles.footerContact}>
            <h3>Contact</h3>
            <p>Address: FPT University</p>
            <p>Email: hello@fitup.com</p>
            <p>Website: www.fitup.com</p>
            <p>Tel: 098 765 4321</p>
            <p>Headquarters: Ho Chi Minh City, Vietnam</p>
          </div>
        </div>
        <div className={`${styles.footerBottom} ${styles.aboutFooterBottom}`}>
          <span className={styles.copyrightText}>
            ©2025 FITUP Company. All rights reserved.
          </span>
          <div className={styles.socialIcons}>
            {/* YouTube */}
            <svg
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="ytmask"
                mask-type="luminance"
                maskUnits="userSpaceOnUse"
                x="0"
                y="1"
                width="12"
                height="10"
              >
                <path
                  d="M6 2.5C10.5 2.5 10.5 2.5 10.5 6C10.5 9.5 10.5 9.5 6 9.5C1.5 9.5 1.5 9.5 1.5 6C1.5 2.5 1.5 2.5 6 2.5Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5 4.25L8 6L5 7.75V4.25Z" fill="black" />
              </mask>
              <g mask="url(#ytmask)">
                <path d="M12 0H0V12H12V0Z" fill="white" />
              </g>
            </svg>
            {/* Instagram */}
            <svg
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5C8.66304 1.5 9.29893 1.76339 9.76777 2.23223C10.2366 2.70107 10.5 3.33696 10.5 4V8C10.5 8.66304 10.2366 9.29893 9.76777 9.76777C9.29893 10.2366 8.66304 10.5 8 10.5H4C3.33696 10.5 2.70107 10.2366 2.23223 9.76777C1.76339 9.29893 1.5 8.66304 1.5 8V4C1.5 3.33696 1.76339 2.70107 2.23223 2.23223C2.70107 1.76339 3.33696 1.5 4 1.5H8ZM6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6C4 6.53043 4.21071 7.03914 4.58579 7.41421C4.96086 7.78929 5.46957 8 6 8C6.53043 8 7.03914 7.78929 7.41421 7.41421C7.78929 7.03914 8 6.53043 8 6C8 5.46957 7.78929 4.96086 7.41421 4.58579C7.03914 4.21071 6.53043 4 6 4ZM6 5C6.26522 5 6.51957 5.10536 6.70711 5.29289C6.89464 5.48043 7 5.73478 7 6C7 6.26522 6.89464 6.51957 6.70711 6.70711C6.51957 6.89464 6.26522 7 6 7C5.73478 7 5.48043 6.89464 5.29289 6.70711C5.10536 6.51957 5 6.26522 5 6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5ZM8.25 3.25C8.11739 3.25 7.99021 3.30268 7.89645 3.39645C7.80268 3.49021 7.75 3.61739 7.75 3.75C7.75 3.88261 7.80268 4.00979 7.89645 4.10355C7.99021 4.19732 8.11739 4.25 8.25 4.25C8.38261 4.25 8.50979 4.19732 8.60355 4.10355C8.69732 4.00979 8.75 3.88261 8.75 3.75C8.75 3.61739 8.69732 3.49021 8.60355 3.39645C8.50979 3.30268 8.38261 3.25 8.25 3.25Z"
                fill="white"
              />
            </svg>
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61559948289103"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className={styles.icon}
                width="12"
                height="12"
                viewBox="0 0 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 2H7.5C6.25 2 5.5 2.75 5.5 4V10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6H7.5"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            {/* TikTok */}
            <svg
              className={styles.icon}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.30008 2.91C7.95837 2.51976 7.77003 2.0187 7.77008 1.5H6.22508V7.7C6.21341 8.0356 6.07184 8.35354 5.83023 8.58675C5.58862 8.81996 5.26588 8.9502 4.93008 8.95C4.22008 8.95 3.63008 8.37 3.63008 7.65C3.63008 6.79 4.46008 6.145 5.31508 6.41V4.83C3.59008 4.6 2.08008 5.94 2.08008 7.65C2.08008 9.315 3.46008 10.5 4.92508 10.5C6.49508 10.5 7.77008 9.225 7.77008 7.65V4.505C8.39658 4.95493 9.14876 5.19632 9.92008 5.195V3.65C9.92008 3.65 8.98008 3.695 8.30008 2.91Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
