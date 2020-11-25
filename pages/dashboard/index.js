import Head from 'next/head'
import style from '../../styles/dashboard/Index.module.scss'
import { API_URL } from '../../globals'
import { useEffect, useContext, useState } from 'react'
import { UserContext } from '../../context/User'
import { MobileOptions, SideBar } from '../../components/SideBar'
import { useRouter } from 'next/router'
import Loading from '../../components/Loading'
import Notifications from '../../components/Notifications'
import RecievedTransfers from '../../components/RecievedTransfers'
import SentTransfers from '../../components/SentTransfers'

export default function Index() {
    //VARIABLES
    const [user, setUser] = useContext(UserContext)
    const [notificationsOpacity, setNotificationsOpacity] = useState(0)
    const [notificationsDisplay, setNotificationsDisplay] = useState('none')
    const router = useRouter()

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

    //NOTIFICATION CLICKED 
    const notificationsClicked = () => {
        setNotificationsDisplay('block')
        setUser({...user, newNotifications: 0})
        clearUnseenNotifications()
        setTimeout(() => {
            document.getElementById('dashboard').style.filter = 'brightness(40%)'
            document.getElementById('dashboard').style.pointerEvents = 'none'
            setNotificationsOpacity(1)
        }, 100)
    }

    //CLOSE NOTIFICATIONS
    const closeNotifications = () => {
        document.getElementById('dashboard').style.filter = 'brightness(100%)'
        document.getElementById('dashboard').style.pointerEvents = 'auto'
        setNotificationsOpacity(0)
        setTimeout(() => {
            setNotificationsDisplay('none')
        }, 200)
    }

    //DELTE FROM SERVER UNSEEN NOTIFICATIONS
    const clearUnseenNotifications = () => {
        user.notifications.forEach(notification => {
            if(!notification.is_seen) {
                fetch(`${API_URL}/notifications/seen`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: `{"notification_id": "${notification._id}"}`
                })
            }
        })
    }

    if (!user.isFetched)
        return <Loading />
    return (
        <div>
            <Head>
                <title>REDOS TRANSFERS | HOME</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
            </Head>
            <div id="dashboard" className={style.dashboard}>
                {/* SIDEBAR */}
                <SideBar />
                {/* THE CONTAINER */}
                <div className={style.container}>
                    <div className={style.header}>
                        <h1>Dashboard</h1>
                        <div className={style.notification_container}>
                            <div onClick={() => notificationsClicked()} className={style.notification}>
                                <i className="fa fa-bell icon"></i>
                                <div className={style.unread_notifications}><label>{user.newNotifications}</label></div>
                            </div>
                            <div className={style.username}>
                                <label>{user.username}</label>
                            </div>
                        </div>
                    </div>
                    <RecievedTransfers users={user.users} transfers={user.recievedTransfers} />
                    <SentTransfers users={user.users} transfers={user.sentTransfers} />
                </div>
                {/* MOBILE MENU ICON  */}
                <MobileOptions />
            </div>
            <Notifications notifications={user.notifications} display={notificationsDisplay} opacity={notificationsOpacity} closeNotifications={() => closeNotifications()} />
        </div>
    )
}