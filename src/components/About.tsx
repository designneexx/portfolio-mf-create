import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';

export function About() {
    return (
        <>
            <Container maxW={'3xl'}>
                <Stack
                    as={Box}
                    py={{ base: 20, md: 36 }}
                    spacing={{ base: 8, md: 14 }}
                    textAlign={'center'}
                >
                    <Heading
                        fontSize={{ base: '2xl', md: '6xl', sm: '4xl' }}
                        fontWeight={600}
                        lineHeight={'110%'}
                    >
                        Привет, я Михаил Орлов
                        <Text as={'span'} color={'green.400'}>
                            your audience
                        </Text>
                    </Heading>
                    <Text color={'gray.500'}>
                        Monetize your content by charging your most loyal readers and reward them
                        loyalty points. Give back to your loyal readers by granting them access to
                        your pre-releases and sneak-peaks.
                    </Text>
                    <Stack
                        align={'center'}
                        alignSelf={'center'}
                        direction={'column'}
                        position={'relative'}
                        spacing={3}
                    >
                        <Button
                            _hover={{
                                bg: 'green.500'
                            }}
                            bg={'green.400'}
                            colorScheme={'green'}
                            px={6}
                            rounded={'full'}
                        >
                            Get Started
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
