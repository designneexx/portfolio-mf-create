import {
    Box,
    Button,
    Flex,
    FormControl,
    Grid,
    HStack,
    Input,
    Spinner,
    Text
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaFilePdf } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useAppServices } from 'src/hooks/useAppServices';
import { useAppStores } from 'src/hooks/useAppStores';
import { useConst } from 'src/hooks/useConst';
import { FEParameters } from 'src/types/common';
import { LazyService } from '../LazyService';
import { Form, FormFields } from './types';

const enum PortfolioCreatorFormFields {
    ResumeFile = 'resume'
}

const REDIRECT_MS = 5000;

interface PortfolioCreatorFormComponentProps {
    feParameters: FEParameters;
}

function PortfolioCreatorFormComponent({ feParameters }: PortfolioCreatorFormComponentProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();
    const defaultValues = useConst(() => ({
        [FormFields.ResumeFile]: null
    }));
    const { portfolioStore, userStore } = useAppStores();
    const { portfolio } = portfolioStore;
    const { user } = userStore;
    const portfolioId = portfolio?.id;
    const { isCreated, isLoading } = portfolioStore;
    const { notificationService, portfolioService } = useAppServices();
    const { handleSubmit, register, setValue } = useForm<Form>({
        defaultValues
    });
    const { onChange, ...resumeFieldProps } = register(PortfolioCreatorFormFields.ResumeFile);

    const onSubmit = async () => {
        const form = formRef.current;

        if (!form) return;

        const formData = new FormData(form);

        await portfolioService.uploadResume(formData);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);

        onSubmit();
    };

    const onDropResumeFile = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const { dataTransfer } = e;
        const { files: filesList, items: itemsList } = dataTransfer;
        const transferItems = Array.from(itemsList);
        const itemsKindFile = transferItems.filter(({ kind }) => kind === 'file');
        const itemsFile = itemsKindFile.map((item) => item.getAsFile());
        const files = Array.from(filesList);
        const [firstFile] = itemsFile || files;

        if (firstFile) {
            setValue(FormFields.ResumeFile, firstFile);

            onSubmit();
        }
    };

    const onClickToResume = () => {
        navigate(`/resume/${portfolioId}`);
    };

    const onDeleteResume = () => {
        if (portfolio) {
            portfolioService.deleteResume(portfolio.id);
        }
    };

    useEffect(() => {
        if (user) {
            portfolioService.getResumeByUserId(user.id);
        }
    }, [user, portfolioService]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            if (isCreated) {
                navigate(`/resume/${portfolioId}`);
            }

            window.clearTimeout(timeout);
        }, REDIRECT_MS);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [isCreated, portfolioId, navigate]);

    return (
        <Grid gridTemplateRows='1fr' h='100%' overflow='hidden'>
            {portfolio ? (
                <Flex height='100%' overflow='hidden' padding={{ base: 3, md: 10 }}>
                    <Box position='relative'>
                        <LazyService
                            data={{
                                notificationService,
                                resumeId: portfolio.id,
                                userStore
                            }}
                            microservice={{
                                module: feParameters.module,
                                scope: feParameters.scope,
                                url: feParameters.url
                            }}
                        />
                        <Flex
                            alignItems='center'
                            backgroundColor='rgba(0,0,0,.5)'
                            height='100%'
                            justifyContent='center'
                            left={0}
                            position='absolute'
                            top={0}
                            width='100%'
                            zIndex={1}
                        >
                            <Flex gap={4}>
                                <Button onClick={onClickToResume}>Перейти</Button>
                                <Button colorScheme='red' onClick={onDeleteResume}>
                                    Удалить
                                </Button>
                            </Flex>
                        </Flex>
                    </Box>
                </Flex>
            ) : (
                <form onSubmitCapture={handleSubmit(onSubmit)} ref={formRef}>
                    {isLoading ? (
                        <Flex
                            alignItems='center'
                            gap={3}
                            height='100%'
                            justifyContent='center'
                            width='100%'
                        >
                            <Spinner size='xl' />
                            <Text size='xl'>Идет загрузка, это может занять несколько минут</Text>
                        </Flex>
                    ) : (
                        <FormControl
                            alignContent='center'
                            alignItems='center'
                            as='label'
                            cursor='pointer'
                            display='flex'
                            flexWrap='wrap'
                            gap={8}
                            h='100%'
                            htmlFor={PortfolioCreatorFormFields.ResumeFile}
                            isRequired
                            justifyContent='center'
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={onDropResumeFile}
                        >
                            <Input
                                {...resumeFieldProps}
                                hidden
                                id={PortfolioCreatorFormFields.ResumeFile}
                                multiple={false}
                                onChange={handleChange}
                                type='file'
                            />
                            <HStack as='span'>
                                <FaFilePdf size={50} />
                            </HStack>
                            <Text fontSize='2xl'>
                                Загрузите или перетащите ваше резюме в формате pdf
                            </Text>
                        </FormControl>
                    )}
                </form>
            )}
        </Grid>
    );
}

export const PortfolioCreatorForm = observer(PortfolioCreatorFormComponent);
