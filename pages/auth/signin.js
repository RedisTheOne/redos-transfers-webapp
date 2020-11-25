import Head from 'next/head'
import { API_URL } from '../../globals'
import { useEffect, useState } from 'react'
import styles from '../../styles/auth/AuthPage.module.scss'
import toastStyles from '../../styles/Toast.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SignIn() {
    //VARIABLES
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [toastTop, setToastTop] = useState(-65)
    const [toastTextOpacity, setToastTextOpacity] = useState(0)
    const [toastText, setToastText] = useState('')

    //CHECK IF TOKEN IS ALREADY SAVED
    useEffect(() => {
        if(localStorage.getItem('TOKEN'))
            router.push('/dashboard')
    }, [])

    //FORM SUBMITION
    const formSubmit = (e) => {
        e.preventDefault()
        showToast('Loading...')
        const valuesAreEntered = checkIfValuesAreEntered()
        if(valuesAreEntered)
            makeSignInRequest()
    }

    //SERVER REQUEST
    const makeSignInRequest = () => {
        fetch(`${API_URL}/users/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then(res => res.json())
            .then(data => {
                if(!data.status)
                    showToast(data.msg)
                else {
                    localStorage.setItem('TOKEN', data.token)
                    router.push('/dashboard')
                }
            })
    }

    //FIELDS VALIDATION
    const checkIfValuesAreEntered = () => {
        if(/\S/.test(username) && /\S/.test(password)) 
            return true
        setToastText('Please enter required fields')
        return false
    }

    //TOAST FUNCTIONS
    const showToast = (text) => {
        if(toastTop === -65) {
            setToastTop(10);
            setToastText(text);
            setTimeout(() => {
                setToastTextOpacity(1)
            }, 400)
        } else {
            setToastTextOpacity(0)
            setToastText(text);
            setTimeout(() => {
                setToastTextOpacity(1)
            }, 400)
        }
    }
    const toastClicked = () => {
        setToastTextOpacity(0)
        setTimeout(() => {
            setToastText('')
            setToastTop(-65)
        }, 300)
    }

    return (
        <div>
            <Head>
                <title>REDOS TRANSFERS | SIGN IN</title>
            </Head>
            <div onClick={() => toastClicked()} className={toastStyles.toast} style={{top: toastTop}}>
                <p style={{opacity: toastTextOpacity}}>{toastText}</p>
            </div>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.head}>
                        <h1>Welcome back!</h1>
                        <p>Sign in to your account</p>
                    </div>
                    <div className={styles.body}>
                        <form onSubmit={formSubmit}>
                            <div>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username:" type="text" />
                            </div>
                            <div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password:" type="password" />
                            </div>
                            <div>
                                <button type="submit">SIGN IN</button>
                            </div>
                            <div>
                                <Link href={"/auth/signup"}>
                                    Click here to sign up!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
  