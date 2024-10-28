"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    VStack,
    useToast,
    Select,
} from '@chakra-ui/react';
import { addSlot, getPastSlotsWithoutCallsByCoachId, getSlotsByCoachId } from '@/api/slots';
import { CoachSlot, Slot } from '@/interfaces/slot';
import { useRouter } from 'next/navigation';
import { addCall, getCallsByCoachId } from '@/api/calls';
import { Call } from '@/interfaces/calls';

const TIME_SLOT_DURATION = 2;

const Page: React.FC = () => {
    const router = useRouter();
    const [startTime, setStartTime] = useState('');
    const [timeSlots, setTimeSlots] = useState<CoachSlot[]>([]);
    const [slotsWithoutNotes, setSlotsWithoutNotes] = useState<Slot[]>([]);
    const [satisfactionScores, setSatisfactionScores] = useState<{ [key: number]: number }>({});
    const [notes, setNotes] = useState<{ [key: number]: string }>({});
    const [pastCalls, setPastCalls] = useState<Call[]>([]);
    const toast = useToast();
    const coachIdRef = useRef<number>(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (coachIdRef.current === 0) {
                    const coachIdStr = sessionStorage.getItem('coachId');
                    if (coachIdStr) {
                        coachIdRef.current = +coachIdStr;

                        await fetchData();
                    } else {
                        router.push("/coach");
                    }
                }
            } catch (error) {
                console.error("Failed to load user details:", error);
            }
        };

        loadData();
    }, [router]);

    const fetchData = async () => {
        const coachSlots = await getSlotsByCoachId(coachIdRef.current);
        setTimeSlots(coachSlots);

        const pastSlotsWithoutCalls = await getPastSlotsWithoutCallsByCoachId(coachIdRef.current);
        setSlotsWithoutNotes(pastSlotsWithoutCalls);

        const calls = await getCallsByCoachId(coachIdRef.current);
        setPastCalls(calls);
    };

    const handleAddSlot = () => {
        if (!startTime) {
            toast({
                title: 'Error',
                description: 'Please select a start time.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const start = new Date(startTime);
        const now = new Date();
        if (start <= now) {
            toast({
                title: 'Error',
                description: 'Start time must be in the future.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const end = new Date(start);
        end.setHours(start.getHours() + TIME_SLOT_DURATION);

        const newSlot: CoachSlot = {
            coach_id: coachIdRef.current,
            start_time: start,
            slot_id: 0,
            student_id: null,
            Student: null // Assuming Student will be filled with the actual student data later
        };

        // Check for overlapping time slots
        if (timeSlots.some(slot => isOverlapping(slot.start_time.toLocaleString(), startTime))) {
            toast({
                title: 'Error',
                description: 'Time slots cannot overlap.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        addSlot(newSlot);
        fetchData();
        setStartTime('');
        toast({
            title: 'Success',
            description: 'Time slot added.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const isOverlapping = (start1Str: string, start2Str: string) => {
        const start1 = new Date(start1Str);
        const start2 = new Date(start2Str);

        const end1 = new Date(start1);
        end1.setHours(start1.getHours() + TIME_SLOT_DURATION);

        const end2 = new Date(start2);
        end2.setHours(start2.getHours() + TIME_SLOT_DURATION);

        return (
            (start1 >= start2 && start1 < end2) ||
            (start2 >= start1 && start2 < end1)
        );
    };

    const handleSaveNotes = (slotId: number) => {
        const callNotes: Call = {
            call_id: 0, // Leaving 0 as it will be created
            slot_id: slotId,
            satisfaction_score: satisfactionScores[slotId],
            notes: notes[slotId],
            Slot: null // Not needed except in retrieval
        };
        addCall(callNotes);
        fetchData();
        toast({
            title: 'Success',
            description: 'Notes and satisfaction score saved.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const renderTimeSlots = (): JSX.Element => {
        return (
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Start Time</Th>
                        <Th>End Time</Th>
                        <Th>Student Phone</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {timeSlots.map((slot, index) => {
                        const startDate = new Date(slot.start_time);
                        const endDate = new Date(startDate.getTime());
                        endDate.setHours(endDate.getHours() + TIME_SLOT_DURATION);

                        return (
                            <Tr key={index}>
                                <Td>{startDate.toLocaleString()}</Td>
                                <Td>{endDate.toLocaleString()}</Td>
                                <Td>{slot.Student?.phone_number || 'No Student'}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        );
    };

    const renderRatingTable = (): JSX.Element => {
        return (
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Start Time</Th>
                        <Th>Student Id</Th>
                        <Th>Satisfaction Score</Th>
                        <Th>Notes</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {slotsWithoutNotes.map((slot) => {
                        const startDate = new Date(slot.start_time);

                        return (
                            <Tr key={slot.slot_id}>
                                <Td>{startDate.toLocaleString()}</Td>
                                <Td>{slot.student_id || 'No Student'}</Td>
                                <Td>
                                    <FormControl>
                                        <Select
                                            value={satisfactionScores[slot.slot_id] || ''}
                                            onChange={(e) => setSatisfactionScores({ ...satisfactionScores, [slot.slot_id]: +e.target.value })}
                                            placeholder="Select a score">
                                            {[1, 2, 3, 4, 5].map(score => (
                                                <option key={score} value={score}>
                                                    {score}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Td>
                                <Td>
                                    <FormControl>
                                        <Input
                                            placeholder="Notes"
                                            value={notes[slot.slot_id] || ''}
                                            onChange={(e) => setNotes({ ...notes, [slot.slot_id]: e.target.value })}
                                        />
                                    </FormControl>
                                </Td>
                                <Td>
                                    <Button colorScheme="teal" onClick={() => handleSaveNotes(slot.slot_id)}>
                                        Save Notes
                                    </Button>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        );
    };

    const renderPastCalls = (): JSX.Element => {
        return (
            <Table variant="simple" mt={5}>
                <Thead>
                    <Tr>
                        <Th>Call Time</Th>
                        <Th>Satisfaction Score</Th>
                        <Th>Notes</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {pastCalls.map((call) => (
                        <Tr key={call.call_id}>
                            <Td>{call.Slot
                                ? new Date(call.Slot.start_time).toLocaleString() : 'N/A'}</Td>
                            <Td>{call.satisfaction_score || 'N/A'}</Td>
                            <Td>{call.notes || 'N/A'}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    };

    return (
        <Flex p={5} align="center" justify="center">
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel>Start Time</FormLabel>
                    <Input
                        placeholder='Select Date and Time'
                        size='md'
                        type='datetime-local'
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </FormControl>
                <Button colorScheme="teal" onClick={handleAddSlot}>
                    Add Time Slot
                </Button>

                <Box mt={5} width="100%">
                    <Text fontSize="xl">Added Time Slots:</Text>
                    {renderTimeSlots()}
                </Box>

                <Box mt={5} width="100%">
                    <Text fontSize="xl">Past Calls Without Notes:</Text>
                    {renderRatingTable()}
                </Box>

                <Box mt={5} width="100%">
                    <Text fontSize="xl">Past Calls:</Text>
                    {renderPastCalls()}
                </Box>
            </VStack>
        </Flex>
    );
};

export default Page;
