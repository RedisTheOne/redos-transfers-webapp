import Head from 'next/head'
import style from '../../styles/dashboard/Index.module.scss'
import { API_URL } from '../../globals'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from '../../components/Loading'
import toastStyles from '../../styles/Toast.module.scss'
import { UserContext } from '../../context/User'
import { MobileOptions, SideBar } from '../../components/SideBar'

export default function Add() {
    //VARIABLES
    const [user, setUser] = useContext(UserContext)
    const router = useRouter()
    const [toastTop, setToastTop] = useState(-65)
    const [toastTextOpacity, setToastTextOpacity] = useState(0)
    const [toastText, setToastText] = useState('AAA')

    // FIND USER
    const findUser = (id) => {
        let username = ""
        user.users.forEach(u => {
            if(u._id === id)
                username = u.username
        })
        return username
    }

    //CHECK IF USER IS FETCHED OR NOT
    useEffect(() => {
        if(!user.isFetched) {
            fetch(`${API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if(data.status && data.user) {
                        let i = 0
                        const users = []
                        data.notifications.forEach(n => {
                            if(!n.is_seen)
                                i += 1
                        })
                        data.users.forEach((u) => {
                            if(u.username !== data.user.username)
                                users.push(u)
                        })
                        setUser({
                            username: data.user.username,
                            email: data.user.email,
                            notifications: data.notifications,
                            recievedTransfers: data.recievedTransfers,
                            sentTransfers: data.sentTransfers,
                            region: data.user.region,
                            balance: data.user.balance,
                            isFetched: true,
                            phoneNumber: data.user.phone_number,
                            users: data.users,
                            filteredUsers: users,
                            newNotifications: i
                        })
                    }
                    else {
                        localStorage.removeItem('TOKEN')
                        router.push('/auth/signin')
                    }
                })   
        }
    }, [user])

    //SEND TRANSFER
    const sendTransfer = (e) => {
        e.preventDefault()
        if(document.getElementById('quantityInput').value > 0 && document.getElementById('quantityInput').value <= user.balance) {
            showToast('Sending the transfer...')
            fetch(`${API_URL}/transfers/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('TOKEN')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reciever_id: document.getElementById('userSelect').value, quantity: document.getElementById('quantityInput').value })
            })
                .then(res => res.json())
                .then((data) => {
                    showToast('Transfer was sent successfully')
                    //EDIT CONTEXT
                    setUser({
                        ...user, 
                        sentTransfers: [...user.sentTransfers, { reciever_id: document.getElementById('userSelect').value, quantity: document.getElementById('quantityInput').value }],
                        notifications: [data.notification, ...user.notifications],
                        newNotifications: user.newNotifications + 1,
                        balance: user.balance - document.getElementById('quantityInput').value
                    })
                })
        } else 
            showToast('Please add required fields')
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
    if (!user.isFetched)
        return <Loading />
    
    return (
        <div>
            <Head>
                <title>REDOS TRANSFERS | ADD</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
            </Head>
            {/* TOAST */}
            <div onClick={() => toastClicked()} className={toastStyles.toast} style={{top: toastTop}}>
                <p style={{opacity: toastTextOpacity}}>{toastText}</p>
            </div>
            <div id="dashboard" className={style.dashboard}>
                {/* SIDEBAR */}
                <SideBar />
                {/* THE CONTAINER */}
                <div className={style.container}>
                    <div className={style.header}>
                        <h1>Add transfer</h1>
                    </div>
                    <form onSubmit={sendTransfer}>
                        <div>
                            <select id="userSelect">
                                {user.filteredUsers.map((u, i) => (
                                    <option value={u._id} key={i}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <input id="quantityInput" placeholder="Quantity:" type="number" min="0" max={user.balance} />
                        </div>
                        <button>SEND</button>
                    </form>
                </div>
                {/* MOBILE MENU ICON  */}
                <MobileOptions />
            </div>
        </div>
    )
}