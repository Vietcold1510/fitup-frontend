import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`${styles.page} ${styles.homeLandingRoot}`}>
      <div className={styles.homeLandingBg} />

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
          <Link className={styles.navLinkActive} href="/">Home</Link>
          <Link className={styles.navLink} href="/aboutus">About us</Link>
          <a className={styles.navLink} href="#">Workout Plan</a>
          <a className={styles.navLink} href="#">Become PT</a>
          <a className={styles.navLink} href="#">Blogs</a>
        </nav>
      </header>

      <main className={styles.homeMain}>
        <section className={styles.homeHero}>
          <div className={styles.homeBigPlaceholder}>Placeholder image</div>
          <aside className={styles.homeKnowCard}>
            <h3>Know More</h3>
            <p>Our Training</p>
            <div className={styles.homeMiniPlaceholders}>
              <span />
              <span />
              <span />
            </div>
          </aside>
        </section>

        <section className={styles.homeHeadline}>
          <div className={styles.homeFollow}>Follow</div>
          <p>Transform Your Body, Transform Your Life.</p>
          <h1>FITUP</h1>
        </section>

        <section className={styles.homeFeatureBand}>
          <div className={styles.homeSquarePlaceholder}>Placeholder image</div>
          <article className={styles.homeTextCard}>
            <h3>Personalized Workout Plan</h3>
            <p>AI-driven workouts that adapt dynamically to your body and goals.</p>
          </article>
          <div className={styles.homeSquarePlaceholder}>Placeholder image</div>
          <article className={styles.homeTextCard}>
            <h3>Localized Vietnamese Nutrition</h3>
            <p>Meal plans and tracking based on authentic Vietnamese foods.</p>
          </article>
        </section>

        <section className={styles.homeCoachSection}>
          <h2>24/7 AI-Coach & PT Connection</h2>
          <p>
            Instant support from our AI Chat Coach, with seamless in-app booking to connect with certified Personal Trainers anytime.
          </p>
          <div className={styles.homeCoachGrid}>
            <div className={styles.homeCoachCard}>COACH</div>
            <div className={styles.homeCoachCard}>COACH</div>
            <div className={styles.homeCoachCard}>COACH</div>
          </div>
        </section>

        <section className={styles.homeResults}>
          <h2>WE DELIVER RESULTS</h2>
          <div className={styles.homeResultsGrid}>
            <div>
              <strong>100 000+</strong>
              <p>Effective workouts according to your preferences</p>
            </div>
            <div>
              <strong>200+</strong>
              <p>Nutritious meals due to your eating habits</p>
            </div>
            <div>
              <strong>100+</strong>
              <p>Trainer with experience in many fitness disciplines</p>
            </div>
          </div>
        </section>

        <section className={styles.homeTestimonials}>
          <h2>EVEN MORE</h2>
          <div className={styles.homeTestimonialRow}>
            <div className={styles.homeTestimonialCard}>User review</div>
            <div className={styles.homeTestimonialCard}>User review</div>
            <div className={styles.homeTestimonialCard}>User review</div>
          </div>
        </section>

        <section className={styles.homeJoin}>
          <h2>JOIN NOW</h2>
          <button type="button">Begin your journey</button>
          <div className={styles.homeStoreInfo}>
            <span>4 out of 5</span>
            <span>Apple store</span>
            <span>Google store</span>
          </div>
          <div className={styles.homeStoreBadges}>
            <div>App Store</div>
            <div>Google Play</div>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.aboutFooter}`}>
        <div className={`${styles.footerContainer} ${styles.aboutFooterContainer}`}>
          <div className={styles.footerLogo} />
          <div className={styles.footerCompany}>
            <h2>FITUP</h2>
            <p>All-in-one fitness platform combining AI workouts and nutrition.</p>
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
          <span className={styles.copyrightText}>©2025 FITUP Company. All rights reserved.</span>
          <div className={styles.socialIcons}>
            <svg className={styles.icon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="ytmask-home" mask-type="luminance" maskUnits="userSpaceOnUse" x="0" y="1" width="12" height="10">
                <path d="M6 2.5C10.5 2.5 10.5 2.5 10.5 6C10.5 9.5 10.5 9.5 6 9.5C1.5 9.5 1.5 9.5 1.5 6C1.5 2.5 1.5 2.5 6 2.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 4.25L8 6L5 7.75V4.25Z" fill="black" />
              </mask>
              <g mask="url(#ytmask-home)">
                <path d="M12 0H0V12H12V0Z" fill="white" />
              </g>
            </svg>
            <svg className={styles.icon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1.5C8.66304 1.5 9.29893 1.76339 9.76777 2.23223C10.2366 2.70107 10.5 3.33696 10.5 4V8C10.5 8.66304 10.2366 9.29893 9.76777 9.76777C9.29893 10.2366 8.66304 10.5 8 10.5H4C3.33696 10.5 2.70107 10.2366 2.23223 9.76777C1.76339 9.29893 1.5 8.66304 1.5 8V4C1.5 3.33696 1.76339 2.70107 2.23223 2.23223C2.70107 1.76339 3.33696 1.5 4 1.5H8ZM6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6C4 6.53043 4.21071 7.03914 4.58579 7.41421C4.96086 7.78929 5.46957 8 6 8C6.53043 8 7.03914 7.78929 7.41421 7.41421C7.78929 7.03914 8 6.53043 8 6C8 5.46957 7.78929 4.96086 7.41421 4.58579C7.03914 4.21071 6.53043 4 6 4Z" fill="white" />
            </svg>
            <a href="https://www.facebook.com/profile.php?id=61559948289103" target="_blank" rel="noopener noreferrer">
              <svg className={styles.icon} width="12" height="12" viewBox="0 0 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 2H7.5C6.25 2 5.5 2.75 5.5 4V10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 6H7.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <svg className={styles.icon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.30008 2.91C7.95837 2.51976 7.77003 2.0187 7.77008 1.5H6.22508V7.7C6.21341 8.0356 6.07184 8.35354 5.83023 8.58675C5.58862 8.81996 5.26588 8.9502 4.93008 8.95C4.22008 8.95 3.63008 8.37 3.63008 7.65C3.63008 6.79 4.46008 6.145 5.31508 6.41V4.83C3.59008 4.6 2.08008 5.94 2.08008 7.65C2.08008 9.315 3.46008 10.5 4.92508 10.5C6.49508 10.5 7.77008 9.225 7.77008 7.65V4.505C8.39658 4.95493 9.14876 5.19632 9.92008 5.195V3.65C9.92008 3.65 8.98008 3.695 8.30008 2.91Z" fill="white" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
