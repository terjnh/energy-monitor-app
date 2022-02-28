import { Spacer, Container, Wrapper } from '@/components/Layout';
import styles from './AddDevice.module.css';
import AddDevice from './AddDevice';
import DeviceList from './DeviceList';

export const Devices = () => {
    return (
        <div className={styles.root}>
            <Spacer size={1} axis="vertical" />
            <AddDevice />

            <h2 className={styles.header1}>List of Devices</h2>
            <DeviceList />
        </div>
    )
}