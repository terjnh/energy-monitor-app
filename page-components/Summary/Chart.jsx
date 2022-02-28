import { Wrapper, Spacer } from '@/components/Layout';
import React from 'react';
import {
    CartesianGrid, Legend,
    Line, LineChart,
    Tooltip, XAxis, YAxis
} from 'recharts';
import { Center, Text } from '@chakra-ui/react';
import styles from './Chart.module.css';

export const Chart = () => {
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    return (
        <Wrapper>
            <div className={styles.root}>
            <Spacer size={1} axis="vertical" />
                <Center w='1125px'>
                    <Text color="secondary"><b>Mock Summary Chart</b></Text>
                </Center>
                <Spacer size={0.2} axis="vertical" />
                <LineChart
                    width={800}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 300,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>

            </div>
        </Wrapper>

    )
};