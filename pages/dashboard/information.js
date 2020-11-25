import Head from 'next/head'
import style from '../../styles/dashboard/Index.module.scss'
import informationStyle from '../../styles/dashboard/Information.module.scss'
import { API_URL } from '../../globals'
import { UserContext } from '../../context/User'
import { MobileOptions, SideBar } from '../../components/SideBar'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Loading from '../../components/Loading'

export default function Information() {
    //VARIABLES
    const [user, setUser] = useContext(UserContext)
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

    if (!user.isFetched)
        return <Loading />
    
    return (
        <div>
            <Head>
                <title>REDOS TRANSFERS | INFORMATION</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
            </Head>
            <div className={style.dashboard}>
                {/* SIDEBAR */}
                <SideBar />
                {/* CONTAINER */}
                <div className={style.container}>
                    <div className={style.header}>
                        <h1>Information</h1>
                    </div>
                    <div className={informationStyle.container}>
                        <div className={informationStyle.information}>
                            <p>Username: {user.username}</p>
                        </div>
                        <div className={informationStyle.information}>
                            <p>Region: {user.region}</p>
                        </div>
                        <div className={informationStyle.information}>
                            <p>Phone Number: {user.phoneNumber}</p>
                        </div>
                        <div className={informationStyle.information}>
                            <p>Region: {user.region}</p>
                        </div>
                        <div className={informationStyle.information}>
                            <p>Balance: {user.balance}</p>
                        </div>
                    </div>
                </div>
                {/* MOBILE MENU ICON  */}
                <MobileOptions />
            </div>
        </div>
    )
}