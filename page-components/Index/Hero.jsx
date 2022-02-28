import { ButtonLink } from '@/components/Button';
import { Container, ContainerVert, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.nextjs}>Facility</span>
          <span className={styles.mongodb}>Energy Monitoring & Control</span>
        </h1>
        <ContainerVert alignItems='center' justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/feed">
              <ButtonLink className={styles.button}>Explore Feed</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="vertical" size={1} />
          <Container>
            <Link passHref href="/devices">
              <ButtonLink className={styles.button}>Explore Devices</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="vertical" size={1} />
          <Container>
            <ButtonLink
              href="https://www.google.com/"
              type="secondary"
              className={styles.button}
            >
              Google
            </ButtonLink>
          </Container>
        </ContainerVert>
        <p className={styles.subtitle}>
          A smart building-management-system (BMS) showcase
        </p>
      </div>
    </Wrapper>
  );
};

export default Hero;
