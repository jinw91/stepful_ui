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
import { Student } from '@/interfaces/student';
import { getStudents } from '@/api/student';

const LoginPage = () => {
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);
    const [students, setStudents] = useState<Student[]>([]);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                const studentResults = await getStudents();
                setStudents(studentResults);
            }
            catch (error) {
                console.error("Failed to load student details:", error);
            }
        };

        loadData();
    }, []);

    const handleLogin = () => {
        if (!selectedStudent) {
            toast({
                title: "Select a student.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Clear and store student info in sessionStorage
        sessionStorage.clear();
        sessionStorage.setItem('studentId', selectedStudent.student_id.toString());
        sessionStorage.setItem('studentName', selectedStudent.name);
        sessionStorage.setItem('studentPhone', selectedStudent.phone_number);

        console.log(selectedStudent);
        router.push("/student/bookings");
    };

    return (
        <Flex align="center" justify="center" minH="100vh" p={4}>
            <Box width={{ base: '90%', sm: '400px' }} p={6} borderWidth={1} borderRadius="lg">
                <Heading as="h1" size="lg" textAlign="center" mb={4}>
                    Select Your Student
                </Heading>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel htmlFor="student">Select Student</FormLabel>
                        <Select
                            id="student"
                            placeholder="Select a student"
                            onChange={(e) => {
                                const studentId = e.target.value;
                                const student = students.find((s) => s.student_id === parseInt(studentId));
                                setSelectedStudent(student);
                            }}
                        >
                            {students.map((student) => (
                                <option key={student.student_id} value={student.student_id}>
                                    {student.name}
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
