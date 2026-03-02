import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui";
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
            <span>FITUP corporate</span>
            <span>hello@fitup.com</span>
            <span>+84 0987 654 321</span>
          </div>
        </div>

        <nav className={styles.navBar}>
          <a className={styles.navLink} href="#">Home</a>
          <a className={styles.navLinkActive} href="#">About us</a>
          <a className={styles.navLink} href="#">Workout Plan</a>
          <a className={styles.navLink} href="#">Become PT</a>
          <a className={styles.navLink} href="#">Blogs</a>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Xin Chào</h1>
          <p className={styles.heroSubtitle}>
            With seamless in-app booking to connect with certified Personal Trainers anytime, anywhere.
          </p>
          <div className={styles.heroImagePlaceholder} />
        </section>

        <section className={styles.mission}>
          <h2 className={styles.heroTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            Ứng dụng của chúng tôi kết hợp số liệu thống kê, bài tập đa chức năng và thông tin khoa
            học. Chúng tôi tìm hiểu về các chương trình tập luyện tiên bộ và tạo ra các thử thách
            với các chuyên gia của chúng tôi để giúp việc tập luyện trở nên hấp dẫn và bổ ích cho bạn.
            Chúng tôi cũng ứng dụng kinh nghiệm của các chuyên gia dinh dưỡng để xây dựng kế hoạch ăn
            uống, giúp bạn vừa đạt được kết quả, vừa được tận hưởng niềm vui ăn uống.
          </p>
        </section>

        <div className={styles.largePlaceholder} />

        <section className={styles.featuresGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.featureBubble}>
              AI-driven workouts that adapt dynamically to your body,
            </div>
          ))}
        </section>

        <div className={styles.ctaWrap}>
          <Button className={styles.joinButton}>Join now</Button>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo} />
          <div className={styles.footerCols}>
            <div>
              <h3>Tools</h3>
              <a href="#">Privacy and Policy</a>
              <a href="#">Term of Service</a>
            </div>
            <div>
              <h3>Contact</h3>
              <p>hello@fitup.com</p>
              <p>Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>©2025 FITUP Company. All rights reserved.</div>
      </footer>
    </div>
  );
}