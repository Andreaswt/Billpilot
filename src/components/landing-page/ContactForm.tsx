import { chakra, Center, Flex } from '@chakra-ui/react'
import { Section, SectionProps } from '@saas-ui/pro'
import { Form, Field, FormLayout, SubmitButton } from '@saas-ui/react'
import { SectionTitle } from './section/section-title'

interface ContactFormProps extends Omit<SectionProps, 'title' | 'children'> {
    title?: React.ReactNode
}


export const ContactForm: React.FC<ContactFormProps> = (props) => {
    const {
        title = 'Contact us!',
    } = props

    function submitHandler(fields: any) {
        console.log(fields)
    }

    type PostInputs = {
        name: string
        company: string
        email: string
        phone: string
        message: string

    }

    return (
        <Section px={10} id="contact">
            <SectionTitle title={title} />
            <Center>
                <Flex justifyContent="center" w="100%">
                    <Form<PostInputs>
                        w={{lg: "50%", base: "100%"}}
                        defaultValues={{
                            name: '',
                            company: '',
                            email: '',
                            phone: '',
                            message: '',
                        }}
                        onSubmit={submitHandler}
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


                                <Field<PostInputs> type="phone" name="phone" label="Phone" rules={{ required: true }} />
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
