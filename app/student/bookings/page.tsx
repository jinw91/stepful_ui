"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
} from '@chakra-ui/react';
import { Slot, StudentSlot } from '@/interfaces/slot';
import { getSlots, getSlotsByStudentId, updateSlot } from '@/api/slots';
import { useRouter } from 'next/navigation';

const StudentBookingsPage: React.FC = () => {
    const router = useRouter();
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [studentSlots, setStudentSlots] = useState<StudentSlot[]>([]);
    const toast = useToast();
    const studentIdRef = useRef<number>(0);

    useEffect(() => {
        const loadSlots = async () => {
            try {
                // Load student ID from session storage
                if (studentIdRef.current === 0) {
                    const studentIdStr = sessionStorage.getItem('studentId');
                    if (studentIdStr) {
                        studentIdRef.current = +studentIdStr;
                    } else {
                        router.push("/student");
                    }
                }

                await fetchSlots();
            } catch (error) {
                console.error("Failed to load slots:", error);
                toast({
                    title: "Error",
                    description: "Failed to load slots. Please try again later.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

        loadSlots();
    }, [router, toast]);

    const fetchSlots = async () => {
        const allUpcomingSlots = await getSlots(); // Fetch available slots
        setAvailableSlots(allUpcomingSlots);

        const studentUpcomingSlots = await getSlotsByStudentId(studentIdRef.current); // Fetch slots with coach details
        setStudentSlots(studentUpcomingSlots);
    };

    const handleBookSlot = async (slot: Slot) => {
        try {
            slot.student_id = studentIdRef.current;
            await updateSlot(slot); // Ensure updateSlot is awaited
            toast({
                title: "Success",
                description: `Slot ${slot.slot_id} booked successfully!`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            // Re-fetch the slots to update the UI
            await fetchSlots();
        } catch (error) {
            console.error("Failed to book slot:", error);
            toast({
                title: "Error",
                description: "Failed to book slot. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex p={5} direction="column" align="center">
            <Heading mb={5}>Upcoming Slots</Heading>
            <Box width="60%" overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Coach Id</Th>
                            <Th>Start Time</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {availableSlots.map((slot) => (
                            <Tr key={slot.slot_id}>
                                <Td>{slot.coach_id}</Td>
                                <Td>{new Date(slot.start_time).toLocaleString()}</Td>
                                <Td>
                                    <Button 
                                        colorScheme="teal" 
                                        onClick={() => handleBookSlot(slot)}
                                        disabled={slot.student_id !== null} // Disable if already booked
                                    >
                                        {slot.student_id ? 'Booked' : 'Book Now'}
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <Heading mb={5} mt={10}>Coach Details</Heading>
            <Box width="60%" overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Start Time</Th>
                            <Th>Coach Name</Th>
                            <Th>Phone Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {studentSlots.map((slot) => (
                            <Tr key={slot.slot_id}>
                                <Td>{new Date(slot.start_time).toLocaleString()}</Td>
                                <Td>{slot.Coach?.name}</Td>
                                <Td>{slot.Coach?.phone_number}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Flex>
    );
};

export default StudentBookingsPage;