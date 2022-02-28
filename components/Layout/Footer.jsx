import { Text, TextLink } from '@/components/Text';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from './Footer.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Wrapper>
        <Text color="accents-7">
          React - Next.JS - MongoDB -&nbsp;
          <TextLink href="https://github.com/terjnh" color="link">
            Github -&nbsp;
          </TextLink>
          <TextLink href="https://www.linkedin.com/in/terry-lim-97021/" color="link">
            LinkedIn
          </TextLink>
        </Text>
        <Spacer size={1} axis="vertical" />
        <ThemeSwitcher />
      </Wrapper>
    </footer>
  );
};

export default Footer;
