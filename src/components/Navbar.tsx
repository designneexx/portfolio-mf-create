import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    IconButton,
    Link,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    useMediaQuery
} from '@chakra-ui/react';

export function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [isLargerThanMD] = useMediaQuery('(min-width: 48em)');

    return (
        <>
            <Flex
                alignItems={'center'}
                as='header'
                bg={useColorModeValue('gray.100', 'gray.900')}
                h={16}
                justifyContent={'space-between'}
                position='fixed'
                px={4}
                w='100%'
                zIndex='sticky'
            >
                <Link>
                    <Text as='strong' fontSize='xl'>
                        Михаил Орлов
                    </Text>
                </Link>

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={7}>
                        {isLargerThanMD ? (
                            <>
                                <Button variant='ghost'>About</Button>
                                <Button variant='ghost'>Experience</Button>
                                <Button variant='ghost'>Projects</Button>
                                <Button variant='ghost'>Contact</Button>
                            </>
                        ) : (
                            <></>
                        )}
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        </Button>

                        {isLargerThanMD ? (
                            <></>
                        ) : (
                            <>
                                <Button
                                    as={IconButton}
                                    icon={<HamburgerIcon />}
                                    onClick={onOpen}
                                ></Button>
                                <Drawer isOpen={isOpen} onClose={onClose} placement='top'>
                                    <DrawerOverlay />
                                    <DrawerContent>
                                        <DrawerBody>
                                            <Button variant='ghost'>About</Button>
                                            <Button variant='ghost'>Experience</Button>
                                            <Button variant='ghost'>Projects</Button>
                                            <Button variant='ghost'>Contact</Button>
                                        </DrawerBody>
                                    </DrawerContent>
                                </Drawer>
                            </>
                        )}
                    </Stack>
                </Flex>
            </Flex>
        </>
    );
}
