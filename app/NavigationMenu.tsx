"use client";

import { Flex, Button, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const NavigationMenu: React.FC = () => {
  const router = useRouter();

  return (
    <Flex as="nav" p={4} justify={"center"} color="white">
      <Stack direction="row" spacing={4}>
        <Button colorScheme="blue" variant="link" onClick={() => router.push('/coach')}>Coaches Home</Button>
        <Button colorScheme="blue" variant="link" onClick={() => router.push('/coach/bookings')}>Coaches Bookings</Button>
        <Button colorScheme="teal" variant="link" onClick={() => router.push('/student')}>Student Home</Button>
        <Button colorScheme="teal" variant="link" onClick={() => router.push('/student/bookings')}>Student Bookings</Button>
      </Stack>
    </Flex>
  );
};

export default NavigationMenu;
