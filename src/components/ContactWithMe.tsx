import React from 'react'
import {Button, FormControl, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {FormikErrors, useFormik} from 'formik'
import axios from 'axios'


interface FormValues {
    name: string;
    contacts: string | number
    message: string
}

export const ContactWithMe = () => {


    const formik = useFormik({
        initialValues: {
            name: '',
            contacts: '',
            message: ''
        },
        validate: (values: FormValues) => {
            let errors: FormikErrors<FormValues> = {}
            if (!values.name) errors.name = 'Введите ваше имя'
            if (!values.contacts) errors.contacts = 'Введите ваши контактные данные'
            if (!values.message) {
                errors.message = 'Введите текст сообщения'
            } else if (values.message.length < 20) {
                errors.message = 'Минимальное количество символов 20'
            } else if (values.message.length > 500) {
                errors.message = 'Максимальное количество символов 500'
            }
            return errors
        },
        onSubmit: values => {
            axios.post('https://smtp-nodemailer.herokuapp.com/sendMessage', {
                    name: values.name,
                    contacts: values.contacts,
                    message: values.message
                },
            )
            formik.resetForm()
        },
    })


    return (
        <Grid container justify="center">
            <Grid item xs={4}>
                <FormControl>
                    <form onSubmit={formik.handleSubmit}>
                        <FormLabel>
                            <h2>If you would like contact with me, you can send a message to my email </h2>
                        </FormLabel>

                        <FormGroup>
                            <TextField
                                autoComplete={'off'}
                                label="your name"
                                margin="normal"
                                variant={'outlined'}
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name ?
                                <div style={{color: 'red'}}>{formik.errors.name}</div> : null}

                            <TextField
                                autoComplete={'off'}
                                label="your contacts"
                                margin="normal"
                                variant={'outlined'}
                                {...formik.getFieldProps('contacts')}
                            />
                            {formik.touched.contacts && formik.errors.contacts ?
                                <div style={{color: 'red'}}>{formik.errors.contacts}</div> : null}

                            <TextField
                                label="Message"
                                multiline
                                margin="normal"
                                rows={6}
                                variant={'outlined'}
                                {...formik.getFieldProps('message')}
                            />
                            {formik.touched.message && formik.errors.message ?
                                <div style={{color: 'red'}}>{formik.errors.message}</div> : null}

                            <Button type={'submit'} variant={'contained'} color={'primary'}>Submit</Button>
                        </FormGroup>
                    </form>
                </FormControl>
            </Grid>
        </Grid>
    )
}