import { Spacer } from '@/components/Layout';
import styles from './Chart.module.css';
import { Chart } from './Chart';

export const Summary = () => {
    return (
        <div className={styles.root}>
            <Spacer size={1} axis="vertical" />
            <Chart />

        </div>
    )
};