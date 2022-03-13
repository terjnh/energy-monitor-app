import { ButtonLink } from '@/components/Button';
import { Container, ContainerVert, Spacer, Wrapper } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Hero.module.css';

const Hero = () => {

  const [exploreFeedLoading, setExploreFeedLoading] = useState(false);
  const [exploreDeviceLoading, setExploreDeviceLoading] = useState(false);
  const [deviceTypeLoading, setDeviceTypeLoading] = useState(false);

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
              <ButtonLink
                className={styles.button}
                onClick={() => {
                  setExploreFeedLoading(true);
                }}>
                Explore Feed {exploreFeedLoading ? <LoadingDots> </LoadingDots> : null}
              </ButtonLink>
            </Link>
          </Container>
          <Spacer axis="vertical" size={1} />
          <Container>
            <Link passHref href="/devices">
              <ButtonLink
                className={styles.button}
                onClick={() => {
                  setExploreDeviceLoading(true);
                }}>
                Explore Devices {exploreDeviceLoading ? <LoadingDots> </LoadingDots> : null}
              </ButtonLink>
            </Link>
          </Container>
          <Spacer axis="vertical" size={1} />
          <Container>
            <Link passHref href="/device-types">
              <ButtonLink
                className={styles.button}
                onClick={() => {
                  setDeviceTypeLoading(true);
                }}
              >Device Types {deviceTypeLoading ? <LoadingDots> </LoadingDots> : null}
              </ButtonLink>
            </Link>
          </Container>
          <Spacer axis="vertical" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/terjnh"
              type="secondary"
              className={styles.button}
            >
              Github
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
