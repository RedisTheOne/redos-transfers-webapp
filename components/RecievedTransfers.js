import style from '../styles/dashboard/Transfers.module.scss'

export default function RecievedTransfers({ transfers, users }) {
    //FIND THE USER WITH ID
    const findUser = (id) => {
        let username = ""
        users.forEach(u => {
            if(u._id === id)
                username = u.username
        })
        return username
    }

    if(transfers.length === 0)
        return (
            <div className={style.container}>
                <div className={style.header}>
                    <p>Recieved trasnsfers</p>
                </div>
                <div className={style.no_transfers}>
                    <p>You haven't recieved anything!</p>
                </div>
            </div>
        )

    return (
        <div className={style.container}>
            <div className={style.header}>
                <p>Recieved trasnsfers</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className={style.border_right}>Sender</th>
                        <th>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((t, i) => (
                        <tr key={i}>
                            <td className={style.border_right}>{findUser(t.sender_id)}</td>
                            <td>{t.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}