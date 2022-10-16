import { Center, Flex } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Field, Form, FormLayout, SubmitButton, useSnackbar } from '@saas-ui/react'
import { trpc } from '../../utils/trpc'
import { SectionTitle } from './section/section-title'


interface ContactFormProps extends Omit<SectionProps, 'title' | 'children'> {
    title?: React.ReactNode
    sectionId?: string
}

export const ContactForm: React.FC<ContactFormProps> = (props) => {
    const {
        title = 'Contact us!',
        sectionId
    } = props
    
    const mutation = trpc.useMutation("contact.sendmail")
    const snackbar = useSnackbar()

    function submitHandler(fields: PostInputs) {
        console.log(fields)
        
        const handleContact = async () => {
            const name = fields.name;
            const company = fields.company;
            const email = fields.email;
            const phone = fields.phone;
            const message = fields.message;
        };

        mutation.mutate({
            name: fields.name,
            company: fields.company,
            email: fields.email,
            phone: fields.phone,
            message: fields.message,
        })

        snackbar({
            title: 'Message Sent',
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    type PostInputs = {
        name: string
        company: string
        email: string
        phone: string
        message: string
    }

    return (
        <Section id={sectionId} py={{base:'30', md:'20'}} px={10}>
            <SectionTitle title={title} />
            <Center>
                <Flex justifyContent="center" w="100%">
                    <Form<PostInputs>  
                        w={{ lg: "50%", base: "100%" }}
                        defaultValues={{
                            name: '',
                            company: '',
                            email: '',
                            phone: '',
                            message: '',
                        }}
                        onSubmit={submitHandler}¨
                        action="http://namecheap/mypage"
                    >

                        <FormLayout>
                            <FormLayout columns={[1, null, 2]}>
                                <Field<PostInputs> type="text" name="name" label="Name" rules={{ required: true }} />
                                {/* or: <InputField name="title" label="Title" /> */}


                                <Field<PostInputs> type="text" name="company" label="Company" rules={{ required: true }} />
                                {/* or: <InputField name="title" type="email" label="Title" /> */}
                            </FormLayout>
                            <FormLayout columns={[1, null, 2]}>
                                <Field<PostInputs> type="email" name="email" label="Email" rules={{ required: true }} />
                                {/* or: <InputField name="title" type="email" label="Title" /> */}


                                <Field<PostInputs> type="phone" name="phone" label="Phone (Include Country Code)" rules={{ required: true }} />
                                {/* or: <InputField name="title" type="email" label="Title" /> */}
                            </FormLayout>
                            <Field<PostInputs>
                                name="message"
                                type="textarea"
                                label="Message"
                                placeholder="Tell us what you're thinking!"
                                rules={{ required: true }}
                            />
                            <SubmitButton>Send Message</SubmitButton>
                        </FormLayout>
                    </Form>
                </Flex>
            </Center>

        </Section>
    )
}
