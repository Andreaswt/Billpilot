import { Text, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Stack, FormErrorMessage } from "@chakra-ui/react"
import { ApiKey } from "@prisma/client"
import React from "react"
import { Field, Formik, useFormik } from "formik";
import { trpc } from "../../../utils/trpc";
import * as Yup from 'yup';

interface IKeyValuePair {
    provider: string,
    apiKey: string,
    apiValue?: string | undefined
}

const ApiKeyModal = (KeyValuePair: IKeyValuePair) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

    const utils = trpc.useContext();
    const updateApiKey = trpc.useMutation('apikeys.upsertApiKey', {
        onSuccess() {
            utils.invalidateQueries(['apikeys.getAllKeysAndValues']);
            onClose();
        }
    });

    const ApiKeySchema = Yup.object().shape({
        apiKey: Yup.string()
          .required('Required'),
      });

    return (
        <>
            <Button onClick={onOpen} bg={'brand.button-bg'} textColor={'brand.button-text'}>
                Set
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}>

                <ModalOverlay />
                <ModalContent>
                    <Formik
                        initialValues={{
                            apiKey: '',
                        }}
                        validationSchema={ApiKeySchema} 
                        onSubmit={(values) => {
                            updateApiKey.mutate({ provider: KeyValuePair.provider, key: KeyValuePair.apiKey, value: values.apiKey });
                        }}
                    >
                        {({ handleSubmit, errors, touched }) => (
                            <form onSubmit={handleSubmit}>
                                <ModalHeader>Set your API key</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pb={6}>

                                    {!KeyValuePair.apiValue
                                        ? <></>
                                        : <>
                                            <Stack>
                                                <Text>Your current {KeyValuePair.provider} API key for {KeyValuePair.apiKey}:</Text>
                                                <Text textAlign={'center'} fontStyle={'italic'}>{KeyValuePair.apiValue}</Text>
                                            </Stack>
                                        </>}

                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="apiKey">API key:</FormLabel>
                                        <Field
                                            as={Input}
                                            id='apiKey'
                                            name='apiKey'
                                            type='apiKey'
                                            placeholder='Api key'
                                        />
                                        {errors.apiKey && touched.apiKey ? <Text color="red.600">{errors.apiKey}</Text> : null}
                                    </FormControl>
                                </ModalBody>

                                <ModalFooter>
                                    <Button isLoading={updateApiKey.status == 'loading'} loadingText='Submitting' type='submit' colorScheme='blue' mr={3}>Save</Button>
                                    <Button onClick={onClose}>Cancel</Button>
                                </ModalFooter>
                            </form>
                        )}
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ApiKeyModal;