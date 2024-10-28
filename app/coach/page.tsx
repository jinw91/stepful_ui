"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Select,
    Heading,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { Coach } from '@/interfaces/coach';
import { getCoaches } from '@/api/coach';

const LoginPage = () => {
    const [selectedCoach, setSelectedCoach] = useState<Coach | undefined>(undefined);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const coachResults = await getCoaches();
                setCoaches(coachResults);
            }
            catch (error) {
                console.error("Failed to load user details:", error);
            }
        };

        loadData();
    }, []);

    const handleLogin = () => {
        if (!selectedCoach) {
            toast({
                title: "Select a coach.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Clear and store coach info in sessionStorage
        sessionStorage.clear();
        sessionStorage.setItem('coachId', selectedCoach.coach_id.toString());
        sessionStorage.setItem('coachName', selectedCoach.name);
        sessionStorage.setItem('coachPhone', selectedCoach.phone_number);

        console.log(selectedCoach);
        router.push("/coach/bookings");
    };

    return (
        <Flex align="center" justify="center" minH="100vh" p={4}>
            <Box width={{ base: '90%', sm: '400px' }} p={6} borderWidth={1} borderRadius="lg">
                <Heading as="h1" size="lg" textAlign="center" mb={4}>
                    Select Your Coach
                </Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel htmlFor="coach">Select Coach</FormLabel>
                        <Select
                            id="coach"
                            placeholder="Select a coach"
                            onChange={(e) => {
                                const coachId = e.target.value;
                                const coach = coaches.find((c) => c.coach_id === parseInt(coachId));
                                setSelectedCoach(coach);
                            }}
                        >
                            {coaches.map((coach) => (
                                <option key={coach.coach_id} value={coach.coach_id}>
                                    {coach.name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        colorScheme="teal"
                        onClick={handleLogin}
                    >
                        Log In
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
};

export default LoginPage;
