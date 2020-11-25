import style from '../styles/dashboard/Index.module.scss'
import Image from 'next/image'
import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '../context/User'

export function SideBar() {
    // VARIABLES
    const router = useRouter()
    //VARIABLES
    const setUser = useContext(UserContext)[1]

    // LOG OUT CLICKED
    const logOutClicked = () => {
        setUser({ isFetched: false })
        localStorage.removeItem('TOKEN')
        router.push('/auth/signin')
    }

    return (
        <div className={style.side_bar} id="sidebar">
            <Image
                src='/images/logo-2.png'
                alt=''
                width="100"
                height="100" />
            <div className={style.options}>
                <div onClick={() => router.push('/dashboard')}>
                    <i className="fa fa-home icon"></i>
                    <p>HOME</p>
                </div>
                <div onClick={() => router.push('/dashboard/add')}>
                    <i className="fa fa-plus icon"></i>
                    <p>ADD</p>
                </div>
                <div onClick={() => router.push('/dashboard/information')}>
                    <i className="fa fa-user icon"></i>
                    <p>INFORMATION</p>
                </div>
                <div onClick={() => logOutClicked()}>
                    <i className="fa fa-sign-out icon"></i>
                    <p>LOG OUT</p>
                </div>
            </div>
        </div>
    )
}

export function MobileOptions() {
    const [sidebarIsVisible, setSidebarIsVisible] = useState(false)
    useEffect(() => {
        if(window.innerWidth > 950)
            setSidebarIsVisible(true)
    }, [])

    // SHOW AND HIDE THE SIDEBAR
    const mobileMenuClicked = () => {
        if(!sidebarIsVisible) {
            document.getElementById('sidebar').style.marginLeft = '0px'
            setSidebarIsVisible(true)
        } else {
            document.getElementById('sidebar').style.marginLeft = '-270px'
            setSidebarIsVisible(false)
        }
    }

    return (
        <div className={style.menu_options} onClick={() => mobileMenuClicked()}>
            <i className="fa fa-th-list icon"></i> 
        </div>
    )
}