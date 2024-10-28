"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();

    const handleLogin = async () => {
        // Replace with your login logic
        if (!username || !password) {
            toast({
                title: "Error",
                description: "Please enter both username and password.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // Simulate login success
        toast({
            title: "Success",
            description: "Logged in successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <Heading as="h1" size="xl">Login</Heading>
                <Stack spacing={4} width="full" maxW="md">
                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </FormControl>
                    <Button
                        colorScheme="teal"
                        onClick={handleLogin}
                    >
                        Log In
                    </Button>
                </Stack>

                <Text>
                    Don't have an account? <a href="/register">Register here</a>
                </Text>

            </main>
        </div>
    );
}
