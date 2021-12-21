import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField'
import {FormikErrors, useFormik} from 'formik'
import axios from 'axios'
import {SnackbarContent} from '@material-ui/core'
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack'



interface FormValues {
    name: string;
    contacts: string | number
    message: string
}


export const ContactWithMe = () => {
    let [openSnackBar, setOpenSnackBar] = useState<boolean>(false)
    let [disableButton, setDisableButton] = useState<boolean>(false)
    let [snackMessage, setSnackMessage] = useState<string>('')
    let [errorSnack, setErrorSnack] = useState<boolean>(false)


    const handleClose = () => setOpenSnackBar(false)
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
        onSubmit: async values => {
            setDisableButton(true)
            try {
                const response = await axios.post('https://smtp-nodemailer.herokuapp.com/sendMessage', {
                        name: values.name,
                        contacts: values.contacts,
                        message: values.message
                    },
                )
                if (response.data.success) {
                    setSnackMessage('Ваше сообщение отправлено')
                    setOpenSnackBar(true)
                    setErrorSnack(false)
                }
            } catch (error) {
                setOpenSnackBar(true)
                setDisableButton(true)
                setErrorSnack(true)
                setSnackMessage('Ошибка. Сообщение не отправлено!')
                console.log(error)
            } finally {
                setDisableButton(false)
                formik.resetForm()
            }
        },
    })


    return (
        <Grid  container justify="center">
            {disableButton &&
            <Stack sx={{position:'absolute', width: '100%', marginTop:'1px'}} >
                <LinearProgress />
            </Stack>
            }
            <Grid item xs={4}>
                <FormControl>
                    <form onSubmit={formik.handleSubmit}>
                        <FormLabel>
                            <h2 style={{marginTop:'3rem'}}>If you would like contact with me, you can send a message to my email </h2>
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

                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                disabled={disableButton}
                                style={{opacity: disableButton ? '0.6' : '1'}}
                            >Submit</Button>
                        </FormGroup>
                    </form>

                </FormControl>

                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <SnackbarContent style={{
                        backgroundColor: errorSnack ? 'red' : 'green',
                    }} message={snackMessage}/>
                </Snackbar>

            </Grid>

        </Grid>
    )
}

