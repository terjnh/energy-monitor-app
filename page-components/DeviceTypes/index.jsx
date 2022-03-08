import { Spacer, Wrapper } from '@/components/Layout';
import styles from './UploadDevice.module.css';
import UploadDevice from './UploadDevice';

import { Container } from '@mui/material';

export const DeviceTypes = () => {
    return (
        <div className={styles.root}>
            <Spacer size={1} axis="vertical" />
            <Container align='center' maxWidth="sm">
                <h2>Types of Devices</h2>
            </Container>
            <UploadDevice />
        </div>
    );
};