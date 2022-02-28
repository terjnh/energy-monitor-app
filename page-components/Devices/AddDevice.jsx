import { Container, Wrapper } from '@/components/Layout';
import { useCurrentUser } from '@/lib/user';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import Link from 'next/link';
import styles from './PostDevice.module.css';
import { useCallback, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { usePostDevice } from '@/lib/device/';
import { fetcher } from '@/lib/fetch';


const PostDeviceInner = ({ user }) => {
    const nameRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const { mutate } = usePostDevice();

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                setIsLoading(true);
                await fetcher('/api/devices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameRef.current.value }),
                });
                toast.success('New device added');
                nameRef.current.value = '';
                // refresh devices list
                mutate();
            } catch (e) {
                toast.error(e.message);
            } finally {
                setIsLoading(false);
            }
        },
        [mutate]
    );

    return (
        <form onSubmit={onSubmit}>
            <Container className={styles.poster}>
                <Input
                    ref={nameRef}
                    className={styles.input}
                    placeholder={`Device name?`}
                    ariaLabel={`Device name?`}
                />
                <Button type="success" loading={isLoading}>
                    Add
                </Button>
            </Container>
        </form>
    )
}


const PostDevice = () => {
    const { data, error } = useCurrentUser();
    const loading = !data && !error;

    // if user is null, disallow adding of new device
    console.log('data:', data);

    return (
        <Wrapper>
            <div className={styles.root}>
                <h3 className={styles.heading}>Add New Device</h3>
                <Avatar size={40}
                    username={data?.user?.username}
                    url={data?.user?.profilePicture} />
                <br /><br />
                {loading ? (
                    <LoadingDots>Loading</LoadingDots>
                ) : data?.user ? (
                    <PostDeviceInner user={data.user} />
                ) : (
                    <Text color="secondary">
                        Please{' '}
                        <Link href="/login" passHref>
                            <TextLink color="link" variant="highlight">
                                sign in
                            </TextLink>
                        </Link>{' '}
                        to add device
                    </Text>
                )}
            </div>
        </Wrapper>
    )
}

export default PostDevice;