import style from '../styles/notifications/Notifications.module.scss'

export default function Notifications({ opacity, closeNotifications, display, notifications }) {
    if(notifications.length === 0)
        return (
            <div style={{opacity, display}} className={style.container}>
                <div className={style.close_div}>
                    <i onClick={() => closeNotifications()} className="fa fa-close icon"></i>
                </div>
                <div className={style.notifications}>
                    <p style={{fontWeight: "bold", textAlign: 'center'}}>No notifications!</p>
                </div>
            </div>
        )
    return (
        <div style={{opacity, display}} className={style.container}>
            <div className={style.close_div}>
                <i onClick={() => closeNotifications()} className="fa fa-close icon"></i>
            </div>
            <div className={style.notifications}>
                {notifications.map((n, i) => {
                    const time = new Date(n.time)
                    return (
                        <div key={i} className={style.notification}>
                            <p className={style.date}>{time.getDate() + "/" + (parseInt(time.getMonth()) + 1).toString() + "/" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes()}</p>
                            <p>{n.msg}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}