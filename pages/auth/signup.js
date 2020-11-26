import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../../styles/auth/AuthPage.module.scss'
import toastStyles from '../../styles/Toast.module.scss'
import Link from 'next/link'
import { API_URL } from '../../globals'
import { useRouter } from 'next/router'

export default function SignUp({ usersList }) {
    //TEXT INPUT'S VALUES
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    //TOAST VALUES
    const [toastTop, setToastTop] = useState(-65)
    const [toastTextOpacity, setToastTextOpacity] = useState(0)
    const [toastText, setToastText] = useState('')
    //CARD VALUES
    const [headerTexts, setHeaderTexts] = useState({ header: 'Step 1', parahraph: 'Basic information' })
    const [firstFormProperties, setFirstFormProperties] = useState({ display: 'block', opacity: 1 })
    const [secondFormProperties, setSecondFormProperties] = useState({ display: 'none', opacity: 0, isDone: false })
    const [thirdFormProperties, setThirdFormProperties] = useState({ display: 'none', opacity: 0 })

    //CHECK IF TOKEN IS ALREADY SAVED
    useEffect(() => {
        if(localStorage.getItem('TOKEN'))
            router.push('/dashboard')
    }, [])

    //CHANGE TO STEP 2 WHEN 1 IS DONE
    useEffect(() => {
        if(firstFormProperties.display === 'none') {
            setSecondFormProperties({display: 'block', opacity: 1})
            setHeaderTexts({header: 'Step 2', parahraph: 'Region and phone number'})
        }
    }, [firstFormProperties])

    //CHANGE TO STEP 3 WHEN 2 IS DONE
    useEffect(() => {
        if(secondFormProperties.isDone) {
            setThirdFormProperties({display: 'block', opacity: 1})
            setHeaderTexts({header: 'Step 3', parahraph: 'Enter your password'})
        }
    }, [secondFormProperties])

    //FIRST STEP SUBMIT
    const firstFormSubmit = (e) => {
        e.preventDefault()
        //CHECK IF FIELDS ARE VALID
        if(/\S/.test(username) && /\S/.test(email)) {
            if(!usersList.includes(username)) {
                if(validateEmail()) {
                    setFirstFormProperties({display: 'block', opacity: 0})
                    setTimeout(() => {
                        setFirstFormProperties({display: 'none', opacity: 0})
                    }, 300)
                } else
                    showToast('Please add a valid email!') 
            } else 
                showToast('Username is already used!')
        } else
            showToast('Please fill required fields!')
    }

    //SECOND STEP SUBMIT
    const secondFormSubmit = (e) => {
        e.preventDefault()
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        if(/\S/.test(number)) {
            if(phoneRegex.test(number)) {
                setSecondFormProperties({display: 'block', opacity: 0})
                setTimeout(() => {
                    setSecondFormProperties({display: 'none', opacity: 0, isDone: true})
                }, 300)
            }
            else
                showToast('Please enter a valid phone number (XXX XXX XXXX)')
        } else
            showToast('Please fill required fields!')
    }

    //THIRD STEP SUBMIT
    const thirdFormSubmit = (e) => {
        e.preventDefault()
        if(/\S/.test(password) && /\S/.test(confirmPassword)) {
            if(password === confirmPassword) {
                showToast('Loading...')
                fetchRequest()
            } else
                showToast("Passwords don't match!")
        } else
            showToast('Please fill required fields!')
    }

    //MAKE THE SERVER REQUEST
    const fetchRequest = () => {
        fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password, phone_number: number, email, region: document.getElementById('regionInput').value})
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
            setTimeout(() => {
                setToastText(text);
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

    //EMAIL VALIDATION
    const validateEmail = () => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return (
        <div>
            <Head>
                <title>REDOS TRANSFERS | SIGN UP</title>
            </Head>
            <div onClick={() => toastClicked()} className={toastStyles.toast} style={{top: toastTop}}>
                <p style={{opacity: toastTextOpacity}}>{toastText}</p>
            </div>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.head}>
                        <h1>{headerTexts.header}</h1>
                        <p>{headerTexts.parahraph}</p>
                    </div>
                    <div className={styles.body}>
                        <form style={{opacity: firstFormProperties.opacity, display: firstFormProperties.display}} onSubmit={firstFormSubmit} >
                            <div>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username:" type="text" />
                            </div>
                            <div>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email:" type="email" />
                            </div>
                            <div>
                                <button type="submit">NEXT</button>
                            </div>
                            <div>
                                <Link href={"/auth/signin"}>
                                    Click here to sign in!
                                </Link>
                            </div>
                        </form>
                        <form style={{opacity: secondFormProperties.opacity, display: secondFormProperties.display}} onSubmit={secondFormSubmit} >
                            <div>
                                <select id="regionInput" className={styles.options}>
                                    <option value="Europe Nordic & East">Europe Nordic & East</option>
                                    <option value="Europe West">Europe West</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="Japan">Japan</option>
                                </select>
                            </div>
                            <div>
                                <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Number:" type="text" />
                            </div>
                            <div>
                                <button type="submit">NEXT</button>
                            </div>
                            <div>
                                <Link href={"/auth/signin"}>
                                    Click here to sign in!
                                </Link>
                            </div>
                        </form>
                        <form style={{opacity: thirdFormProperties.opacity, display: thirdFormProperties.display}} onSubmit={thirdFormSubmit} >
                            <div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password:" type="password" />
                            </div>
                            <div>
                                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm:" type="password" />
                            </div>
                            <div>
                                <button type="submit">SIGN UP</button>
                            </div>
                            <div>
                                <Link href={"/auth/signin"}>
                                    Click here to sign in!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
  
export async function getStaticProps() {
    const res = await fetch(`${API_URL}/users/list`)
    const data = await res.json()
    return {
        props: {
            usersList: data.users 
        }
    }
}